import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 RPS
      duration: '2m',
      preAllocatedVUs: 100, // inital pool of VUs
      maxVUs: 1000,
    },

  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    iteration_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms
  },
};

export default function () {
  // max answer id 6879306 (before testing)
  const randomAnswerId = Math.floor(Math.random() * 679306) + 6200000;
  const url = `http://localhost:3000/qa/answers/${randomAnswerId}/helpful`;
  check(http.put(url), {
    'status is 204': (r) => r.status === 204,
  });
}
