import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OAuthCallback = () => {
  const [tokenData, setTokenData] = useState(null);
  const [webhookStatus, setWebhookStatus] = useState('checking');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      window.opener.postMessage({ code }, '*');

      axios
        .post('http://localhost:5000/api/google/exchange-code', { code })
        .then((res) => {
          const data = res.data;
          const expiresAt = new Date(Date.now() + data.expires_in * 1000).toLocaleString();
          setTokenData({ ...data, expires_at: expiresAt });
          
          // Check webhook subscription status
          checkWebhookStatus();
        })
        .catch((err) => {
          console.error('❌ Token exchange error:', err);
          setWebhookStatus('failed');
        });
    }
  }, []);

  const checkWebhookStatus = async () => {
    try {
      // Check if webhook subscription was successful
      const response = await axios.get('http://localhost:5000/api/google/webhook-status');
      setWebhookStatus(response.data.subscribed ? 'success' : 'failed');
    } catch (error) {
      console.error('❌ Webhook status check failed:', error);
      setWebhookStatus('failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>✅ Token Info</h2>
      {tokenData ? (
        <>
          <p><strong>Access Token:</strong> {tokenData.access_token}</p>
          <p><strong>Refresh Token:</strong> {tokenData.refresh_token}</p>
          <p><strong>Token Type:</strong> {tokenData.token_type}</p>
          <p><strong>Token Expires At:</strong> {tokenData.expires_at}</p>
          
          <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc', borderRadius: 5 }}>
            <h3>🔗 Webhook Subscription Status</h3>
            {webhookStatus === 'checking' && <p>🔄 Checking webhook subscription...</p>}
            {webhookStatus === 'success' && <p>✅ Webhook subscription successful!</p>}
            {webhookStatus === 'failed' && <p>❌ Webhook subscription failed</p>}
          </div>
        </>
      ) : (
        <p>Loading token info...</p>
      )}
    </div>
  );
};

export default OAuthCallback;
