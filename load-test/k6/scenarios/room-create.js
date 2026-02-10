import { sleep } from 'k6';
import {
  createRoom,
  createParticipant,
  generateDateSlots,
  generateTimeSlots,
} from '../helpers/api.js';

export const options = {
  scenarios: {
    room_create: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 100 },  // 3차 한계 구간 빠르게 도달
        { duration: '1m', target: 100 },   // sustain
        { duration: '30s', target: 200 },  // push
        { duration: '1m', target: 200 },   // sustain
        { duration: '30s', target: 300 },  // extreme
        { duration: '1m', target: 300 },   // sustain
        { duration: '30s', target: 500 },  // breaking point hunt
        { duration: '1m', target: 500 },   // sustain
        { duration: '30s', target: 0 },    // cool-down
      ],
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate==0', abortOnFail: true }],
    http_req_duration: ['p(50)<1000', 'p(95)<3000', 'p(99)<10000'],
    checks: [{ threshold: 'rate==1', abortOnFail: true }],
  },
};

export function setup() {
  const dateSlots = generateDateSlots(3, 7);
  const timeSlots = generateTimeSlots(0, 48);
  return { dateSlots, timeSlots };
}

export default function (data) {
  const vuId = __VU;
  const iter = __ITER;

  // 1. 방 생성
  const session = createRoom(`방v${vuId}i${iter}`, data.dateSlots, data.timeSlots);

  // 2. 참여자 10명 등록
  for (let i = 0; i < 10; i++) {
    createParticipant(session, `v${vuId}i${iter}u${i}`);
  }

  sleep(1);
}
