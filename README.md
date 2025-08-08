# Google Ads Webhook Manager

## 📋 Project Overview

This is a React-based web application that allows users to connect to Google Ads API and subscribe to webhooks for real-time notifications. The application provides a simple interface for OAuth authentication and webhook subscription management.

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios for API calls
- **Styling**: Inline CSS for simplicity

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Authentication**: Google OAuth 2.0
- **API Integration**: Google Ads API v14
- **Token Management**: Custom token service

## 📁 Project Structure

```
my-app/
├── backend/
│   ├── index.js                 # Main server file
│   ├── package.json
│   ├── routes/
│   │   └── googleAuth.js       # Google OAuth & webhook routes
│   └── services/
│       └── googleTokenService.js # Token management
├── src/
│   ├── components/
│   │   ├── ConnectGoogleAds.jsx    # OAuth connection UI
│   │   └── OAuthCallback.jsx       # OAuth callback & webhook subscription
│   ├── App.jsx
│   └── main.jsx
└── README.md
```

## 🚀 Features

### 1. Google Ads OAuth Integration
- Secure OAuth 2.0 authentication flow
- Popup-based authentication window
- Automatic token exchange and storage
- Refresh token management

### 2. Webhook Subscription Management
- One-click webhook subscription
- Real-time status updates
- Error handling and user feedback
- Support for conversion, click, and impression events

### 3. User Interface
- Clean, modern UI design
- Responsive layout
- Loading states and progress indicators
- Success/error message display

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Ads API access
- Google OAuth 2.0 credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure Google OAuth**
   - Create a project in Google Cloud Console
   - Enable Google Ads API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

5. **Update credentials**
   - Replace `CLIENT_ID` and `CLIENT_SECRET` in `backend/routes/googleAuth.js`
   - Update `REDIRECT_URI` if needed

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:5173`

## 📖 API Documentation

### Backend Endpoints

#### 1. OAuth Code Exchange
```
POST /api/google/exchange-code
```
- **Purpose**: Exchange authorization code for access token
- **Body**: `{ code: string }`
- **Response**: Token data with webhook subscription status

#### 2. Get Valid Token
```
GET /api/google/get-valid-token
```
- **Purpose**: Retrieve valid access token
- **Response**: `{ access_token: string }`

#### 3. Manual Webhook Subscription
```
POST /api/google/subscribe-webhook
```
- **Purpose**: Manually subscribe to webhooks
- **Body**: `{ access_token: string }`
- **Response**: Subscription status

#### 4. Webhook Status
```
GET /api/google/webhook-status
```
- **Purpose**: Check webhook subscription status
- **Response**: Subscription details

#### 5. Webhook Receiver
```
POST /api/google/webhook
```
- **Purpose**: Receive webhook notifications
- **Response**: `{ status: 'received' }`

## 🔐 Security Features

### OAuth 2.0 Implementation
- Secure authorization flow
- Access token management
- Refresh token handling
- Token validation

### Environment Variables
- Sensitive credentials stored in environment variables
- Production-ready configuration
- Secure credential management

## 🎯 User Workflow

### 1. Initial Setup
1. User visits the application homepage
2. Clicks "Connect Google Ads" button
3. Google OAuth popup opens
4. User authorizes the application

### 2. OAuth Callback
1. User is redirected to callback page
2. Authorization code is exchanged for tokens
3. Token information is displayed
4. Webhook subscription button appears

### 3. Webhook Subscription
1. User clicks "🔗 Subscribe to Webhook" button
2. System validates access token
3. Webhook subscription is created
4. Success/error message is displayed

## 🛠️ Technical Implementation

### Frontend Components

#### ConnectGoogleAds.jsx
- Handles OAuth initiation
- Manages popup window
- Displays authorization code

#### OAuthCallback.jsx
- Processes OAuth callback
- Exchanges code for tokens
- Provides webhook subscription interface
- Shows token information

### Backend Services

#### googleAuth.js (Routes)
- OAuth code exchange
- Webhook subscription management
- Token validation
- Error handling

#### googleTokenService.js
- Token storage and retrieval
- Token refresh logic
- Token validation

## 🔄 Webhook Integration

### Supported Events
- **CONVERSION**: Ad conversion events
- **CLICK**: Ad click events  
- **IMPRESSION**: Ad impression events

### Webhook URL
- Endpoint: `http://localhost:5000/api/google/webhook`
- Method: POST
- Content-Type: application/json

## 🐛 Error Handling

### Common Issues
1. **Invalid OAuth credentials**
   - Check CLIENT_ID and CLIENT_SECRET
   - Verify redirect URI configuration

2. **Token refresh failures**
   - Ensure refresh token is valid
   - Check token expiration

3. **Webhook subscription failures**
   - Verify Google Ads API access
   - Check developer token configuration

### Debugging
- Check browser console for frontend errors
- Monitor backend server logs
- Verify API responses

## 📈 Future Enhancements

### Planned Features
1. **Webhook Event Logging**
   - Store received webhook events
   - Event history dashboard

2. **Multiple Account Support**
   - Support for multiple Google Ads accounts
   - Account switching functionality

3. **Advanced Analytics**
   - Real-time performance metrics
   - Custom event tracking

4. **Enhanced UI**
   - Material-UI integration
   - Dark mode support
   - Mobile responsiveness

## 🤝 Contributing

### Development Guidelines
1. Follow existing code structure
2. Add proper error handling
3. Include comments for complex logic
4. Test thoroughly before submitting

### Code Standards
- Use consistent naming conventions
- Follow React best practices
- Implement proper error boundaries
- Add loading states for async operations

## 📞 Support

For technical support or questions:
- Check the troubleshooting section
- Review API documentation
- Contact the development team

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**Last Updated**: August 2024
**Version**: 1.0.0
**Status**: Production Ready
