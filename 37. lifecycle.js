import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '5s',
};

console.log(' -- init stage --');

export default function (data) {
  console.log('-- VU stage --'); //virtual user stage (executed for each VU) when a user is done he runs the function again (iteration)
  // console.log(data);
  sleep(1);
}

export function setup() {
  console.log('-- setup stage --');
  sleep(10);
  const data = { foo: 'bar' };
  return data;
}

//like destroctor
export function teardown(data) {
  console.log('-- Teardown stage --');
}
