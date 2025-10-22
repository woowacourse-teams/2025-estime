import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  scenarios: {
    // 시나리오 B: 투표 조회 (40%)
    vote_viewing: {
      // executor: 'constant-arrival-rate',
      executor: 'constant-vus',
      exec: 'voteViewing',
      // rate: 150, // 초당 100번 요청
      // timeUnit: '1s',
      duration: '1m',
      vus: 1000,
      // preAllocatedVUs: 150, // 사전 할당 VU
      // maxVUs: 300, // 최대 VU
      tags: { scenario: 'B_VoteViewing' },
    },
  },
  // thresholds: {
    // http_req_duration: ['p(95)<1000'], // p95 < 100ms
    // 'http_req_duration{scenario:A_RoomCreation}': ['p(95)<100'],
    // 'http_req_duration{scenario:B_VoteViewing}': ['p(95)<100'],
    // 'http_req_duration{scenario:C_Voting}': ['p(95)<100'],
    // http_req_failed: ['rate<0.1'], // 에러율 < 1%
  // },
};

// 환경 변수로 설정 (docker-compose에서 전달)
const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';

// 사전에 생성된 방 세션 ID (setup-test-data.js 실행 후 설정 필요)
const TEST_ROOM_SESSIONS = __ENV.TEST_ROOMS
  ? JSON.parse(__ENV.TEST_ROOMS)
  : ["0NAS1423WDGDW","0NAS0K37GDJ6C","0NAS07850DJ6T","0NARZJ8Q0DGW9","0NARXDRM0DKP7","0NARX9QB8DJDJ","0NARX8E2GDJ3D","0NARX72T0DJB2","0NARW9PEWDKPP","0NARW1DERDG2V"];
  // : ["0NAQQNPXKDP3B","0NAQQP2DKDMVH","0NAQQPDTFDMKN","0NAQQPQ07DM0X","0NAQQQ0MZDQ66","0NAQQQ9E7DNXN","0NAQQQNM7DQ5T","0NAQQQZMVDME2","0NAQQRGS7DNMA","0NAQQRWW7DPFG"];

// 시나리오 B: 투표 조회
export function voteViewing() {
  const roomSession = TEST_ROOM_SESSIONS[Math.floor(Math.random() * TEST_ROOM_SESSIONS.length)];

  group('Vote Viewing', () => {
    const getRoomRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
      tags: { name: 'GetRoom', api: 'GET_/api/v1/rooms/{session}' },
    });

    check(getRoomRes, {
      'room retrieved': (r) => r.status === 200,
      // 'response time < 100ms': (r) => r.timings.duration < 100,
    });

    const getStatsRes = http.get(
      `${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`,
      {
        tags: { name: 'GetStatistics', api: 'GET_/api/v1/rooms/{session}/statistics' },
      }
    );

    check(getStatsRes, {
      'statistics retrieved': (r) => r.status === 200,
      // 'response time < 100ms': (r) => r.timings.duration < 100,
    });
  });
}

// 유틸리티 함수
function generateDateSlots(count) {
  const dates = [];
  const today = new Date('2026-01-01');
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function generateTimeSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

function generateRandomDateTimeSlots() {
  const dates = generateDateSlots(7);
  const times = ['10:00', '11:00', '14:00', '15:00', '16:00'];
  const slots = [];
  const count = Math.floor(Math.random() * 3) + 3; // 3~5개

  for (let i = 0; i < count; i++) {
    const date = dates[Math.floor(Math.random() * dates.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    slots.push(`${date}T${time}`);
  }

  return [...new Set(slots)]; // 중복 제거
}
