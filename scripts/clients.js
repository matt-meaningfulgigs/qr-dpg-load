// Simulated mobile user agents
const mobileUserAgents = [
  // iPhones
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',

  // iPads
  'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',

  // Pixel devices
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.134 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.131 Mobile Safari/537.36',

  // Samsung devices
  'Mozilla/5.0 (Linux; Android 14; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.149 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; Samsung Galaxy S22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36',

  // OnePlus
  'Mozilla/5.0 (Linux; Android 13; ONEPLUS A6013) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.110 Mobile Safari/537.36',

  // Xiaomi
  'Mozilla/5.0 (Linux; Android 12; Mi 11 Lite) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.138 Mobile Safari/537.36',

  // Oppo
  'Mozilla/5.0 (Linux; Android 12; CPH2025) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.140 Mobile Safari/537.36',

  // Huawei
  'Mozilla/5.0 (Linux; Android 11; HUAWEI Mate 30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.154 Mobile Safari/537.36',

  // Nokia
  'Mozilla/5.0 (Linux; Android 11; Nokia 5.4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.74 Mobile Safari/537.36',
];

// Simulated languages for Netherlands, Belgium, Germany
const acceptLanguages = ['nl-NL,nl;q=0.9', 'nl-BE,nl;q=0.9', 'fr-BE,fr;q=0.9', 'de-DE,de;q=0.9'];

// Simulated referrers (camera apps or blank)
const fakeReferrers = [
  '',
  'https://camera.apple.com',
  'https://android.qr.scan/',
  'https://qrcodescannerapp/',
  undefined,
];

// Simulated EU IPs (roughly Netherlands, Belgium, Germany)
function generateEUishIP() {
  const prefixes = ['145', '80', '77', '91', '213'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Timezone offset in minutes (Central European Time = UTC+1 = -60)
const timezoneOffsets = [-60, -120, -90]; // some DST mix

// Final header generator for one "client"
export function generateHeaders() {
  const ua = mobileUserAgents[Math.floor(Math.random() * mobileUserAgents.length)];
  const lang = acceptLanguages[Math.floor(Math.random() * acceptLanguages.length)];
  const ref = fakeReferrers[Math.floor(Math.random() * fakeReferrers.length)];
  const ip = generateEUishIP();
  const tzOffset = timezoneOffsets[Math.floor(Math.random() * timezoneOffsets.length)];

  const headers = {
    'User-Agent': ua,
    'Accept-Language': lang,
    'X-Forwarded-For': ip,
    'X-QR-Code-ID': qrCode,
    'X-Timezone-Offset': tzOffset.toString(),
  };

  if (ref !== undefined) {
    headers['Referer'] = ref;
  }

  return headers;
}
