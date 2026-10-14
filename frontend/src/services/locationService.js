/**
 * Location & Geocoding Service for AsanKisan
 * Detects user's real-time city from:
 * 1. HTML5 Browser GPS Geolocation + Reverse Geocoding
 * 2. IP-based Network Geolocation (no browser prompt required)
 * 3. Logged-in User Profile Location
 * 4. Default Agricultural Hub (Tando Bago / Sindh)
 */

export const POPULAR_AGRI_CITIES = [
  'Tando Bago',
  'Badin',
  'Hyderabad',
  'Mirpur Khas',
  'Karachi',
  'Sukkur',
  'Larkana',
  'Multan',
  'Bahawalpur',
  'Faisalabad',
  'Sahiwal',
  'Lahore',
  'Gujranwala',
  'Peshawar',
  'Quetta',
  'Islamabad',
]

/**
 * Reverse geocode latitude and longitude to a human-readable city/town name.
 */
async function reverseGeocodeCoords(lat, lon) {
  // Strategy 1: BigDataCloud client-side reverse geocoding (fast, English output, free)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) {
      const data = await res.json()
      const detected =
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        (data.localityInfo?.administrative && data.localityInfo.administrative[8]?.name)
      if (detected && detected.trim()) {
        return detected.trim()
      }
    }
  } catch (err) {
    console.warn('[LocationService] BigDataCloud reverse geocode fallback:', err?.message)
  }

  // Strategy 2: OpenStreetMap Nominatim reverse geocoding
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: { 'User-Agent': 'AsanKisan-SmartAgri/1.0' },
        signal: AbortSignal.timeout(5000),
      }
    )
    if (res.ok) {
      const data = await res.json()
      const addr = data.address || {}
      const detected =
        addr.town ||
        addr.city ||
        addr.village ||
        addr.suburb ||
        addr.county ||
        addr.state_district ||
        addr.state
      if (detected && detected.trim()) {
        return detected.trim()
      }
    }
  } catch (err) {
    console.warn('[LocationService] Nominatim reverse geocode fallback:', err?.message)
  }

  return null
}

/**
 * Fetch city name using IP-based Geolocation (silent, no permission prompt needed).
 */
async function detectCityFromIP() {
  // 1. FreeIPAPI (fast, CORS friendly, returns detailed town/city in Pakistan)
  try {
    const res = await fetch('https://freeipapi.com/api/json', {
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json()
      const city = data.cityName || data.regionName
      if (city && city.trim() && city.toLowerCase() !== 'unknown') {
        return {
          city: city.trim(),
          country: data.countryName || 'Pakistan',
          source: 'IP Location',
        }
      }
    }
  } catch (err) {
    console.warn('[LocationService] FreeIPAPI failed:', err?.message)
  }

  // 2. IPAPI.co fallback
  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json()
      const city = data.city || data.region
      if (city && city.trim() && city.toLowerCase() !== 'undefined') {
        return {
          city: city.trim(),
          country: data.country_name || 'Pakistan',
          source: 'IP Location',
        }
      }
    }
  } catch (err) {
    console.warn('[LocationService] ipapi.co fallback failed:', err?.message)
  }

  return null
}

/**
 * Request real-time GPS coordinates via HTML5 Geolocation API
 */
export function getBrowserGpsCoords(timeoutMs = 7000) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'))
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
      },
      (err) => {
        reject(err)
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 60000,
      }
    )
  })
}

/**
 * Main Detection Routine:
 * Checks (in order):
 * 1. Explicitly selected city (if not forced refresh)
 * 2. High-accuracy GPS Geolocation + Reverse geocode
 * 3. IP Network Geolocation
 * 4. User Profile saved location (if signed in)
 * 5. Default agricultural baseline (Tando Bago)
 */
export async function detectUserCity(options = {}) {
  const { forceDetect = false, preferGps = false } = options

  // 1. If previously selected/cached and not forcing fresh detection
  if (!forceDetect) {
    const saved = sessionStorage.getItem('asankisan_weather_city')
    const savedSource = sessionStorage.getItem('asankisan_weather_source') || 'Saved'
    if (saved && saved.trim()) {
      return { city: saved.trim(), source: savedSource }
    }
  }

  // 2. If browser GPS is preferred or available
  if (preferGps && typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const coords = await getBrowserGpsCoords(6000)
      const reverseCity = await reverseGeocodeCoords(coords.lat, coords.lon)
      if (reverseCity) {
        sessionStorage.setItem('asankisan_weather_city', reverseCity)
        sessionStorage.setItem('asankisan_weather_source', 'Live GPS')
        return { city: reverseCity, source: 'Live GPS', coords }
      }
    } catch (gpsErr) {
      console.info('[LocationService] GPS prompt declined or timed out, trying IP detection:', gpsErr?.message)
    }
  }

  // 3. IP Geolocation (Zero-permission instant detection)
  const ipResult = await detectCityFromIP()
  if (ipResult && ipResult.city) {
    sessionStorage.setItem('asankisan_weather_city', ipResult.city)
    sessionStorage.setItem('asankisan_weather_source', 'Network IP')
    return { city: ipResult.city, source: 'Network IP' }
  }

  // 4. User profile fallback
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user?.location && user.location.trim()) {
        const profileCity = user.location.split(',')[0].trim()
        if (profileCity) {
          sessionStorage.setItem('asankisan_weather_city', profileCity)
          sessionStorage.setItem('asankisan_weather_source', 'User Profile')
          return { city: profileCity, source: 'User Profile' }
        }
      }
    }
  } catch (parseErr) {
    console.warn('[LocationService] Failed to read user profile location:', parseErr)
  }

  // 5. Default fallback to project headquarters
  const defaultCity = 'Tando Bago'
  sessionStorage.setItem('asankisan_weather_city', defaultCity)
  sessionStorage.setItem('asankisan_weather_source', 'Default Farm')
  return { city: defaultCity, source: 'Default Farm' }
}

/**
 * Persist user-selected city
 */
export function setManualCity(city) {
  if (!city || !city.trim()) return
  const clean = city.trim()
  sessionStorage.setItem('asankisan_weather_city', clean)
  sessionStorage.setItem('asankisan_weather_source', 'Custom Selection')
  localStorage.setItem('asankisan_preferred_city', clean)
}
