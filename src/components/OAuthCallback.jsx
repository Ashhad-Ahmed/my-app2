import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OAuthCallback = () => {
  const [tokenData, setTokenData] = useState(null);
  const [webhookStatus, setWebhookStatus] = useState('checking');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState('');

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

  const handleSubscribeToWebhook = async () => {
    setIsSubscribing(true);
    setWebhookMessage('');

    try {
      // Subscribe to webhook
      const response = await axios.post('http://localhost:5000/api/google/subscribe-webhook', {
        access_token: tokenData.access_token
      });

      if (response.data.success) {
        setWebhookMessage('✅ Webhook subscription successful!');
        setWebhookStatus('success');
      } else {
        setWebhookMessage('❌ Webhook subscription failed');
        setWebhookStatus('failed');
      }
    } catch (error) {
      setWebhookMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
      setWebhookStatus('failed');
    } finally {
      setIsSubscribing(false);
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
          
          <div style={{ marginTop: 20, padding: 15, backgroundColor: '#f0f8ff', borderRadius: 5 }}>
            <h3>🔗 Subscribe to Webhook</h3>
            <p>Click the button below to subscribe to webhooks:</p>
            <button
              onClick={handleSubscribeToWebhook}
              disabled={isSubscribing}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: 5,
                cursor: isSubscribing ? 'not-allowed' : 'pointer',
                opacity: isSubscribing ? 0.7 : 1
              }}
            >
              {isSubscribing ? '🔄 Subscribing...' : '🔗 Subscribe to Webhook'}
            </button>
            {webhookMessage && (
              <div style={{ 
                marginTop: 10, 
                padding: 10,
                backgroundColor: webhookMessage.includes('✅') ? '#e8f5e8' : '#ffe8e8',
                borderRadius: 5,
                border: `1px solid ${webhookMessage.includes('✅') ? '#4CAF50' : '#F44336'}`
              }}>
                {webhookMessage}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading token info...</p>
      )}
    </div>
  );
};

export default OAuthCallback;
