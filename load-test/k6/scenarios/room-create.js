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
        { duration: '30s', target: 5 },
        { duration: '1m', target: 10 },
        { duration: '1m', target: 20 },
        { duration: '1m', target: 30 },
        { duration: '30s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate==0', abortOnFail: true }],
    http_req_duration: ['p(50)<100', 'p(95)<500', 'p(99)<1000'],
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
