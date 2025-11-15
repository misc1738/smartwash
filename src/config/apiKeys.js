// API Configuration
// Note: In production, these should be environment variables
// For now, keeping them here for rapid development

export const API_KEYS = {
  ipGeolocation: import.meta.env.VITE_IPGEO_API_KEY || '',
  bigDataCloud: import.meta.env.VITE_BIGDATACLOUD_KEY || '',
  meteosource: import.meta.env.VITE_METEOSOURCE_KEY || '',
  pdfBolt: import.meta.env.VITE_PDFBOLT_KEY || '',
};

export const API_ENDPOINTS = {
  ipGeolocation: 'https://api.ipgeolocation.io/ipgeo',
  bigDataCloud: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
  meteosource: 'https://www.meteosource.com/api/v1/free',
  pdfBolt: 'https://api.pdfbolt.com/v1',
};

// Rate limiting helpers
const requestCounts = {};
const RATE_LIMITS = {
  ipGeolocation: { requests: 1500, window: 86400000 }, // 1500/day
  bigDataCloud: { requests: 100, window: 86400000 }, // generous but let's be safe
  meteosource: { requests: 400, window: 86400000 }, // 400/day
  pdfBolt: { requests: 500, window: 2592000000 }, // 500/month
};

export const canMakeRequest = (service) => {
  const now = Date.now();
  const key = `${service}_${Math.floor(now / RATE_LIMITS[service].window)}`;
  
  if (!requestCounts[key]) {
    requestCounts[key] = 0;
  }
  
  if (requestCounts[key] >= RATE_LIMITS[service].requests) {
    console.warn(`⚠️ Rate limit reached for ${service}`);
    return false;
  }
  
  requestCounts[key]++;
  return true;
};

export const logApiCall = (service, success, endpoint) => {
  const emoji = success ? '✅' : '❌';
  console.log(`${emoji} API Call: ${service} → ${endpoint}`);
};
