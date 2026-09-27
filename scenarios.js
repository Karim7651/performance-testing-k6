import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import exec from 'k6/execution';
import { Counter, Trend } from 'k6/metrics'; //custom metrics

export const options = {
  vus: 10,
  duration: '10s',
  //threshold assertions tells you in report if any threshhold is not met
  //good to meel SOL (Service Level Objectives)
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms (Trend metric)
    http_req_duration: ['max<2000'], // max request duration should be below 2s (Trend metric)
    http_req_failed: ['rate<0.01'], // http errors should be less than 1% (Rate metric)
    http_reqs: ['count>20'], // at least 100 requests should be made (Count metric)
    http_reqs: ['rate>5'], // at least 5 requests per second (Rate metric)
    vus: ['value>9'], //at least 9 virtual users should be active at any given time (Gauge matric)
    checks: ['rate>0.9'], // at least 90% of checks should pass (Rate metric) (Assertions)
    my_counter: ['count>10'], // at least 10 requests should be made (Count metric) (Custom metric)
    response_time_news_page: ['p(95)<500', 'p(99)<1000'], // 95% and 99% of requests must complete below 500ms and 1000ms respectively (Trend metric) (Custom metric)
  },
};

//custom metric definition
let myCounter = new Counter('my_counter');
let newsPaggeResponseTrend = new Trend('response_time_news_page');

export default function () {
  let res = http.get('https://quickpizza.grafana.com/test.k6.io/');
  // console.log(res.status);
  // console.log(res.body);
  console.log(exec.scenario.iterationInTest); //prints the iteration number of the test
  // (you can use this to customize anything depending on iteration)
  sleep(1);
  //Assertions
  //first parameter is input
  check(res, {
    //prints status is 200 if val is true in green, otherwise red
    'status is 200': (r) => r.status === 200,
    'contains some text': (r) =>
      r.body.includes('This is a replacement of the service previously found'),
  });
  //use custom metric to count number of requests made, it will appear in terminal
  myCounter.add(1);
  res = http.get('https://quickpizza.grafana.com/news.php');
  newsPaggeResponseTrend.add(res.timings.duration); //add response time to trend metric
  sleep(1);
}
