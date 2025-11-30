import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MpesaPayment from './MpesaPayment';
import bookingsService from '../mocks/bookingsService';

/**
 * Example component showing how to integrate M-Pesa payment
 * You can copy this pattern into your booking flow
 */
const MpesaPaymentExample = () => {
  const location = useLocation();
  const redirectedBooking = location.state?.booking || null;
  const [showPayment, setShowPayment] = useState(Boolean(redirectedBooking));
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Example booking details
  const bookingDetails = redirectedBooking || {
    service: 'Premium Wash',
    vehicle: 'Toyota Corolla',
    amount: 1500,
    date: '2025-11-15',
    time: '10:00 AM',
    orderId: `SW-${Date.now()}`,
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    setPaymentCompleted(true);

    // TODO: Update your booking status in database
    // TODO: Send confirmation email/SMS
    // TODO: Redirect to success page

    // If this was a redirected booking, mark it as paid in the (mock) bookings service
    try {
      if (redirectedBooking && redirectedBooking.id) {
        bookingsService.pay(redirectedBooking.id, 'mpesa').catch(() => { });
      }
    } catch (_) { }

    alert('Payment successful! Your booking is confirmed.');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your car wash has been scheduled successfully.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Service:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{bookingDetails.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{bookingDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{bookingDetails.time}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">Total Paid:</span>
                <span className="font-bold text-green-600">KES {bookingDetails.amount}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Booking Summary
          </h2>

          <div className="space-y-4 mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Service</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{String(bookingDetails.service)}</p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{String(bookingDetails.vehicle)}</p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Date & Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {String(bookingDetails.date)} at {String(bookingDetails.time)}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  KES {bookingDetails.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-3"
          >
            Proceed to Payment
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => setShowPayment(false)}
          className="mb-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Summary
        </button>

        <MpesaPayment
          amount={bookingDetails.amount}
          accountReference={bookingDetails.orderId}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default MpesaPaymentExample;
