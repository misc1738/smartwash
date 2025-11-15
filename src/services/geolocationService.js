import { API_KEYS, API_ENDPOINTS, canMakeRequest, logApiCall } from '../config/apiKeys';

/**
 * Get user's location info by IP address
 * Returns: { city, country, region, latitude, longitude, timezone }
 */
export const getUserLocationByIP = async () => {
  if (!canMakeRequest('ipGeolocation')) {
    return { error: 'Rate limit reached', fallback: true };
  }
  try {
    let data;
    if (String(import.meta.env.VITE_USE_PROXY).toLowerCase() === 'true') {
      const resp = await fetch(`/proxy/ipgeo`);
      data = await resp.json();
    } else {
      const response = await fetch(`${API_ENDPOINTS.ipGeolocation}?apiKey=${API_KEYS.ipGeolocation}`);
      if (!response.ok) throw new Error(`IP Geolocation API error: ${response.status}`);
      data = await response.json();
    }
    logApiCall('ipGeolocation', true, 'getUserLocationByIP');

    return {
      city: data.city || 'Nairobi',
      country: data.country_name || data.country || 'Kenya',
      region: data.state_prov || '',
      latitude: parseFloat(data.latitude || data.lat) || -1.286389,
      longitude: parseFloat(data.longitude || data.lon) || 36.817223,
      timezone: data.time_zone?.name || data.timezone || 'Africa/Nairobi',
      countryCode: data.country_code2 || 'KE',
      isNairobi: (data.city && String(data.city).toLowerCase().includes('nairobi')) || data.country_code2 === 'KE',
    };
  } catch (error) {
    console.error('IP Geolocation error:', error);
    logApiCall('ipGeolocation', false, 'getUserLocationByIP');
    
    // Fallback to Nairobi
    return {
      city: 'Nairobi',
      country: 'Kenya',
      region: '',
      latitude: -1.286389,
      longitude: 36.817223,
      timezone: 'Africa/Nairobi',
      countryCode: 'KE',
      isNairobi: true,
      fallback: true,
    };
  }
};

/**
 * Reverse geocode lat/lng to readable address
 * Uses BigDataCloud API
 */
export const reverseGeocode = async (latitude, longitude) => {
  if (!canMakeRequest('bigDataCloud')) {
    return { error: 'Rate limit reached', fallback: true };
  }

  try {
    let data;
    if (String(import.meta.env.VITE_USE_PROXY).toLowerCase() === 'true') {
      const resp = await fetch(`/proxy/reverse-geocode?latitude=${latitude}&longitude=${longitude}`);
      data = await resp.json();
    } else {
      const response = await fetch(`${API_ENDPOINTS.bigDataCloud}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${API_KEYS.bigDataCloud}`);
      if (!response.ok) throw new Error(`BigDataCloud API error: ${response.status}`);
      data = await response.json();
    }
    logApiCall('bigDataCloud', true, 'reverseGeocode');

    // Build readable address
    const parts = [];
    if (data.localityInfo?.administrative?.[3]?.name) {
      parts.push(data.localityInfo.administrative[3].name); // Neighborhood
    }
    if (data.locality) parts.push(data.locality); // City
    if (data.principalSubdivision) parts.push(data.principalSubdivision); // Region

    return {
      address: parts.join(', ') || 'Nairobi, Kenya',
      locality: data.locality || 'Nairobi',
      neighborhood: data.localityInfo?.administrative?.[3]?.name || '',
      city: data.city || data.locality || 'Nairobi',
      region: data.principalSubdivision || '',
      country: data.countryName || 'Kenya',
      postalCode: data.postcode || '',
      formatted: data.localityInfo?.informative?.[0]?.description || parts.join(', '),
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    logApiCall('bigDataCloud', false, 'reverseGeocode');
    
    return {
      address: 'Nairobi, Kenya',
      locality: 'Nairobi',
      city: 'Nairobi',
      country: 'Kenya',
      fallback: true,
    };
  }
};

/**
 * Get browser geolocation (requires user permission)
 */
export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
};
