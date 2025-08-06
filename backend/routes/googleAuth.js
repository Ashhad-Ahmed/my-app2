const express = require('express');
const axios = require('axios');
const router = express.Router();
const tokenService = require('../services/googleTokenService');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// 🔐 OAuth Code Exchange + Webhook Subscription
router.post('/exchange-code', async (req, res) => {
  const { code } = req.body;

  try {
    // Step 1: Exchange authorization code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    });

    // Step 2: Store token data
    tokenService.setTokenData(tokenResponse.data);

    // Step 3: Subscribe to webhook after successful login
    try {
      await subscribeToWebhooks(tokenResponse.data.access_token);
      console.log('✅ Webhook subscription successful');
    } catch (webhookError) {
      console.error('❌ Webhook subscription failed:', webhookError.message);
    }

    res.status(200).json(tokenResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to exchange code' });
  }
});

// Webhook subscription function
async function subscribeToWebhooks(accessToken) {
  try {
    // First get customer ID
    const customerResponse = await axios.get(
      'https://googleads.googleapis.com/v14/customers',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || 'TEST_DEVELOPER_TOKEN'
        }
      }
    );

    const customerId = customerResponse.data.results[0].id;
    console.log('👤 Customer ID:', customerId);

    // Subscribe to Google Ads webhook
    const webhookResponse = await axios.post(
      `https://googleads.googleapis.com/v14/customers/${customerId}/googleAds:searchStream`,
      {
        query: `
          SELECT 
            customer.id,
            customer.descriptive_name
          FROM customer
          LIMIT 1
        `,
        webhookUrl: 'http://localhost:5000/api/google/webhook', // Testing URL
        events: ['CONVERSION', 'CLICK', 'IMPRESSION']
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || 'TEST_DEVELOPER_TOKEN',
          'login-customer-id': customerId,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Webhook subscription successful for customer:', customerId);

    // Store subscription status
    global.webhookSubscribed = true;
    global.customerId = customerId;

    return {
      success: true,
      customerId: customerId,
      message: 'Webhook subscription active'
    };
  } catch (error) {
    console.error('❌ Webhook subscription failed:', error.response?.data || error.message);
    global.webhookSubscribed = false;
    throw error;
  }
}

// 🔑 Get Valid Token Endpoint
router.get('/get-valid-token', async (req, res) => {
  const validToken = await tokenService.getAccessToken();
  if (validToken) {
    res.status(200).json({ access_token: validToken });
  } else {
    res.status(401).json({ error: 'Could not refresh token' });
  }
});

// 📨 Webhook Endpoint to Receive Notifications
router.post('/webhook', (req, res) => {
  console.log('📨 Webhook received:', req.body);
  res.status(200).json({ status: 'received' });
});

// �� Webhook Status Endpoint
router.get('/webhook-status', (req, res) => {
  // Return actual subscription status
  res.status(200).json({
    subscribed: global.webhookSubscribed || false,
    customerId: global.customerId || null,
    lastChecked: new Date().toISOString(),
    message: global.webhookSubscribed ? 'Webhook subscription active' : 'Webhook subscription failed'
  });
});

module.exports = router;