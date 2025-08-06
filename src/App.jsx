import { Routes, Route } from 'react-router-dom'; // ⬅️ Remove BrowserRouter here
import ConnectGoogleAds from './components/ConnectGoogleAds';
import OAuthCallback from './components/OAuthCallback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectGoogleAds />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
    </Routes>
  );
}

export default App;
