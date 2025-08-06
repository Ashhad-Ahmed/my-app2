// Google Ads Conversion Tracking Utility
import { GOOGLE_ADS_CONFIG } from '../config/googleAds';

const GOOGLE_ADS_CONVERSION_ID = GOOGLE_ADS_CONFIG.CONVERSION_ID;
const GOOGLE_ADS_CONVERSION_LABEL = GOOGLE_ADS_CONFIG.CONVERSION_LABEL;
const GA_MEASUREMENT_ID = GOOGLE_ADS_CONFIG.GA_MEASUREMENT_ID;

// Initialize Google Ads tracking
export const initializeGoogleAdsTracking = () => {
  // Load Google Ads global site tag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONVERSION_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GOOGLE_ADS_CONVERSION_ID);
};

// Track form submission conversion
export const trackFormConversion = (formData = {}) => {
  if (!window.gtag) {
    console.warn('Google Ads tracking not initialized');
    return;
  }

  // Track conversion event
  window.gtag('event', 'conversion', {
    'send_to': `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
    'value': 1.0,
    'currency': 'USD',
    'transaction_id': `form_${Date.now()}`,
    'custom_parameters': {
      'form_name': 'lead_form',
      'form_type': 'contact'
    }
  });

  // Track form submission event
  window.gtag('event', 'form_submit', {
    'event_category': 'lead_generation',
    'event_label': 'contact_form',
    'value': 1
  });

  // Enhanced conversions with user data (if available)
  if (formData.email) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      'user_data': {
        'email': formData.email,
        'phone_number': formData.phone || undefined
      }
    });
  }

  console.log('Google Ads conversion tracked successfully');
};

// Track page view
export const trackPageView = (pageTitle = '') => {
  if (!window.gtag) {
    console.warn('Google Ads tracking not initialized');
    return;
  }

  window.gtag('config', GOOGLE_ADS_CONVERSION_ID, {
    'page_title': pageTitle,
    'page_location': window.location.href
  });
};

// Track custom events
export const trackCustomEvent = (eventName, parameters = {}) => {
  if (!window.gtag) {
    console.warn('Google Ads tracking not initialized');
    return;
  }

  window.gtag('event', eventName, {
    'event_category': 'engagement',
    'event_label': 'custom_event',
    ...parameters
  });
};

// Track button clicks
export const trackButtonClick = (buttonName, buttonLocation = '') => {
  if (!window.gtag) {
    console.warn('Google Ads tracking not initialized');
    return;
  }

  window.gtag('event', 'click', {
    'event_category': 'engagement',
    'event_label': buttonName,
    'custom_parameters': {
      'button_location': buttonLocation
    }
  });
};

// Track scroll depth
export const trackScrollDepth = (depth) => {
  if (!window.gtag) {
    console.warn('Google Ads tracking not initialized');
    return;
  }

  window.gtag('event', 'scroll', {
    'event_category': 'engagement',
    'event_label': `scroll_${depth}%`,
    'value': depth
  });
};

// Track time on page
export const trackTimeOnPage = (seconds) => {
  if (!window.gtag) {
    console.warn('Google Ads tracking not initialized');
    return;
  }

  window.gtag('event', 'timing_complete', {
    'name': 'page_load',
    'value': seconds * 1000, // Convert to milliseconds
    'event_category': 'engagement'
  });
};

// Utility function to check if tracking is available
export const isTrackingAvailable = () => {
  return typeof window !== 'undefined' && window.gtag;
};

// Export constants for use in components
export const TRACKING_IDS = {
  GOOGLE_ADS_CONVERSION_ID,
  GOOGLE_ADS_CONVERSION_LABEL,
  GA_MEASUREMENT_ID
}; 