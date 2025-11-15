# M-Pesa Payment Flow Diagram

## 📊 Complete Payment Flow

```
┌─────────────┐
│   Customer  │
│   (React)   │
└──────┬──────┘
       │
       │ 1. Enter phone & amount
       │
       ▼
┌─────────────────────┐
│  MpesaPayment.jsx   │
│  (UI Component)     │
└──────┬──────────────┘
       │
       │ 2. Call initiatePayment()
       │
       ▼
┌─────────────────────┐
│   useMpesa hook     │
│   (Frontend Logic)  │
└──────┬──────────────┘
       │
       │ 3. POST to /api/mpesa/stkpush
       │
       ▼
┌──────────────────────────────────────┐
│         Express Server               │
│  POST /api/mpesa/stkpush handler     │
└──────┬───────────────────────────────┘
       │
       │ 4. Call mpesaService.initiateSTKPush()
       │
       ▼
┌──────────────────────────────────────┐
│      mpesa.service.js                │
│  - Get access token                  │
│  - Generate password                 │
│  - Build request body                │
└──────┬───────────────────────────────┘
       │
       │ 5. POST to Safaricom API
       │    https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
       │
       ▼
┌──────────────────────────────────────┐
│      Safaricom M-Pesa API            │
│  (Daraja)                            │
└──────┬───────────────────────────────┘
       │
       │ 6. Send STK Push to customer phone
       │
       ▼
┌──────────────────────────────────────┐
│    Customer's Phone                  │
│  - Shows M-Pesa prompt               │
│  - Customer enters PIN               │
│  - Payment processed                 │
└──────┬───────────────────────────────┘
       │
       │ 7a. Payment result
       │
       ▼
┌──────────────────────────────────────┐
│      Safaricom M-Pesa API            │
│  Processes payment                   │
└──────┬──────────┬────────────────────┘
       │          │
       │          │ 7b. Send callback (async)
       │          │     POST to callback URL
       │          │
       │          ▼
       │   ┌──────────────────────────────┐
       │   │  Express Server              │
       │   │  POST /api/mpesa/callback    │
       │   │  - Log transaction           │
       │   │  - Update database           │
       │   │  - Send notifications        │
       │   └──────────────────────────────┘
       │
       │ 8. Return CheckoutRequestID
       │
       ▼
┌──────────────────────────────────────┐
│      mpesa.service.js                │
│  Returns response to server          │
└──────┬───────────────────────────────┘
       │
       │ 9. Return to frontend
       │
       ▼
┌──────────────────────────────────────┐
│   useMpesa hook                      │
│  - Store CheckoutRequestID           │
│  - Start polling for status          │
└──────┬───────────────────────────────┘
       │
       │ 10. Poll payment status every 2s
       │     POST to /api/mpesa/query
       │
       ▼
┌──────────────────────────────────────┐
│         Express Server               │
│  POST /api/mpesa/query handler       │
│  - Query Safaricom API               │
│  - Return current status             │
└──────┬───────────────────────────────┘
       │
       │ 11. Return status
       │
       ▼
┌──────────────────────────────────────┐
│   MpesaPayment.jsx                   │
│  - Show "Processing..."              │
│  - On success: Show checkmark        │
│  - On failure: Show error            │
│  - Call onSuccess/onError callbacks  │
└──────────────────────────────────────┘
```

## 🔄 Status Flow

```
Payment Initiated
       │
       ▼
┌────────────┐
│ Processing │  ←─── Polling every 2 seconds
└─────┬──────┘
      │
      ├─── ResultCode: "0" ──→ ✅ Success
      │
      ├─── ResultCode: "1032" ──→ 🔄 Still Processing (continue polling)
      │
      └─── Other codes ──→ ❌ Failed
```

## 📝 Data Flow Example

### 1. Initial Request (Frontend → Backend)
```json
{
  "phoneNumber": "254712345678",
  "amount": 1500,
  "accountReference": "ORDER-123",
  "transactionDesc": "Car Wash Service"
}
```

### 2. STK Push Request (Backend → Safaricom)
```json
{
  "BusinessShortCode": "174379",
  "Password": "base64_encoded_string",
  "Timestamp": "20251110095530",
  "TransactionType": "CustomerPayBillOnline",
  "Amount": 1500,
  "PartyA": "254712345678",
  "PartyB": "174379",
  "PhoneNumber": "254712345678",
  "CallBackURL": "https://yourdomain.com/api/mpesa/callback",
  "AccountReference": "ORDER-123",
  "TransactionDesc": "Car Wash Service"
}
```

### 3. STK Push Response (Safaricom → Backend)
```json
{
  "MerchantRequestID": "29115-34620561-1",
  "CheckoutRequestID": "ws_CO_191220191020363925",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing"
}
```

### 4. Callback Data (Safaricom → Backend)
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_191220191020363925",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 1500 },
          { "Name": "MpesaReceiptNumber", "Value": "QKR2KLRT3N" },
          { "Name": "TransactionDate", "Value": 20251110095545 },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      }
    }
  }
}
```

### 5. Query Status Response (Backend → Frontend)
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

## ⏱️ Timeline

```
T+0s   → Customer clicks "Pay Now"
T+1s   → STK Push sent to phone
T+2s   → Customer sees M-Pesa prompt
T+5s   → Customer enters PIN
T+6s   → Payment processed
T+7s   → Callback received (async)
T+8s   → Status polling detects success
T+8s   → UI updated with success message
```

## 🔐 Security Flow

```
┌──────────────────┐
│ 1. Get Access    │
│    Token         │
│    (Cached 1hr)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. Generate      │
│    Password      │
│    Base64(       │
│      Shortcode + │
│      Passkey +   │
│      Timestamp   │
│    )             │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Sign Request  │
│    with Token    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. Send to       │
│    Safaricom     │
└──────────────────┘
```

## 🎯 Error Handling Flow

```
Any Error Occurs
       │
       ▼
┌─────────────────────┐
│ Catch in try/catch  │
└──────┬──────────────┘
       │
       ├─── Network Error ──→ Retry logic
       │
       ├─── Invalid Credentials ──→ Return error to user
       │
       ├─── Invalid Phone ──→ Return validation error
       │
       ├─── Insufficient Balance ──→ Show user message
       │
       └─── Timeout ──→ Show "Please check your phone"
```

## 📱 User Experience Flow

```
1. [Idle State]
   - Show phone input
   - Show amount
   - "Pay Now" button enabled

2. [Processing State]
   - Show loading spinner
   - Message: "Check your phone"
   - Disable all inputs

3. [Success State]
   - Show checkmark
   - Message: "Payment successful!"
   - Call onSuccess callback

4. [Failed State]
   - Show error icon
   - Message: Error description
   - "Try Again" button
   - Call onError callback
```

## 🔍 Result Codes

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Success | Payment completed |
| 1 | Insufficient funds | Show error to user |
| 1032 | Request cancelled | User cancelled |
| 1037 | Timeout | Request timeout |
| 2001 | Invalid initiator | Check credentials |

## 🌐 Environment Flow

```
Development:
Local ──→ localhost:4000 ──→ sandbox.safaricom.co.ke

Staging:
App ──→ staging-api.yourdomain.com ──→ sandbox.safaricom.co.ke

Production:
App ──→ api.yourdomain.com ──→ api.safaricom.co.ke
```

---

This flow diagram helps visualize how the M-Pesa integration works in your SmartWash app!
