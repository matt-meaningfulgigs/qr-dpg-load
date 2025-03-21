export const options = {
    // Scale up to 50,000 VUs gradually
    stages: [
        { duration: '30s', target: 1000 },
        { duration: '30s', target: 5000 },
        { duration: '1m', target: 10000 },
        { duration: '2m', target: 25000 },
        { duration: '2m', target: 50000 },
        { duration: '1m', target: 0 },
    ],

    // Uncomment below and comment the above junk for constant 12,500 users for 20 minutes
    // vus: 12500,
    // duration: '20m',

    thresholds: {
        http_req_failed: ['rate<0.05'],
        http_req_duration: ['p(95)<1000'],
    },
};

export const redirectUrls = [
    'https://dashboard.qr-dpg.nl'
];
