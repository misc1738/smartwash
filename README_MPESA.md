# 💳 M-Pesa Daraja API Integration

Complete M-Pesa payment integration for SmartWash using Safaricom's Daraja API.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Support](#support)

## 🎯 Overview

This integration provides a complete, production-ready M-Pesa payment solution for SmartWash with:

- **STK Push** - Customer-initiated payments
- **Real-time Status** - Automatic payment verification
- **Callback Handling** - Server-side payment confirmations
- **React Components** - Ready-to-use UI components
- **TypeScript Ready** - Type-safe implementation

### Your Credentials

**Consumer Key:** `RGrLBJ6WNFOGRCAGC70PYT8gu9dmc98iACw3mZDRAJp1Ovsd`  
**Environment:** Sandbox (for testing)  
**Shortcode:** 174379

## ✨ Features

### Backend
- ✅ OAuth token management with auto-refresh
- ✅ STK Push API integration
- ✅ Payment status queries
- ✅ Callback processing
- ✅ C2B URL registration
- ✅ Environment-based configuration
- ✅ Comprehensive error handling

### Frontend
- ✅ React hook (`useMpesa`)
- ✅ Pre-built payment component
- ✅ Phone number validation & formatting
- ✅ Real-time status updates
- ✅ Loading & error states
- ✅ Success/failure callbacks
- ✅ Dark mode support

## 🚀 Quick Start

### 1. Installation

```bash
# Option 1: Use the setup script
./setup-mpesa.sh

# Option 2: Manual installation
cd server
npm install
cd ..
npm install
```

### 2. Start Services

```bash
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend (in project root)
npm run dev
```

### 3. Test the Integration

Navigate to: `http://localhost:5173/mpesa-test`

Use sandbox test number: `254708374149`

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [MPESA_QUICKSTART.md](./MPESA_QUICKSTART.md) | 5-minute setup guide |
| [MPESA_INTEGRATION.md](./MPESA_INTEGRATION.md) | Complete integration guide |
| [MPESA_FLOW.md](./MPESA_FLOW.md) | Payment flow diagrams |
| [MPESA_SUMMARY.md](./MPESA_SUMMARY.md) | Overview & checklist |

## 📁 Project Structure

```
smartwash-master/
├── server/
│   ├── mpesa.service.js        # M-Pesa API service
│   ├── index.js                # Express server with routes
│   ├── .env                    # Environment variables (gitignored)
│   ├── .env.example            # Template for .env
│   └── package.json            # Server dependencies
│
├── src/
│   ├── hooks/
│   │   └── useMpesa.js         # React hook for payments
│   ├── components/
│   │   ├── MpesaPayment.jsx           # Payment UI component
│   │   └── MpesaPaymentExample.jsx    # Usage example
│   └── pages/
│       └── MpesaTestPage.jsx          # Test page
│
├── .env                        # Frontend config (gitignored)
├── .env.example                # Frontend template
│
└── Documentation/
    ├── MPESA_QUICKSTART.md     # Quick start guide
    ├── MPESA_INTEGRATION.md    # Full guide
    ├── MPESA_FLOW.md           # Flow diagrams
    ├── MPESA_SUMMARY.md        # Summary
    └── README_MPESA.md         # This file
```

## 🔌 API Reference

### Backend Endpoints

Base URL: `http://localhost:4000`

#### 1. Initiate Payment
```http
POST /api/mpesa/stkpush
Content-Type: application/json

{
  "phoneNumber": "254712345678",
  "amount": 1500,
  "accountReference": "ORDER-123",
  "transactionDesc": "Car wash service"
}
```

#### 2. Check Payment Status
```http
POST /api/mpesa/query
Content-Type: application/json

{
  "checkoutRequestID": "ws_CO_191220191020363925"
}
```

#### 3. M-Pesa Callback
```http
POST /api/mpesa/callback
```
Automatically handles M-Pesa payment callbacks.

#### 4. Register URLs
```http
POST /api/mpesa/register-urls
Content-Type: application/json

{
  "confirmationURL": "https://yourdomain.com/api/mpesa/callback",
  "validationURL": "https://yourdomain.com/api/mpesa/callback"
}
```

### Frontend Usage

#### Using the Component
```jsx
import MpesaPayment from './components/MpesaPayment';

<MpesaPayment
  amount={1500}
  accountReference="ORDER-123"
  onSuccess={(data) => console.log('Payment successful!', data)}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

#### Using the Hook
```jsx
import { useMpesa } from './hooks/useMpesa';

function PaymentButton() {
  const { initiatePayment, loading, error } = useMpesa();

  const handlePay = async () => {
    const result = await initiatePayment({
      phoneNumber: '254712345678',
      amount: 500,
      accountReference: 'ORDER-123'
    });
  };

  return (
    <button onClick={handlePay} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
```

## 🧪 Testing

### Sandbox Test Numbers

| Phone Number | Result |
|--------------|--------|
| 254708374149 | ✅ Success |
| 254711111111 | ❌ User cancelled |
| 254722222222 | ❌ Insufficient balance |

### Testing Checklist

- [ ] Server starts without errors
- [ ] Frontend can reach backend API
- [ ] STK Push initiates successfully
- [ ] Phone number validation works
- [ ] Payment status updates correctly
- [ ] Success callback fires
- [ ] Error handling works
- [ ] UI states display properly

### Manual Testing

1. **Start services**
   ```bash
   cd server && npm start
   npm run dev
   ```

2. **Open test page**
   ```
   http://localhost:5173/mpesa-test
   ```

3. **Enter test number**
   ```
   254708374149
   ```

4. **Verify flow**
   - STK Push initiated
   - Status changes to "Processing"
   - Payment completes
   - Success message shown

## 🚀 Deployment

### Pre-deployment Checklist

#### 1. Environment Variables

**Production `.env` (server/)**
```env
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=<production-key>
MPESA_CONSUMER_SECRET=<production-secret>
MPESA_PASSKEY=<production-passkey>
MPESA_SHORTCODE=<your-shortcode>
MPESA_CALLBACK_URL=https://api.yourdomain.com/api/mpesa/callback
```

**Production `.env` (root/)**
```env
VITE_API_URL=https://api.yourdomain.com
```

#### 2. Callback URL Setup

- Must be publicly accessible
- Must use HTTPS
- Must be registered with Safaricom
- Test with ngrok first:
  ```bash
  ngrok http 4000
  # Update MPESA_CALLBACK_URL with ngrok URL
  ```

#### 3. Security

- [ ] Credentials in environment variables
- [ ] `.env` files gitignored
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Request validation added
- [ ] Callback authentication implemented

#### 4. Database Integration

Update `server/index.js` callback handler:
```javascript
app.post('/api/mpesa/callback', async (req, res) => {
  const result = mpesaService.processCallback(req.body);
  
  // Add your code:
  // 1. Save to database
  // 2. Update order status
  // 3. Send notifications
  // 4. Trigger webhooks
  
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});
```

### Deployment Steps

1. **Deploy Backend**
   ```bash
   # Deploy to your server (e.g., Heroku, Railway, DigitalOcean)
   cd server
   git push production main
   ```

2. **Deploy Frontend**
   ```bash
   # Build and deploy (e.g., Vercel, Netlify)
   npm run build
   # Deploy dist/ folder
   ```

3. **Register Callback URL**
   ```bash
   curl -X POST https://api.yourdomain.com/api/mpesa/register-urls \
     -H "Content-Type: application/json" \
     -d '{
       "confirmationURL": "https://api.yourdomain.com/api/mpesa/callback",
       "validationURL": "https://api.yourdomain.com/api/mpesa/callback"
     }'
   ```

4. **Test Production**
   - Use small amounts first
   - Verify callbacks are received
   - Check database updates
   - Monitor logs

## 🐛 Troubleshooting

### Common Issues

#### "Cannot connect to server"
```bash
# Check server is running
cd server && npm start

# Verify port 4000 is available
lsof -i :4000

# Check VITE_API_URL in .env
echo $VITE_API_URL
```

#### "Invalid Access Token"
```bash
# Verify credentials in server/.env
cat server/.env | grep MPESA

# Ensure no extra spaces or quotes
```

#### "STK Push not working"
```bash
# Check phone format (must be 254XXXXXXXXX)
# Try sandbox test numbers
# Check server logs for errors
tail -f server/logs/app.log
```

#### CORS Errors
- Server has CORS enabled by default
- Ensure requests from localhost:5173
- Check browser console for details

### Debug Mode

Enable detailed logging:
```javascript
// In server/mpesa.service.js
console.log('Request:', JSON.stringify(requestBody, null, 2));
console.log('Response:', JSON.stringify(response.data, null, 2));
```

## 📞 Support

### Resources
- [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
- [API Documentation](https://developer.safaricom.co.ke/Documentation)
- [Test Credentials](https://developer.safaricom.co.ke/test_credentials)
- [Community Forum](https://developer.safaricom.co.ke/community)

### Getting Help

1. Check the documentation files
2. Review server logs
3. Test with sandbox credentials
4. Check Safaricom API status
5. Contact Safaricom support

### Project Issues

If you encounter issues with the integration:
1. Verify all dependencies are installed
2. Check environment variables
3. Review server logs
4. Test with curl/Postman first
5. Check network connectivity

## 📝 License

This integration is part of the SmartWash project.

## 🎉 Acknowledgments

- Safaricom Daraja API Team
- React & Express communities
- SmartWash development team

---

**Ready to accept payments!** 🚀

For quick help: Check `MPESA_QUICKSTART.md`  
For detailed guide: Read `MPESA_INTEGRATION.md`  
For visual flow: See `MPESA_FLOW.md`
