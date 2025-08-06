import React, { useEffect, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const SCOPE = 'https://www.googleapis.com/auth/adwords';

const ConnectGoogleAds = () => {
  const [authCode, setAuthCode] = useState('');

  const handleConnect = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&access_type=offline&prompt=consent`;

    const popup = window.open(authUrl, 'googleAdsOAuth', 'width=600,height=700,scrollbars=yes,resizable=yes');
    if (popup) popup.focus();

    window.addEventListener('message', (event) => {
      if (event.data?.code) {
        console.log('📩 Code received in parent:', event.data.code);
        setAuthCode(event.data.code);
      }
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔗 Google Ads OAuth</h1>
      <button onClick={handleConnect}>Connect Google Ads</button>

      {authCode && (
        <div style={{ marginTop: 20 }}>
          <strong>Authorization Code (From Popup):</strong>
          <div style={{ wordBreak: 'break-all' }}>{authCode}</div>
        </div>
      )}
    </div>
  );
};

export default ConnectGoogleAds;
