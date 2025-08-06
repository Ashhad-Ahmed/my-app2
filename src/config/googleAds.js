// Google Ads Configuration
// Replace these placeholder values with your actual Google Ads and Analytics IDs

export const GOOGLE_ADS_CONFIG = {
  // Google Ads Conversion ID (starts with AW-)
  CONVERSION_ID: 'AW-CONVERSION_ID',
  
  // Google Ads Conversion Label (provided by Google Ads)
  CONVERSION_LABEL: 'CONVERSION_LABEL',
  
  // Google Analytics 4 Measurement ID (starts with G-)
  GA_MEASUREMENT_ID: 'GA_MEASUREMENT_ID',
  
  // Currency for conversions (default: USD)
  CURRENCY: 'USD',
  
  // Default conversion value
  DEFAULT_CONVERSION_VALUE: 1.0,
  
  // Enable enhanced conversions
  ENABLE_ENHANCED_CONVERSIONS: true,
  
  // Enable debug mode (set to false in production)
  DEBUG_MODE: true
};

// Instructions for setup:
// 1. Go to Google Ads > Tools & Settings > Conversions
// 2. Create a new conversion action for "Lead form submission"
// 3. Copy the Conversion ID and Conversion Label
// 4. Go to Google Analytics > Admin > Data Streams
// 5. Copy the Measurement ID
// 6. Replace the placeholder values above with your actual IDs

export default GOOGLE_ADS_CONFIG; 