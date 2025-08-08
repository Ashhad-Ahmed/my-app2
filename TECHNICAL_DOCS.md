# Technical Documentation - Google Ads Webhook Manager

## 🔧 Development Setup

### Environment Requirements
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Google Cloud Console**: Active project with APIs enabled
- **Google Ads API**: Developer token and access

### Development Environment Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd my-app
   npm install
   cd backend && npm install
   ```

2. **Environment Configuration**
   Create `.env` file in backend directory:
   ```env
   CLIENT_ID=your_google_oauth_client_id
   CLIENT_SECRET=your_google_oauth_client_secret
   REDIRECT_URI=http://localhost:5173/oauth-callback
   DEVELOPER_TOKEN=your_google_ads_developer_token
   PORT=5000
   ```

3. **Google Cloud Console Setup**
   - Create new project or select existing
   - Enable Google Ads API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:5173/oauth-callback`
     - `http://localhost:3000/oauth-callback` (if needed)

## 🏗️ Architecture Details

### Frontend Architecture

#### Component Structure
```
src/
├── components/
│   ├── ConnectGoogleAds.jsx     # OAuth initiation
│   └── OAuthCallback.jsx        # Callback processing
├── App.jsx                      # Main app component
└── main.jsx                     # Entry point
```

#### State Management
- **Local State**: React useState hooks
- **No Global State**: Simple component-level state
- **Props**: Component communication via props

#### Routing
- **React Router DOM**: Client-side routing
- **Routes**: 
  - `/`: Home page (ConnectGoogleAds)
  - `/oauth-callback`: OAuth callback (OAuthCallback)

### Backend Architecture

#### Server Structure
```
backend/
├── index.js                     # Express server setup
├── routes/
│   └── googleAuth.js           # API routes
└── services/
    └── googleTokenService.js   # Token management
```

#### API Endpoints
| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/api/google/exchange-code` | Exchange OAuth code | `{code: string}` | Token data |
| GET | `/api/google/get-valid-token` | Get valid token | - | `{access_token: string}` |
| POST | `/api/google/subscribe-webhook` | Subscribe to webhooks | `{access_token: string}` | Subscription status |
| GET | `/api/google/webhook-status` | Check subscription | - | Status details |
| POST | `/api/google/webhook` | Receive webhooks | Webhook payload | `{status: 'received'}` |

## 🔐 Authentication Flow

### OAuth 2.0 Implementation

1. **Authorization Request**
   ```javascript
   const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
     client_id=${CLIENT_ID}&
     redirect_uri=${REDIRECT_URI}&
     response_type=code&
     scope=${SCOPE}&
     access_type=offline&
     prompt=consent`;
   ```

2. **Code Exchange**
   ```javascript
   const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
     params: {
       code,
       client_id: CLIENT_ID,
       client_secret: CLIENT_SECRET,
       redirect_uri: REDIRECT_URI,
       grant_type: 'authorization_code',
     },
   });
   ```

3. **Token Storage**
   - Store in memory (development)
   - Use secure storage (production)
   - Implement refresh token logic

### Token Management

#### Token Service Functions
```javascript
// Store token data
setTokenData(tokenData)

// Get valid access token
getAccessToken()

// Refresh token if expired
refreshToken()
```

## 🔄 Webhook Integration

### Webhook Subscription Process

1. **Get Customer ID**
   ```javascript
   const customerResponse = await axios.get(
     'https://googleads.googleapis.com/v14/customers',
     {
       headers: {
         'Authorization': `Bearer ${accessToken}`,
         'developer-token': DEVELOPER_TOKEN
       }
     }
   );
   ```

2. **Subscribe to Webhook**
   ```javascript
   const webhookResponse = await axios.post(
     `https://googleads.googleapis.com/v14/customers/${customerId}/googleAds:searchStream`,
     {
       query: `SELECT customer.id, customer.descriptive_name FROM customer LIMIT 1`,
       webhookUrl: 'http://localhost:5000/api/google/webhook',
       events: ['CONVERSION', 'CLICK', 'IMPRESSION']
     },
     {
       headers: {
         'Authorization': `Bearer ${accessToken}`,
         'developer-token': DEVELOPER_TOKEN,
         'login-customer-id': customerId,
         'Content-Type': 'application/json'
       }
     }
   );
   ```

### Supported Webhook Events
- **CONVERSION**: Ad conversion tracking
- **CLICK**: Ad click tracking
- **IMPRESSION**: Ad impression tracking

## 🎨 UI/UX Implementation

### Component Design

#### ConnectGoogleAds.jsx
- **Purpose**: OAuth initiation interface
- **Features**: 
  - Clean button design
  - Popup window management
  - Authorization code display

#### OAuthCallback.jsx
- **Purpose**: OAuth callback processing
- **Features**:
  - Token information display
  - Webhook subscription button
  - Status messages

### Styling Approach
- **Inline CSS**: For simplicity and quick development
- **Responsive Design**: Mobile-friendly layouts
- **Color Scheme**: Green (#4CAF50) for success, Red (#F44336) for errors

## 🐛 Error Handling

### Frontend Error Handling
```javascript
try {
  const response = await axios.post('/api/google/subscribe-webhook', data);
  // Handle success
} catch (error) {
  setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
}
```

### Backend Error Handling
```javascript
try {
  // API call
} catch (error) {
  console.error('❌ Error:', error);
  res.status(500).json({ 
    success: false, 
    error: error.response?.data?.error || error.message 
  });
}
```

### Common Error Scenarios
1. **Invalid OAuth Credentials**
   - Check CLIENT_ID and CLIENT_SECRET
   - Verify redirect URI configuration

2. **Token Expiration**
   - Implement refresh token logic
   - Handle token refresh failures

3. **API Rate Limits**
   - Implement retry logic
   - Add exponential backoff

## 🔧 Development Commands

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
# Start development server
cd backend && npm start

# Run with nodemon (if installed)
cd backend && nodemon index.js
```

### Testing
```bash
# Run frontend tests
npm test

# Run backend tests
cd backend && npm test
```

## 📊 Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy load components
- **Bundle Size**: Minimize dependencies
- **Caching**: Implement proper caching strategies

### Backend Optimization
- **Connection Pooling**: Database connections
- **Rate Limiting**: API rate limiting
- **Caching**: Redis for token storage

## 🔒 Security Best Practices

### OAuth Security
- **HTTPS Only**: Use HTTPS in production
- **State Parameter**: Implement CSRF protection
- **Token Storage**: Secure token storage

### API Security
- **Input Validation**: Validate all inputs
- **Rate Limiting**: Prevent abuse
- **Error Handling**: Don't expose sensitive info

### Environment Variables
```javascript
// Use environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
```

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Set production credentials
2. **HTTPS**: Enable SSL/TLS
3. **Domain**: Update redirect URIs
4. **Monitoring**: Add logging and monitoring

### Deployment Options
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Heroku, AWS EC2, or Google Cloud
- **Database**: MongoDB Atlas or AWS RDS

## 📈 Monitoring and Logging

### Frontend Monitoring
```javascript
// Error boundary for React components
componentDidCatch(error, errorInfo) {
  console.error('Error:', error);
  // Send to monitoring service
}
```

### Backend Logging
```javascript
// Structured logging
console.log('✅ Webhook subscription successful for customer:', customerId);
console.error('❌ Webhook subscription failed:', error.message);
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Deployment commands
```

## 📚 Additional Resources

### Documentation
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React Documentation](https://reactjs.org/docs/)

### Tools and Libraries
- **Frontend**: React, Vite, Axios
- **Backend**: Express.js, Node.js
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, Prettier

---

**Last Updated**: August 2024
**Version**: 1.0.0 