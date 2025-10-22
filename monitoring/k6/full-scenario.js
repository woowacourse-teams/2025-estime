import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  scenarios: {
    // 시나리오 A: 방 생성 (10%)
    room_creation: {
      executor: 'constant-vus',
      exec: 'roomCreation',
      vus: 10,
      duration: '1m',
      tags: { scenario: 'A_RoomCreation' },
    },
    // 시나리오 B: 투표 조회 (40%)
    vote_viewing: {
      executor: 'constant-vus',
      exec: 'voteViewing',
      vus: 10,
      duration: '1m',
      tags: { scenario: 'B_VoteViewing' },
    },
    // 시나리오 C: 투표 참여 (50%)
    voting: {
      executor: 'constant-vus',
      exec: 'voting',
      vus: 10,
      duration: '1m',
      tags: { scenario: 'C_Voting' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<100'], // p95 < 100ms
    'http_req_duration{scenario:A_RoomCreation}': ['p(95)<100'],
    'http_req_duration{scenario:B_VoteViewing}': ['p(95)<100'],
    'http_req_duration{scenario:C_Voting}': ['p(95)<100'],
    http_req_failed: ['rate<0.01'], // 에러율 < 1%
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
      'response time < 100ms': (r) => r.timings.duration < 100,
    });

    if (createRes.status === 200) {
      const roomSession = JSON.parse(createRes.body).data.session;
      const getRoomRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
        tags: { name: 'GetRoom', api: 'GET_/api/v1/rooms/{session}' },
      });

      check(getRoomRes, {
        'room retrieved': (r) => r.status === 200,
        'response time < 100ms': (r) => r.timings.duration < 100,
      });
    }
  });
}

// 시나리오 B: 투표 조회
export function voteViewing() {
  const roomSession = TEST_ROOM_SESSIONS[Math.floor(Math.random() * TEST_ROOM_SESSIONS.length)];

  group('Vote Viewing', () => {
    const getRoomRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
      tags: { name: 'GetRoom', api: 'GET_/api/v1/rooms/{session}' },
    });

    check(getRoomRes, {
      'room retrieved': (r) => r.status === 200,
      'response time < 100ms': (r) => r.timings.duration < 100,
    });

    const getStatsRes = http.get(
      `${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`,
      {
        tags: { name: 'GetStatistics', api: 'GET_/api/v1/rooms/{session}/statistics' },
      }
    );

    check(getStatsRes, {
      'statistics retrieved': (r) => r.status === 200,
      'response time < 100ms': (r) => r.timings.duration < 100,
    });

    // SSE 연결은 5분 동안 유지 (여기서는 시뮬레이션)
    sleep(60); // 5분 대기
  });
}

// 시나리오 C: 투표 참여
export function voting() {
  const roomSession = TEST_ROOM_SESSIONS[Math.floor(Math.random() * TEST_ROOM_SESSIONS.length)];
  const participantName = `User_${__VU}`;

  group('Voting', () => {
    // 1. 방 정보 조회
    http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
      tags: { name: 'GetRoom', api: 'GET_/api/v1/rooms/{session}' },
    });

    // 2. 통계 조회
    http.get(`${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`, {
      tags: { name: 'GetStatistics', api: 'GET_/api/v1/rooms/{session}/statistics' },
    });

    sleep(5); // Think time: 5초

    // 3. 참가자 생성
    const createParticipantPayload = JSON.stringify({
      participantName: participantName,
    });

    const createParticipantRes = http.post(
      `${BASE_URL}/api/v1/rooms/${roomSession}/participants`,
      createParticipantPayload,
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'CreateParticipant', api: 'POST_/api/v1/rooms/{session}/participants' },
      }
    );

    check(createParticipantRes, {
      'participant created': (r) => r.status === 200,
      'response time < 100ms': (r) => r.timings.duration < 100,
    });

    // 4. 투표 조회
    http.get(
      `${BASE_URL}/api/v1/rooms/${roomSession}/votes/participants?participantName=${encodeURIComponent(
        participantName
      )}`,
      {
        tags: {
          name: 'GetParticipantVotes',
          api: 'GET_/api/v1/rooms/{session}/votes/participants',
        },
      }
    );

    sleep(10); // Think time: 10초

    // 5. 투표 등록/수정 (3~5회 반복)
    const voteCount = Math.floor(Math.random() * 3) + 3; // 3~5회
    for (let i = 0; i < voteCount; i++) {
      const votePayload = JSON.stringify({
        participantName: participantName,
        dateTimeSlots: generateRandomDateTimeSlots(),
      });

      const voteRes = http.put(
        `${BASE_URL}/api/v1/rooms/${roomSession}/votes/participants`,
        votePayload,
        {
          headers: { 'Content-Type': 'application/json' },
          tags: { name: 'UpdateVote', api: 'PUT_/api/v1/rooms/{session}/votes/participants' },
        }
      );

      check(voteRes, {
        'vote updated': (r) => r.status === 200,
        'response time < 100ms': (r) => r.timings.duration < 100,
      });

      // 6. 통계 재조회
      http.get(`${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`, {
        tags: { name: 'GetStatistics', api: 'GET_/api/v1/rooms/{session}/statistics' },
      });

      sleep(30); // Think time: 30초
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
