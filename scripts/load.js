import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { options, urls } from './config.js'; // load test settings and url list
import { generateHeaders } from './clients.js'; // build fake browser + geo headers

export { options }; // k6 needs this exported for test setup

let responseTimes = new Trend('response_times'); // tracks how long responses take
let errorRate = new Rate('error_rate'); // tracks % of requests that fail

let alertedSlowResponse = false; // only warn once for slow response
let alertedFailureRate = false; // only warn once for 5xx errors

export default function () {
  const url = urls[Math.floor(Math.random() * urls.length)]; // pick a random test URL
  const headers = generateHeaders(); // fake device + location info

  const res = http.get(url, { headers }); // make the actual request

  responseTimes.add(res.timings.duration); // record how long it took
  errorRate.add(res.status !== 200); // count as error if not 200

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

  check(
    res,
    {
      'status is 200': (r) => r.status === 200, // make sure it loaded
      'response time < 1500ms': (r) => r.timings.duration < 1500, // check for slowness
    },
    { verbose: false }
  ); // avoid console spam
}

export function handleSummary(data) {
  return {
    'reports/summary.json': JSON.stringify(data, null, 2), // dump results to JSON
  };
}
