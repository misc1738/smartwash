# M-Pesa Daraja API Integration Guide

This guide explains how to use the M-Pesa integration in the SmartWash project.

## Table of Contents
1. [Setup](#setup)
2. [Backend API](#backend-api)
3. [Frontend Usage](#frontend-usage)
4. [Testing](#testing)
5. [Production Checklist](#production-checklist)

## Setup

### 1. Environment Variables

The M-Pesa credentials are stored in `/server/.env`:

```env
MPESA_CONSUMER_KEY=RGrLBJ6WNFOGRCAGC70PYT8gu9dmc98iACw3mZDRAJp1Ovsd
MPESA_CONSUMER_SECRET=ZvUS8ViAXDFeSPctLayLEniGfhMBX8IeLcAdlOHihLfsGUHtznvJRsg8SR0yXq82
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_SHORTCODE=174379
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

**Important Notes:**
- The shortcode `174379` and passkey are for the Safaricom sandbox environment
- For production, you'll need to update these with your live credentials
- Update `MPESA_CALLBACK_URL` to your production domain

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start the Server

```bash
cd server
npm start
```

The server will run on port 4000 (or the PORT specified in .env).

## Backend API

The M-Pesa service provides the following endpoints:

### 1. Initiate STK Push Payment

**Endpoint:** `POST /api/mpesa/stkpush`

**Request Body:**
```json
{
  "phoneNumber": "254712345678",
  "amount": 100,
  "accountReference": "ORDER123",
  "transactionDesc": "SmartWash Payment"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "MerchantRequestID": "29115-34620561-1",
    "CheckoutRequestID": "ws_CO_191220191020363925",
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing",
    "CustomerMessage": "Success. Request accepted for processing"
  }
}
```

### 2. Query Payment Status

**Endpoint:** `POST /api/mpesa/query`

**Request Body:**
```json
{
  "checkoutRequestID": "ws_CO_191220191020363925"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ResponseCode": "0",
    "ResponseDescription": "The service request has been accepted successfully",
    "MerchantRequestID": "29115-34620561-1",
    "CheckoutRequestID": "ws_CO_191220191020363925",
    "ResultCode": "0",
    "ResultDesc": "The service request is processed successfully."
  }
}
```

### 3. M-Pesa Callback

**Endpoint:** `POST /api/mpesa/callback`

This endpoint receives callbacks from M-Pesa when a payment is completed. You should:
1. Update your database with the payment status
2. Send notifications to users
3. Update order status

The callback is handled automatically by the server.

### 4. Register C2B URLs

**Endpoint:** `POST /api/mpesa/register-urls`

**Request Body:**
```json
{
  "confirmationURL": "https://yourdomain.com/api/mpesa/confirmation",
  "validationURL": "https://yourdomain.com/api/mpesa/validation"
}
```

## Frontend Usage

### Using the React Hook

```jsx
import { useMpesa } from '../hooks/useMpesa';

function PaymentComponent() {
  const { loading, error, initiatePayment, queryPaymentStatus } = useMpesa();

  const handlePayment = async () => {
    try {
      const result = await initiatePayment({
        phoneNumber: '254712345678',
        amount: 500,
        accountReference: 'ORDER-123',
        transactionDesc: 'Car wash service'
      });

      if (result.success) {
        console.log('Payment initiated:', result.data);
        // Poll for status or wait for callback
      }
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with M-Pesa'}
    </button>
  );
}
```

### Using the MpesaPayment Component

```jsx
import MpesaPayment from './components/MpesaPayment';

function CheckoutPage() {
  const handleSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Update UI, redirect, etc.
  };

  const handleError = (error) => {
    console.error('Payment error:', error);
    // Show error message
  };

  return (
    <MpesaPayment
      amount={1500}
      accountReference="ORDER-123"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## Testing

### Sandbox Test Credentials

Use these Safaricom sandbox numbers for testing:

**Test Phone Numbers:**
- `254708374149` - Completes successfully
- `254711111111` - Simulates user cancellation
- `254722222222` - Simulates insufficient balance

**Testing Flow:**
1. Enter a test phone number
2. Click "Pay Now"
3. You'll receive a simulated STK Push
4. The system will poll for status
5. Payment completes or fails based on the test number

### Sandbox Environment

The integration is currently configured for the Safaricom sandbox:
- Base URL: `https://sandbox.safaricom.co.ke`
- Shortcode: `174379` (Safaricom test shortcode)
- Passkey: Sandbox passkey provided

## Production Checklist

Before deploying to production:

### 1. Update Environment Variables

```env
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=<your-production-consumer-key>
MPESA_CONSUMER_SECRET=<your-production-consumer-secret>
MPESA_PASSKEY=<your-production-passkey>
MPESA_SHORTCODE=<your-business-shortcode>
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

### 2. Setup Callback URL

- Ensure your callback URL is publicly accessible
- Use HTTPS (required by M-Pesa)
- Consider using ngrok for local testing: `ngrok http 4000`
- Update the callback URL in your .env file

### 3. Register URLs with Safaricom

Run this once to register your callback URLs:

```bash
curl -X POST http://localhost:4000/api/mpesa/register-urls \
  -H "Content-Type: application/json" \
  -d '{
    "confirmationURL": "https://yourdomain.com/api/mpesa/callback",
    "validationURL": "https://yourdomain.com/api/mpesa/callback"
  }'
```

### 4. Security Considerations

- Keep your Consumer Key and Secret secure
- Never expose them in frontend code
- Use environment variables
- Add request validation and rate limiting
- Verify callback authenticity

### 5. Database Integration

Update the callback handler in `server/index.js` to:
- Store transaction records in your database
- Update order status
- Send email/SMS notifications
- Handle duplicate callbacks

### 6. Error Handling

- Implement proper error logging
- Set up monitoring and alerts
- Handle network failures gracefully
- Provide clear user feedback

### 7. Frontend Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:4000
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com
```

## Common Issues

### 1. "Invalid Access Token"
- Check your Consumer Key and Secret
- Ensure they're from the correct environment (sandbox/production)

### 2. "Invalid Shortcode"
- Verify your shortcode matches your environment
- Sandbox: Use 174379
- Production: Use your registered shortcode

### 3. Callback Not Received
- Ensure callback URL is publicly accessible
- Must use HTTPS in production
- Check firewall settings
- Verify URL is registered with Safaricom

### 4. STK Push Not Appearing on Phone
- Verify phone number format (254XXXXXXXXX)
- Check if the number is M-Pesa registered
- Ensure sufficient balance (in production)
- Try a different phone in sandbox

## Additional Resources

- [Safaricom Daraja Documentation](https://developer.safaricom.co.ke/Documentation)
- [Daraja API Portal](https://developer.safaricom.co.ke/)
- [Test Credentials](https://developer.safaricom.co.ke/test_credentials)

## Support

For issues with the integration:
1. Check the server logs for errors
2. Verify your environment variables
3. Test with sandbox credentials first
4. Contact Safaricom support for API issues
