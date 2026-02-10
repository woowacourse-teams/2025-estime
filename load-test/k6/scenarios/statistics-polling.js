import { sleep } from 'k6';
import {
  createRoom,
  createParticipant,
  updateVotes,
  getStatistics,
  generateDateSlots,
  generateTimeSlots,
  combineDateTimeSlots,
} from '../helpers/api.js';

export const options = {
  scenarios: {
    statistics_polling: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 150 },  // 검증 완료 구간 빠르게 도달
        { duration: '1m', target: 150 },   // sustain
        { duration: '30s', target: 300 },  // push
        { duration: '1m', target: 300 },   // sustain
        { duration: '30s', target: 500 },  // max hunt
        { duration: '1m', target: 500 },   // sustain
        { duration: '30s', target: 0 },    // cool-down
      ],
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate==0', abortOnFail: true }],
    http_req_duration: ['p(50)<100', 'p(95)<500', 'p(99)<3000'],
    checks: [{ threshold: 'rate==1', abortOnFail: true }],
  },
};

const ROOM_COUNT = 50;
const PARTICIPANT_COUNT = 10;

export function setup() {
  const dateSlots = generateDateSlots(3, 7);
  const timeSlots = generateTimeSlots(0, 48);
  const allDateTimeSlots = combineDateTimeSlots(dateSlots, timeSlots);

  const sessions = [];
  for (let r = 0; r < ROOM_COUNT; r++) {
    const session = createRoom(`부하읽기${r}`, dateSlots, timeSlots);
    for (let i = 0; i < PARTICIPANT_COUNT; i++) {
      const name = `p${r}u${i}`;
      createParticipant(session, name);
      const selectedSlots = allDateTimeSlots.filter(() => Math.random() > 0.4);
      if (selectedSlots.length > 0) {
        updateVotes(session, name, selectedSlots);
      }
    }
    sessions.push(session);
  }

  return { sessions };
}

export default function (data) {
  const session = data.sessions[Math.floor(Math.random() * data.sessions.length)];
  getStatistics(session);
  sleep(0.5);
}
