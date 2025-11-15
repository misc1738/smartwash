import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useMpesa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  /**
   * Initiate M-Pesa STK Push payment
   * @param {Object} paymentDetails - Payment details
   * @param {string} paymentDetails.phoneNumber - Customer phone number (254XXXXXXXXX)
   * @param {number} paymentDetails.amount - Amount to charge
   * @param {string} paymentDetails.accountReference - Account reference (e.g., order ID)
   * @param {string} paymentDetails.transactionDesc - Transaction description
   * @returns {Promise<Object>} Payment response
   */
  const initiatePayment = async (paymentDetails) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/mpesa/stkpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDetails),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      setPaymentData(data.data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Query payment status
   * @param {string} checkoutRequestID - Checkout request ID from STK Push
   * @returns {Promise<Object>} Payment status response
   */
  const queryPaymentStatus = async (checkoutRequestID) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/mpesa/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkoutRequestID }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Query failed');
      }

      return data;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while checking payment status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset hook state
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setPaymentData(null);
  };

  return {
    loading,
    error,
    paymentData,
    initiatePayment,
    queryPaymentStatus,
    reset,
  };
};
