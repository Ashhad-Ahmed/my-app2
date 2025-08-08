const axios = require('axios');

let accessToken = null;
let refreshToken = null;
let tokenExpiryTime = null;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const setTokenData = (tokenData) => {
  accessToken = tokenData.access_token;
  refreshToken = tokenData.refresh_token || refreshToken;
  tokenExpiryTime = Date.now() + tokenData.expires_in * 1000;
};

const getAccessToken = async () => {
  if (Date.now() < tokenExpiryTime - 60000) {
    return accessToken;
  }

  // Refresh token if expired
  try {
    const res = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      },
    });

    setTokenData(res.data);
    console.log('🔁 Token refreshed!');
    return accessToken;
  } catch (err) {
    console.error('❌ Error refreshing token', err.response?.data || err.message);
    return null;
  }
};

module.exports = {
  setTokenData,
  getAccessToken,
};
