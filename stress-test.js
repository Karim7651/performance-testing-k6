import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    stages: [
        {
            duration: '5m', // ramp up (let app scale out)
            target: 1000
        },
        {
            duration: '30m', // STRESS TESTING
            target: 1000
        },
        {
            duration: '5m', // ramp down (see if cpu dec, memory leaks, msg queues clear)
            target: 0
        }
    ]
}

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
    http.get('https://test.k6.io/contact.php');
    sleep(2);
    http.get('https://test.k6.io/news.php');
    sleep(2);
}