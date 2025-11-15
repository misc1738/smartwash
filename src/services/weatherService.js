import { API_KEYS, API_ENDPOINTS, canMakeRequest, logApiCall } from '../config/apiKeys';

/**
 * Get weather forecast for a specific date/time at location
 * Returns hourly forecast data
 */
export const getWeatherForecast = async (latitude, longitude, date) => {
  if (!canMakeRequest('meteosource')) {
    return { error: 'Rate limit reached', fallback: true };
  }

  try {
    // Meteosource uses place_id or lat,lon format
    const place = `${latitude},${longitude}`;
    let data;
    if (String(import.meta.env.VITE_USE_PROXY).toLowerCase() === 'true') {
      const resp = await fetch(`/proxy/weather?lat=${latitude}&lon=${longitude}`);
      if (!resp.ok) throw new Error(`Proxy weather error: ${resp.status}`);
      data = await resp.json();
    } else {
      const response = await fetch(`${API_ENDPOINTS.meteosource}/point?place_id=${place}&sections=hourly&timezone=auto&language=en&units=metric&key=${API_KEYS.meteosource}`);
      if (!response.ok) {
        throw new Error(`Meteosource API error: ${response.status}`);
      }
      data = await response.json();
    }
    logApiCall('meteosource', true, 'getWeatherForecast');

    // Filter for the requested date
    const targetDate = new Date(date).toISOString().split('T')[0];
    const hourlyData = data.hourly?.data || [];
    
    const dayForecast = hourlyData.filter((hour) => {
      const hourDate = hour.date?.split('T')[0];
      return hourDate === targetDate;
    });

    // Analyze weather conditions
    const hasRain = dayForecast.some((h) => 
      h.weather?.includes('rain') || h.precipitation?.total > 2
    );
    const hasStorm = dayForecast.some((h) => 
      h.weather?.includes('storm') || h.weather?.includes('thunder')
    );
    const isWindy = dayForecast.some((h) => h.wind?.speed > 30);

    return {
      location: data.lat && data.lon ? { lat: data.lat, lon: data.lon } : null,
      timezone: data.timezone || 'Africa/Nairobi',
      hourly: dayForecast.map((h) => ({
        time: h.date,
        temperature: h.temperature,
        weather: h.weather || 'clear',
        precipitation: h.precipitation?.total || 0,
        windSpeed: h.wind?.speed || 0,
        humidity: h.humidity || 0,
        icon: getWeatherIcon(h.weather),
      })),
      summary: {
        hasRain,
        hasStorm,
        isWindy,
        suitable: !hasStorm && !isWindy,
        warning: hasStorm ? 'Thunderstorm expected' : isWindy ? 'Strong winds expected' : hasRain ? 'Rain expected' : null,
      },
    };
  } catch (error) {
    console.error('Weather forecast error:', error);
    logApiCall('meteosource', false, 'getWeatherForecast');
    
    return {
      hourly: [],
      summary: { suitable: true, warning: null },
      fallback: true,
    };
  }
};

/**
 * Get weather for specific time slot
 */
export const getWeatherForSlot = async (latitude, longitude, date, time) => {
  const forecast = await getWeatherForecast(latitude, longitude, date);
  
  if (forecast.fallback || !forecast.hourly.length) {
    return { suitable: true, warning: null, fallback: true };
  }

  // Find closest hour to the booking time
  const [hours] = time.split(':').map(Number);
  const targetHour = new Date(`${date}T${time}`).getHours();
  
  const closestHour = forecast.hourly.find((h) => {
    const hourTime = new Date(h.time).getHours();
    return Math.abs(hourTime - targetHour) <= 1;
  });

  if (!closestHour) {
    return forecast.summary;
  }

  return {
    temperature: closestHour.temperature,
    weather: closestHour.weather,
    precipitation: closestHour.precipitation,
    windSpeed: closestHour.windSpeed,
    icon: closestHour.icon,
    suitable: closestHour.precipitation < 5 && closestHour.windSpeed < 30,
    warning: closestHour.precipitation > 5 
      ? `${closestHour.precipitation}mm rain expected` 
      : closestHour.windSpeed > 30 
        ? `${closestHour.windSpeed}km/h winds expected`
        : null,
  };
};

/**
 * Map weather condition to icon emoji
 */
const getWeatherIcon = (condition = '') => {
  const lower = condition.toLowerCase();
  if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
  if (lower.includes('cloud')) return '☁️';
  if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️';
  if (lower.includes('storm') || lower.includes('thunder')) return '⛈️';
  if (lower.includes('snow')) return '❄️';
  if (lower.includes('fog') || lower.includes('mist')) return '🌫️';
  if (lower.includes('wind')) return '💨';
  return '🌤️';
};
