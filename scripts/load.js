import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { options, urls } from './config.js';

export { options };

let responseTimes = new Trend('response_times');
let errorRate = new Rate('error_rate');

let alertedSlowResponse = false;
let alertedFailureRate = false;

export default function () {
    const url = urls[Math.floor(Math.random() * urls.length)];

    const res = http.get(url, {
        tags: { name: 'RedirectTest' },
        timeout: '60s',
    });

    responseTimes.add(res.timings.duration);
    errorRate.add(res.status !== 200);

    // Log once on first bad response time. This may spam so delete if it does
    if (!alertedSlowResponse && res.timings.duration > 1500) {
        console.warn(`[WARNING] Slow response (>1500ms): ${res.timings.duration}ms`);
        alertedSlowResponse = true;
    }

    // Log once on first server error. This may spam so delete if it does
    if (!alertedFailureRate && res.status >= 500) {
        console.error(`[CRITICAL] Server error (status ${res.status}) on URL: ${url}`);
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
