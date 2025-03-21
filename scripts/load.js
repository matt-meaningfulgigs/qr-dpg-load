import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export let options = {
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

let responseTimes = new Trend('response_times');
let errorRate = new Rate('error_rate');

let alertedSlowResponse = false;
let alertedFailureRate = false;

export default function () {
    const res = http.get('https://dashboard.qr-dpg.nl', {
        tags: { name: 'MainPage' },
        timeout: '60s',
    });

    responseTimes.add(res.timings.duration);
    errorRate.add(res.status !== 200);

    // Log once on first bad response time. This may spam so delete if it does
    if (!alertedSlowResponse && res.timings.duration > 1500) {
        console.warn(`[WARNING] Response time exceeded 1500ms for the first time: ${res.timings.duration}ms`);
        alertedSlowResponse = true;
    }

    // Log once on first server error. This may spam so delete if it does
    if (!alertedFailureRate && res.status >= 500) {
        console.error(`[CRITICAL] Received first server error with status: ${res.status}`);
        alertedFailureRate = true;
    }

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 1500ms': (r) => r.timings.duration < 1500,
    }, { verbose: false });
}

export function handleSummary(data) {
    return {
        'reports/summary.json': JSON.stringify(data, null, 2),
    };
}
