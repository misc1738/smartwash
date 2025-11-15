# M-Pesa Integration - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies (if needed)
cd ..
npm install
```

### 2. Start the Server

```bash
cd server
npm start
```

Server will run on `http://localhost:4000`

### 3. Start the Client

```bash
# In a new terminal, from the root directory
npm run dev
```

Client will run on `http://localhost:5173` (or the port Vite assigns)

## 🧪 Testing the Integration

### Option 1: Use the Test Page

1. Add this route to your React Router configuration:

```jsx
import MpesaTestPage from './pages/MpesaTestPage';

// In your routes
<Route path="/mpesa-test" element={<MpesaTestPage />} />
```

2. Navigate to `http://localhost:5173/mpesa-test`

### Option 2: Test with API Directly

Use curl or Postman:

```bash
curl -X POST http://localhost:4000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254708374149",
    "amount": 100,
    "accountReference": "TEST-001",
    "transactionDesc": "Test Payment"
  }'
```

### Test Phone Numbers (Sandbox)

- **254708374149** - Success (payment completes)
- **254711111111** - User cancelled
- **254722222222** - Insufficient balance

## 📁 Files Created

### Backend (Server)
- ✅ `server/mpesa.service.js` - M-Pesa service with all API methods
- ✅ `server/index.js` - Updated with M-Pesa routes
- ✅ `server/.env` - Environment variables with your credentials
- ✅ `server/package.json` - Updated with axios dependency

### Frontend (Client)
- ✅ `src/hooks/useMpesa.js` - React hook for M-Pesa payments
- ✅ `src/components/MpesaPayment.jsx` - Complete payment UI component
- ✅ `src/components/MpesaPaymentExample.jsx` - Example implementation
- ✅ `src/pages/MpesaTestPage.jsx` - Test page
- ✅ `.env` - API URL configuration

### Documentation
- ✅ `MPESA_INTEGRATION.md` - Complete integration guide
- ✅ `MPESA_QUICKSTART.md` - This quick start guide

## 🎯 Integration Into Your App

### Add to Booking Flow

```jsx
import MpesaPayment from './components/MpesaPayment';

function BookingCheckout({ bookingDetails }) {
  const handleSuccess = (paymentData) => {
    // Save to database, update booking status, etc.
    console.log('Payment successful:', paymentData);
  };

  return (
    <MpesaPayment
      amount={bookingDetails.amount}
      accountReference={bookingDetails.orderId}
      onSuccess={handleSuccess}
      onError={(err) => console.error(err)}
    />
  );
}
```

### Using the Hook

```jsx
import { useMpesa } from '../hooks/useMpesa';

function CustomPaymentButton() {
  const { initiatePayment, loading } = useMpesa();

  const handlePay = async () => {
    const result = await initiatePayment({
      phoneNumber: '254712345678',
      amount: 500,
      accountReference: 'ORDER-123'
    });
    
    if (result.success) {
      console.log('Payment initiated!');
    }
  };

  return (
    <button onClick={handlePay} disabled={loading}>
      Pay Now
    </button>
  );
}
```

## 🔧 Configuration

### Current Setup (Sandbox)
- **Environment:** Sandbox
- **Shortcode:** 174379 (Safaricom test)
- **Base URL:** https://sandbox.safaricom.co.ke

### Your Credentials
- **Consumer Key:** RGrLBJ6WNFOGRCAGC70PYT8gu9dmc98iACw3mZDRAJp1Ovsd
- **Consumer Secret:** [Set in server/.env]

## 🔍 API Endpoints

All endpoints are prefixed with `http://localhost:4000/api/mpesa/`

1. **POST /stkpush** - Initiate payment
2. **POST /callback** - M-Pesa callback (handled automatically)
3. **POST /query** - Check payment status
4. **POST /register-urls** - Register callback URLs

## ✅ Verification Checklist

- [ ] Server running on port 4000
- [ ] Client can access the server
- [ ] No CORS errors in browser console
- [ ] STK Push request returns success
- [ ] Phone receives M-Pesa prompt (in sandbox, it's simulated)
- [ ] Payment status updates correctly

## 🐛 Common Issues

### "Cannot connect to server"
- Ensure server is running: `cd server && npm start`
- Check port 4000 is not in use
- Verify VITE_API_URL in `.env`

### "Invalid Access Token"
- Check Consumer Key/Secret in `server/.env`
- Ensure no extra spaces in credentials

### "STK Push failed"
- Verify phone number format: 254XXXXXXXXX
- Use sandbox test numbers
- Check server logs for detailed errors

### CORS Errors
- Server already has CORS enabled
- Ensure you're making requests from localhost

## 📞 Support

- Review `MPESA_INTEGRATION.md` for detailed documentation
- Check server console for error logs
- Verify credentials at [Daraja Portal](https://developer.safaricom.co.ke/)

## 🚀 Next Steps

1. ✅ Test with sandbox credentials
2. ⏳ Integrate into your booking flow
3. ⏳ Setup database to store transactions
4. ⏳ Add email/SMS notifications
5. ⏳ Deploy to staging
6. ⏳ Get production credentials
7. ⏳ Update environment variables for production
8. ⏳ Test with real transactions
9. ⏳ Deploy to production

## 📚 Additional Resources

- [M-Pesa Integration Guide](./MPESA_INTEGRATION.md)
- [Safaricom Daraja Docs](https://developer.safaricom.co.ke/Documentation)
- [API Portal](https://developer.safaricom.co.ke/)

---

**Ready to go!** Start the server and client, then navigate to `/mpesa-test` to see it in action.
