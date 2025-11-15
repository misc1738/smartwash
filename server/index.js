require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const mpesaService = require('./mpesa.service');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const IPGEO_KEY = process.env.IPGEO_API_KEY;
const BIGDATA_KEY = process.env.BIGDATACLOUD_KEY;
const METEO_KEY = process.env.METEOSOURCE_KEY;
const PDFBOLT_KEY = process.env.PDFBOLT_KEY;

app.get('/proxy/ipgeo', async (req, res) => {
  try {
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEO_KEY}`;
    const r = await fetch(url);
    const json = await r.json();
    res.json(json);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/proxy/reverse-geocode', async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${BIGDATA_KEY}`;
    const r = await fetch(url);
    const json = await r.json();
    res.json(json);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/proxy/weather', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const place = `${lat},${lon}`;
    const url = `https://www.meteosource.com/api/v1/free/point?place_id=${place}&sections=hourly&timezone=auto&language=en&units=metric&key=${METEO_KEY}`;
    const r = await fetch(url);
    const json = await r.json();
    res.json(json);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post('/proxy/pdf', async (req, res) => {
  try {
    const r = await fetch('https://api.pdfbolt.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PDFBOLT_KEY}`,
      },
      body: JSON.stringify(req.body),
    });
    const buffer = await r.buffer();
    res.set('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// M-Pesa Routes
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

    if (!phoneNumber || !amount || !accountReference) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: phoneNumber, amount, accountReference' 
      });
    }

    const result = await mpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc || 'SmartWash Payment'
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/mpesa/callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));
    
    const result = mpesaService.processCallback(req.body);
    
    // Log the processed result
    console.log('Processed Callback:', result);
    
    // Here you would typically:
    // 1. Update your database with the payment status
    // 2. Send notification to the user
    // 3. Update order status, etc.
    
    // Always return success to M-Pesa to acknowledge receipt
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback Error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

app.post('/api/mpesa/query', async (req, res) => {
  try {
    const { checkoutRequestID } = req.body;

    if (!checkoutRequestID) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing checkoutRequestID' 
      });
    }

    const result = await mpesaService.querySTKPushStatus(checkoutRequestID);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/mpesa/register-urls', async (req, res) => {
  try {
    const { confirmationURL, validationURL } = req.body;

    if (!confirmationURL || !validationURL) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing confirmationURL or validationURL' 
      });
    }

    const result = await mpesaService.registerC2BUrls(confirmationURL, validationURL);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy listening on ${PORT}`));
