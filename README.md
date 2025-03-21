# QR-DPG Load Test

This project is built to stress test the QR redirect service hosted at `https://dashboard.qr-dpg.nl`. It uses [k6](https://k6.io/) to simulate traffic from mobile users scanning QR codes in the Netherlands and Belgium. The test is configured to simulate realistic browser headers, locations, and traffic patterns.

## Requirements

Install k6:

```bash
brew install k6
```

## How to Run the Test

```bash
k6 run scripts/load.js
```

This will execute the test and automatically save a summary report to `reports/summary.json`.

For a quieter run with less console output, use:

```bash
k6 run --quiet scripts/load.js
```

## Test Modes

The load script supports two modes. Only one should be active at a time.

### 1. Ramp Load (default)

This gradually ramps up to 50,000 virtual users:

```js
stages: [
  { duration: '30s', target: 1000 },
  { duration: '30s', target: 5000 },
  { duration: '1m',  target: 10000 },
  { duration: '2m',  target: 25000 },
  { duration: '2m',  target: 50000 },
  { duration: '1m',  target: 0 },
]
```

This simulates increasing real-world load over time and helps identify failure points.

### 2. Constant Load

To apply consistent pressure at high concurrency, comment out the `stages` section in `config.js` and replace it with:

```js
vus: 12500,
duration: '20m',
```

This mode simulates 12,500 active users hammering the service for 20 straight minutes with no pauses.

## Simulated Clients

All traffic is randomized to mimic mobile users scanning printed QR codes in the Netherlands and Belgium:

- Mobile user agents (iOS and Android)
- Accept-Language headers for `nl-NL`, `nl-BE`, `fr-BE`, `de-DE`
- Referrers from camera apps or blank (simulating QR scans)
- Fake client IPs using `X-Forwarded-For`

These headers are generated per request and defined in `clients.js`.

## Output

After running, results are saved to:

```
reports/summary.json
```
