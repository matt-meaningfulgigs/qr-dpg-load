# QR-DPG Load Test

## Installation (macOS)

```bash
brew install k6
```

## How to Run the Test

```bash
k6 run scripts/load.js
```

This will run the test and save the results to `reports/summary.json`.

## Test Options

The script supports two configurations:

### 1. Ramp Load (default)

Gradually increases virtual users to simulate growing traffic:

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

### 2. Constant Load

To sustain 12,500 virtual users for 20 minutes, replace the `stages` section with:

```js
vus: 12500,
duration: '20m',
```
