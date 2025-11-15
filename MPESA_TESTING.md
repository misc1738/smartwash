# M-Pesa Integration Testing Guide

Complete testing guide for the M-Pesa Daraja API integration in SmartWash.

## 📋 Table of Contents

1. [Environment Setup](#environment-setup)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Test Scenarios](#test-scenarios)
6. [Troubleshooting Tests](#troubleshooting-tests)

## 🔧 Environment Setup

### Prerequisites

```bash
# Ensure both services are running
cd server && npm start     # Terminal 1
npm run dev                # Terminal 2
```

### Test Credentials

**Sandbox Environment:**
- Base URL: `https://sandbox.safaricom.co.ke`
- Shortcode: `174379`
- Consumer Key: `RGrLBJ6WNFOGRCAGC70PYT8gu9dmc98iACw3mZDRAJp1Ovsd`

**Test Phone Numbers:**
| Number | Expected Result |
|--------|----------------|
| 254708374149 | ✅ Payment succeeds |
| 254711111111 | ❌ User cancels payment |
| 254722222222 | ❌ Insufficient balance |

## 🧪 Unit Testing

### Backend Service Tests

#### Test 1: Access Token Generation

```bash
# Test in Node.js console or create a test file
cd server
node
```

```javascript
const mpesaService = require('./mpesa.service');

// Test access token
mpesaService.getAccessToken()
  .then(token => console.log('✅ Token:', token))
  .catch(err => console.error('❌ Error:', err));
```

**Expected Result:**
- Returns a valid OAuth token
- Token is cached for reuse
- Token expires in ~3600 seconds

#### Test 2: Password Generation

```javascript
const mpesaService = require('./mpesa.service');

// Test password generation
const { password, timestamp } = mpesaService.generatePassword();
console.log('Password:', password);
console.log('Timestamp:', timestamp);
```

**Expected Result:**
- Password is base64 encoded
- Timestamp format: YYYYMMDDHHmmss
- Both values are strings

#### Test 3: Phone Number Formatting

```javascript
const mpesaService = require('./mpesa.service');

// Test phone cleaning
const phones = ['0712345678', '712345678', '+254712345678', '254712345678'];
phones.forEach(phone => {
  let clean = phone.replace(/\+/g, '');
  if (clean.startsWith('0')) clean = '254' + clean.substring(1);
  if (!clean.startsWith('254')) clean = '254' + clean;
  console.log(`${phone} → ${clean}`);
});
```

**Expected Result:**
All convert to: `254712345678`

### Frontend Hook Tests

#### Test 1: useMpesa Hook

Create `src/hooks/useMpesa.test.js`:

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useMpesa } from './useMpesa';

describe('useMpesa Hook', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useMpesa());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentData).toBe(null);
  });

  it('sets loading state during payment', async () => {
    const { result } = renderHook(() => useMpesa());
    
    act(() => {
      result.current.initiatePayment({
        phoneNumber: '254712345678',
        amount: 100,
        accountReference: 'TEST-001'
      });
    });
    
    expect(result.current.loading).toBe(true);
  });
});
```

## 🔗 Integration Testing

### API Endpoint Tests

#### Test 1: STK Push Endpoint

```bash
# Test with curl
curl -X POST http://localhost:4000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254708374149",
    "amount": 10,
    "accountReference": "TEST-001",
    "transactionDesc": "Test Payment"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "MerchantRequestID": "...",
    "CheckoutRequestID": "ws_CO_...",
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing"
  }
}
```

#### Test 2: Query Status Endpoint

```bash
curl -X POST http://localhost:4000/api/mpesa/query \
  -H "Content-Type: application/json" \
  -d '{
    "checkoutRequestID": "ws_CO_191220191020363925"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "ResultCode": "0",
    "ResultDesc": "The service request is processed successfully."
  }
}
```

#### Test 3: Callback Endpoint

```bash
# Simulate M-Pesa callback
curl -X POST http://localhost:4000/api/mpesa/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "29115-34620561-1",
        "CheckoutRequestID": "ws_CO_191220191020363925",
        "ResultCode": 0,
        "ResultDesc": "The service request is processed successfully.",
        "CallbackMetadata": {
          "Item": [
            { "Name": "Amount", "Value": 100 },
            { "Name": "MpesaReceiptNumber", "Value": "QKR2KLRT3N" },
            { "Name": "TransactionDate", "Value": 20251110095545 },
            { "Name": "PhoneNumber", "Value": 254712345678 }
          ]
        }
      }
    }
  }'
```

**Expected Response:**
```json
{
  "ResultCode": 0,
  "ResultDesc": "Accepted"
}
```

### Error Handling Tests

#### Test 1: Invalid Phone Number

```bash
curl -X POST http://localhost:4000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "invalid",
    "amount": 100,
    "accountReference": "TEST-001"
  }'
```

**Expected:** Error about invalid phone format

#### Test 2: Missing Parameters

```bash
curl -X POST http://localhost:4000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254712345678"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Missing required fields: phoneNumber, amount, accountReference"
}
```

#### Test 3: Invalid Amount

```bash
curl -X POST http://localhost:4000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254712345678",
    "amount": -100,
    "accountReference": "TEST-001"
  }'
```

**Expected:** Validation error

## 🌐 End-to-End Testing

### Manual E2E Test

1. **Navigate to test page**
   ```
   http://localhost:5173/mpesa-test
   ```

2. **Enter phone number**
   - Input: `0708374149`
   - Should format to: `+254 708 374 149`

3. **Verify amount display**
   - Should show: `KES 1,500`

4. **Click "Pay Now"**
   - Button should disable
   - Loading state should show

5. **Wait for STK Push**
   - UI shows "Processing Payment"
   - Message: "Check your phone for the M-Pesa prompt"

6. **Verify polling**
   - Status checks every 2 seconds
   - Up to 30 attempts (60 seconds)

7. **Success state**
   - Green checkmark appears
   - Message: "Payment Successful!"
   - "Make Another Payment" button shows

### Automated E2E Test (Playwright)

Create `tests/mpesa.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('M-Pesa Payment Flow', () => {
  test('should complete payment successfully', async ({ page }) => {
    // Navigate to test page
    await page.goto('http://localhost:5173/mpesa-test');
    
    // Enter phone number
    await page.fill('input[type="tel"]', '0708374149');
    
    // Verify formatted display
    await expect(page.locator('input[type="tel"]')).toHaveValue('+254 708 374 149');
    
    // Click pay button
    await page.click('button:has-text("Pay Now")');
    
    // Verify processing state
    await expect(page.locator('text=Processing Payment')).toBeVisible();
    
    // Wait for success (max 60s)
    await expect(page.locator('text=Payment Successful!')).toBeVisible({ timeout: 60000 });
    
    // Verify success message
    await expect(page.locator('text=Make Another Payment')).toBeVisible();
  });

  test('should handle invalid phone number', async ({ page }) => {
    await page.goto('http://localhost:5173/mpesa-test');
    
    // Enter invalid phone
    await page.fill('input[type="tel"]', '123');
    
    // Try to pay
    await page.click('button:has-text("Pay Now")');
    
    // Should show error or button disabled
    await expect(page.locator('button:has-text("Pay Now")')).toBeDisabled();
  });
});
```

## 📊 Test Scenarios

### Scenario 1: Successful Payment

**Steps:**
1. User enters valid phone: `254708374149`
2. User enters amount: `100`
3. User clicks "Pay Now"
4. STK Push initiated
5. User enters PIN on phone
6. Payment processes
7. Success callback received
8. UI updates to success state

**Expected Results:**
- ✅ CheckoutRequestID returned
- ✅ Status polling detects success
- ✅ onSuccess callback fires
- ✅ Success message displayed

### Scenario 2: User Cancels Payment

**Steps:**
1. User enters: `254711111111`
2. Initiates payment
3. User cancels on phone

**Expected Results:**
- ⏳ Processing state shows
- ❌ Status becomes "Cancelled"
- ❌ onError callback fires with cancellation message
- 🔄 "Try Again" option available

### Scenario 3: Insufficient Balance

**Steps:**
1. User enters: `254722222222`
2. Initiates payment

**Expected Results:**
- ❌ Payment fails
- 💰 Error: "Insufficient balance"
- 🔄 User can try different amount

### Scenario 4: Network Timeout

**Steps:**
1. Disconnect internet
2. Try to initiate payment

**Expected Results:**
- ⚠️ Network error caught
- 🔄 Retry option available
- 📝 Clear error message

### Scenario 5: Invalid Credentials

**Steps:**
1. Set wrong Consumer Key in `.env`
2. Try payment

**Expected Results:**
- ❌ "Invalid Access Token" error
- 📋 Logged on server
- 🔧 Admin notification (if configured)

## 🔍 Troubleshooting Tests

### Test Checklist

- [ ] Server running on port 4000
- [ ] Client running on port 5173
- [ ] Environment variables set correctly
- [ ] No CORS errors
- [ ] Network connectivity good
- [ ] Correct phone number format
- [ ] Valid test credentials

### Debug Commands

```bash
# Check server logs
tail -f server/logs/app.log

# Test API directly
curl http://localhost:4000/api/mpesa/stkpush

# Check environment variables
cat server/.env | grep MPESA

# Verify server is listening
lsof -i :4000

# Test network connectivity
ping sandbox.safaricom.co.ke
```

### Common Test Failures

#### "Connection Refused"
```bash
# Solution: Start server
cd server && npm start
```

#### "Invalid Access Token"
```bash
# Solution: Check credentials
cat server/.env
# Verify Consumer Key and Secret have no spaces
```

#### "Timeout"
```bash
# Solution: Check network
ping sandbox.safaricom.co.ke
# Verify firewall allows outbound HTTPS
```

## 📈 Test Coverage Goals

- **Unit Tests:** > 80%
- **Integration Tests:** All API endpoints
- **E2E Tests:** All user flows
- **Error Handling:** All error scenarios
- **Edge Cases:** Phone formats, amounts, timeouts

## 🎯 Testing Best Practices

1. **Always test in sandbox first**
2. **Use small amounts in production tests**
3. **Log all transactions**
4. **Test error scenarios**
5. **Verify callbacks**
6. **Monitor timeout handling**
7. **Check database updates**
8. **Test with different phone numbers**
9. **Verify UI states**
10. **Document test results**

## 📝 Test Report Template

```markdown
# M-Pesa Test Report

**Date:** YYYY-MM-DD
**Environment:** Sandbox/Production
**Tester:** Name

## Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| STK Push Success | ✅ | Completed in 8s |
| User Cancellation | ✅ | Error handled correctly |
| Invalid Phone | ✅ | Validation working |
| Network Error | ❌ | Needs better error message |

## Issues Found

1. Issue description
2. Steps to reproduce
3. Expected vs actual behavior

## Recommendations

- Suggestions for improvements
- Additional tests needed
```

---

**Testing is crucial!** Always test thoroughly before deploying to production.

For more info, see:
- [MPESA_QUICKSTART.md](./MPESA_QUICKSTART.md)
- [MPESA_INTEGRATION.md](./MPESA_INTEGRATION.md)
