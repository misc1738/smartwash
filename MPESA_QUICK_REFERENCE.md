# M-Pesa Quick Reference Card

## 🚀 Getting Started (3 Commands)

```bash
./setup-mpesa.sh              # 1. Install dependencies
cd server && npm start         # 2. Start backend (Terminal 1)
npm run dev                    # 3. Start frontend (Terminal 2)
```

Then visit: `http://localhost:5173/mpesa-test`

---

## 🔑 Your Credentials

| Item | Value |
|------|-------|
| **Consumer Key** | `RGrLBJ6WNFOGRCAGC70PYT8gu9dmc98iACw3mZDRAJp1Ovsd` |
| **Shortcode** | `174379` |
| **Environment** | `sandbox` |
| **Passkey** | ✅ In `server/.env` |

---

## 📞 Test Numbers

| Number | Result |
|--------|--------|
| `254708374149` | ✅ Success |
| `254711111111` | ❌ Cancelled |
| `254722222222` | ❌ No funds |

---

## 🔌 API Endpoints

```
POST /api/mpesa/stkpush     → Initiate payment
POST /api/mpesa/callback    → M-Pesa callback
POST /api/mpesa/query       → Check status
POST /api/mpesa/register-urls → Register URLs
```

Base URL: `http://localhost:4000`

---

## 💻 Code Snippets

### Basic Usage
```jsx
import MpesaPayment from './components/MpesaPayment';

<MpesaPayment
  amount={1500}
  accountReference="ORDER-123"
  onSuccess={(data) => console.log('Paid!', data)}
  onError={(err) => console.error('Failed:', err)}
/>
```

### Using the Hook
```jsx
import { useMpesa } from './hooks/useMpesa';

const { initiatePayment, loading } = useMpesa();

await initiatePayment({
  phoneNumber: '254712345678',
  amount: 500,
  accountReference: 'ORDER-123'
});
```

### Test with cURL
```bash
curl -X POST http://localhost:4000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254708374149",
    "amount": 100,
    "accountReference": "TEST-001"
  }'
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `server/mpesa.service.js` | Backend M-Pesa logic |
| `server/index.js` | API routes |
| `src/hooks/useMpesa.js` | React payment hook |
| `src/components/MpesaPayment.jsx` | Payment UI |
| `server/.env` | Your credentials |

---

## 📚 Documentation

| File | When to Read |
|------|-------------|
| **MPESA_COMPLETE.md** | ⭐ Start here! |
| **MPESA_QUICKSTART.md** | Quick 5-min setup |
| **MPESA_INTEGRATION.md** | Full implementation guide |
| **MPESA_FLOW.md** | Visual diagrams |
| **MPESA_INDEX.md** | Navigation hub |

---

## 🔧 Common Commands

```bash
# Verify installation
./verify-mpesa.sh

# Check what's running on port 4000
lsof -i :4000

# View server logs
tail -f server/logs/app.log

# Install backend deps only
cd server && npm install

# Test backend API
curl http://localhost:4000/api/mpesa/stkpush
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 4000 in use | Kill process: `lsof -ti :4000 \| xargs kill -9` |
| CORS errors | Check VITE_API_URL in `.env` |
| Invalid token | Verify credentials in `server/.env` |
| STK not working | Use format: `254XXXXXXXXX` |

---

## ✅ Quick Checklist

- [ ] Run `./setup-mpesa.sh`
- [ ] Start backend on port 4000
- [ ] Start frontend on port 5173
- [ ] Visit `/mpesa-test` page
- [ ] Test with `254708374149`
- [ ] Verify payment works
- [ ] Read documentation
- [ ] Integrate into your app

---

## 🎯 Next Steps

1. **Today:** Test the integration
2. **This Week:** Add to booking flow
3. **Before Prod:** Get production credentials
4. **Deploy:** Update environment variables

---

## 📞 Quick Links

- **Safaricom Portal:** https://developer.safaricom.co.ke/
- **API Docs:** https://developer.safaricom.co.ke/Documentation
- **Test Credentials:** https://developer.safaricom.co.ke/test_credentials

---

**Keep this card handy!** 📌

For full details, see: **MPESA_COMPLETE.md**
