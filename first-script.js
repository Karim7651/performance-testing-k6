import http from 'k6/http';
import {sleep} from 'k6';
//must export so that k6 knows abt it
export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  http.get('https://quickpizza.grafana.com/test.k6.io');
  sleep(1); //number in seconds
}
