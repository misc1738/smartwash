const axios = require('axios');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    
    // Set base URL based on environment
    this.baseURL = this.environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
    
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Generate access token for M-Pesa API
   */
  async getAccessToken() {
    try {
      // Return cached token if still valid
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Use expires_in from provider when available, otherwise fall back to 3599s
      const expiresIn = Number(response.data.expires_in) || 3599;
      // Refresh 60 seconds before expiry
      this.tokenExpiry = Date.now() + (expiresIn - 60) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  /**
   * Generate password for STK Push
   */
  generatePassword() {
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  /**
   * Get current timestamp in YYYYMMDDHHmmss format
   */
  getTimestamp() {
    // Generate timestamp in East Africa Time (UTC+3) to avoid password/timestamp mismatches
    const now = new Date();
    // Convert local time to UTC, then add 3 hours for EAT
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const eat = new Date(utc.getTime() + 3 * 60 * 60 * 1000);
    const year = eat.getUTCFullYear();
    const month = String(eat.getUTCMonth() + 1).padStart(2, '0');
    const day = String(eat.getUTCDate()).padStart(2, '0');
    const hours = String(eat.getUTCHours()).padStart(2, '0');
    const minutes = String(eat.getUTCMinutes()).padStart(2, '0');
    const seconds = String(eat.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Initiate STK Push (Lipa Na M-Pesa Online)
   * @param {string} phoneNumber - Customer phone number (format: 254XXXXXXXXX)
   * @param {number} amount - Amount to charge
   * @param {string} accountReference - Account reference (e.g., order ID)
   * @param {string} transactionDesc - Transaction description
   */
  async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc = 'SmartWash Payment') {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      // Clean phone number (remove + if present, ensure starts with 254)
      let cleanPhone = phoneNumber.replace(/\+/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '254' + cleanPhone.substring(1);
      }
      if (!cleanPhone.startsWith('254')) {
        cleanPhone = '254' + cleanPhone;
      }

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount), // Ensure amount is an integer
        PartyA: cleanPhone,
        PartyB: this.shortcode,
        PhoneNumber: cleanPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('STK Push Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Query STK Push transaction status
   * @param {string} checkoutRequestID - The checkout request ID from STK Push
   */
  async querySTKPushStatus(checkoutRequestID) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('STK Push Query Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Process M-Pesa callback
   * @param {object} callbackData - Callback data from M-Pesa
   */
  processCallback(callbackData) {
    try {
      const { Body } = callbackData;
      const { stkCallback } = Body;

      const result = {
        merchantRequestID: stkCallback.MerchantRequestID,
        checkoutRequestID: stkCallback.CheckoutRequestID,
        resultCode: stkCallback.ResultCode,
        resultDesc: stkCallback.ResultDesc,
      };

      // If successful payment (coerce numeric/string differences)
      const rc = Number(stkCallback.ResultCode);
      if (rc === 0) {
        // CallbackMetadata sometimes comes as { Item: [...] } or as an array directly
        const callbackMetadata = stkCallback.CallbackMetadata?.Item || stkCallback.CallbackMetadata || [];

        result.success = true;
        result.amount = callbackMetadata.find(item => item.Name === 'Amount')?.Value;
        result.mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
        result.transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
        result.phoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value;
      } else {
        result.success = false;
      }

      return result;
    } catch (error) {
      console.error('Callback Processing Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Register URLs for C2B (Customer to Business)
   * @param {string} confirmationURL - Confirmation URL
   * @param {string} validationURL - Validation URL
   */
  async registerC2BUrls(confirmationURL, validationURL) {
    try {
      const accessToken = await this.getAccessToken();

      const requestBody = {
        ShortCode: this.shortcode,
        ResponseType: 'Completed',
        ConfirmationURL: confirmationURL,
        ValidationURL: validationURL,
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/c2b/v1/registerurl`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('C2B URL Registration Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }
}

module.exports = new MpesaService();
