import { sleep } from 'k6';
import {
  createRoom,
  createParticipant,
  updateVotes,
  generateDateSlots,
  generateTimeSlots,
  combineDateTimeSlots,
} from '../helpers/api.js';

export const options = {
  scenarios: {
    vote_write: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 20 },
        { duration: '1m', target: 30 },
        { duration: '1m', target: 50 },
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

const ROOM_COUNT = 50;
const PARTICIPANTS_PER_ROOM = 10;

export function setup() {
  const dateSlots = generateDateSlots(3, 7);
  const timeSlots = generateTimeSlots(0, 48);
  const allDateTimeSlots = combineDateTimeSlots(dateSlots, timeSlots);

  // 방 50개 생성, 각 방에 참여자 10명 등록
  const rooms = [];
  for (let r = 0; r < ROOM_COUNT; r++) {
    const session = createRoom(`부하투표${r}`, dateSlots, timeSlots);
    const participants = [];
    for (let i = 0; i < PARTICIPANTS_PER_ROOM; i++) {
      const name = `r${r}u${i}`;
      createParticipant(session, name);
      participants.push(name);
    }
    rooms.push({ session, participants });
  }

  return { rooms, allDateTimeSlots };
}

export default function (data) {
  // 각 VU에 고유한 방/참여자 할당 (동시 수정 충돌 방지)
  const vuIndex = (__VU - 1) % (ROOM_COUNT * PARTICIPANTS_PER_ROOM);
  const roomIndex = Math.floor(vuIndex / PARTICIPANTS_PER_ROOM);
  const participantIndex = vuIndex % PARTICIPANTS_PER_ROOM;

  const room = data.rooms[roomIndex];
  const name = room.participants[participantIndex];
  const selectedSlots = data.allDateTimeSlots.filter(() => Math.random() > 0.4);

  if (selectedSlots.length > 0) {
    updateVotes(room.session, name, selectedSlots);
  }

  sleep(0.5);
}
