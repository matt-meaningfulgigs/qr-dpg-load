export const options = {
  // Scale up to 50,000 VUs gradually
  stages: [
    { duration: '30s', target: 1000 }, // warm-up
    { duration: '30s', target: 5000 }, // light load
    { duration: '1m', target: 10000 }, // medium load
    { duration: '2m', target: 25000 }, // high load
    { duration: '2m', target: 50000 }, // max load
    { duration: '1m', target: 0 }, // ramp down
  ],

  // Uncomment below and comment the above junk for constant 12,500 users for 20 minutes
  // vus: 12500,                          // steady load
  // duration: '20m',

  thresholds: {
    http_req_failed: ['rate<0.05'], // less than 5% should fail
    http_req_duration: ['p(95)<1000'], // 95% of responses under 1s
  },
};

// List of test URLs — rotate through these during test
export const urls = [
  'https://dashboard.qr-dpg.nl', // change this to the actual QR URL
];
