import http from 'k6/http';
import { check, sleep, group } from 'k6';

// 현재 시간을 testid에 포함
const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '').replace(/:/g, '-');

export const options = {
  // 모든 메트릭에 적용되는 공통 태그
  tags: {
    testid: `room-create-${timestamp}`, // 날짜+시간 포함 고유 ID
    test_type: 'room-create', // 테스트 종류별 필터링용
  },

  scenarios: {
    // 시나리오 A: 방 생성
    room_creation: {
      executor: 'constant-vus',
      exec: 'roomCreation',
      vus: 100,
      duration: '5m',
      tags: { scenario: 'A_RoomCreation' },
    },
  },
  thresholds: {
	  'http_req_duration{api:POST_/api/v1/rooms}': ['p(95)<300'],
	  'http_req_duration{api:GET_/api/v1/rooms/{session}}': ['p(95)<200'],
  },
};

// 환경 변수로 설정 (docker-compose에서 전달)
const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';

// 사전에 생성된 방 세션 ID (setup-test-data.js 실행 후 설정 필요)
const TEST_ROOM_SESSIONS = __ENV.TEST_ROOMS
  ? JSON.parse(__ENV.TEST_ROOMS)
  : [
      '0NAQQNPXKDP3B',
      '0NAQQP2DKDMVH',
      '0NAQQPDTFDMKN',
      '0NAQQPQ07DM0X',
      '0NAQQQ0MZDQ66',
      '0NAQQQ9E7DNXN',
      '0NAQQQNM7DQ5T',
      '0NAQQQZMVDME2',
      '0NAQQRGS7DNMA',
      '0NAQQRWW7DPFG',
    ];

// 시나리오 A: 방 생성
export function roomCreation() {
  sleep(20); // Think time: 20초

  group('Room Creation', () => {
    const createPayload = JSON.stringify({
      title: `Test_${__VU}`,
      availableDateSlots: generateDateSlots(7),
      availableTimeSlots: generateTimeSlots(),
      deadline: '2026-12-31T23:30',
    });

    const createRes = http.post(`${BASE_URL}/api/v1/rooms`, createPayload, {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'CreateRoom', api: 'POST_/api/v1/rooms' },
    });

    check(createRes, {
      'room created': (r) => r.status === 200,
      'response time < 300ms': (r) => r.timings.duration < 300,
    });

    if (createRes.status === 200) {
      const roomSession = JSON.parse(createRes.body).data.session;
      const getRoomRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
        tags: { name: 'GetRoom', api: 'GET_/api/v1/rooms/{session}' },
      });

      check(getRoomRes, {
        'room retrieved': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
      });
    }
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
