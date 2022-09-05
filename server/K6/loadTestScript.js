import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 1 minutes.
    { duration: '2m', target: 100 }, // stay at 100 users for 2 minutes.
    { duration: '1m', target: 0 }, // ramp-down to 0 users.
  ],
};

export default function () {
  const url = 'http://localhost:3000/qa/questions/';
  check(http.get(`${url}?product_id=1000010`), {
    'status is 200': (r) => r.status == 200,
  }) || errorRate.add(1);
}
