import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 RPS
      duration: '2m', //
      preAllocatedVUs: 100, // inital pool of VUs
      maxVUs: 1000,
      gracefulStop: '30s',
    },

  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    iteration_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms
  },
};

export default function () {
  const randomProductId = Math.floor(Math.random() * 100011) + 900000;
  const url = 'http://localhost:3000/qa/questions/';
  const data = {
    product_id: randomProductId,
    body: `k6 stress testing post question for product ${randomProductId}`,
    name: 'k6_postQuestion',
    email: 'k6@gmail.com',
  };
  check(http.post(url, data), {
    'status is 201': (r) => r.status === 201,
  });
}
