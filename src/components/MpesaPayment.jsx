import { useState, useEffect } from 'react';
import { useMpesa } from '../hooks/useMpesa';
import { Smartphone, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const MpesaPayment = ({ amount, accountReference, onSuccess, onError }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const { loading, error, initiatePayment, queryPaymentStatus } = useMpesa();

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    // Limit to 12 digits (254XXXXXXXXX)
    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    // Auto-add 254 prefix if user starts with 0 or 7
    if (value.startsWith('0')) {
      value = '254' + value.slice(1);
    } else if (value.startsWith('7') && !value.startsWith('254')) {
      value = '254' + value;
    }

    setPhoneNumber(value);
  };

  const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    if (phone.startsWith('254')) {
      return '+' + phone.slice(0, 3) + ' ' + phone.slice(3, 6) + ' ' + phone.slice(6, 9) + ' ' + phone.slice(9);
    }
    return phone;
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 12) {
      alert('Please enter a valid phone number');
      return;
    }

    setPaymentStatus('processing');

    try {
      const result = await initiatePayment({
        phoneNumber,
        amount: 1, // FORCE 1 KES FOR TESTING to avoid "insufficient funds"
        accountReference: accountReference || `ORDER-${Date.now()}`,
        transactionDesc: 'SmartWash Service Payment',
      });

      if (result.success) {
        setCheckoutRequestID(result.data.CheckoutRequestID);
        // Poll for payment status
        pollPaymentStatus(result.data.CheckoutRequestID);
      } else {
        setPaymentStatus('failed');
        if (onError) onError(result.error);
      }
    } catch (err) {
      setPaymentStatus('failed');
      if (onError) onError(err.message);
    }
  };

  const pollPaymentStatus = async (requestID) => {
    let attempts = 0;
    const maxAttempts = 60; // Poll for 120 seconds

    const poll = setInterval(async () => {
      attempts++;

      try {
        const result = await queryPaymentStatus(requestID);
        handleQueryResult(result, poll);
      } catch (err) {
        // Continue polling on error
      }

      if (attempts >= maxAttempts) {
        clearInterval(poll);
        setPaymentStatus('timeout');
        if (onError) onError('Payment verification timeout. Please check your phone.');
      }
    }, 2000);
  };

  const handleQueryResult = (result, pollInterval) => {
    if (result.success && result.data) {
      const raw = result.data;
      const possibleCodes = [
        raw.ResultCode,
        raw.ResponseCode,
        raw.Result?.ResultCode,
        raw.Response?.ResultCode,
      ];

      const found = possibleCodes.find((c) => c !== undefined && c !== null);
      const resultCode = found !== undefined && found !== null ? Number(found) : null;

      if (resultCode === 0) {
        if (pollInterval) clearInterval(pollInterval);
        setPaymentStatus('success');
        if (onSuccess) onSuccess(result.data);
      } else {
        // Any other code is a failure (including 1032 Cancelled, 1037 Timeout, 1 Insufficient Funds)
        if (pollInterval) clearInterval(pollInterval);
        setPaymentStatus('failed');
        const message = raw.ResultDesc || raw.ResponseDescription || raw.Response?.ResponseDescription || raw.Result?.ResultDesc || 'Payment failed';
        if (onError) onError(message);
      }
    }
  };

  const manualCheck = async () => {
    if (!checkoutRequestID) return;
    try {
      const result = await queryPaymentStatus(checkoutRequestID);
      handleQueryResult(result, null);

      if (result.success && result.data) {
        const raw = result.data;
        const possibleCodes = [raw.ResultCode, raw.ResponseCode, raw.Result?.ResultCode];
        const found = possibleCodes.find(c => c !== undefined && c !== null);
        const code = Number(found);

        if (code !== 0) {
          const msg = raw.ResultDesc || raw.ResponseDescription || "Payment not successful";
          alert(`Status: ${msg}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Could not verify status yet. Please try again in a few seconds.");
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    // Don't clear the phone number so user can correct it
    setCheckoutRequestID(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Smartphone className="w-12 h-12 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
        M-Pesa Payment
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Pay with Lipa Na M-Pesa
      </p>

      {paymentStatus === 'idle' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="2547XXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your Safaricom number
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Amount to Pay:</span>
                <span className="text-2xl font-bold text-green-600">
                  KES {(amount || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-right">
                *Test Mode: You will be prompted to pay KES 1
              </p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !phoneNumber || phoneNumber.length < 12}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </>
      )}

      {paymentStatus === 'processing' && (
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-green-600" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Processing Payment
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Check your phone for the M-Pesa prompt and enter your PIN
          </p>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-4 h-4" />
              <span>Waiting for payment confirmation...</span>
            </div>
            <button
              onClick={manualCheck}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
            >
              Check Payment Status
            </button>
          </div>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Payment Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your payment has been processed successfully
          </p>
          <button
            onClick={resetPayment}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Make Another Payment
          </button>
        </div>
      )}

      {(paymentStatus === 'failed' || paymentStatus === 'timeout') && (
        <div className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Payment {paymentStatus === 'timeout' ? 'Timeout' : 'Failed'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'Your payment could not be processed'}
          </p>
          <button
            onClick={resetPayment}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MpesaPayment;
