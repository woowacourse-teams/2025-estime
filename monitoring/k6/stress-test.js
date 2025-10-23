import http from 'k6/http';
import { check, sleep } from 'k6';

// 현재 시간을 testid에 포함
const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '').replace(/:/g, '-');

// 단계적 부하 증가로 서버 한계 측정
export const options = {
  // 모든 메트릭에 적용되는 공통 태그
  tags: {
    testid: `stress-test-${timestamp}`, // 날짜+시간 포함 고유 ID
    test_type: 'stress', // 테스트 종류별 필터링용
  },

  stages: [
    // Warm-up
    { duration: '2m', target: 50 },    // 0-50 VUs over 2m
    { duration: '2m', target: 50 },    // Stay at 50 VUs for 2m

    // Load Testing - 점진적 증가
    { duration: '3m', target: 100 },   // 50-100 VUs
    { duration: '3m', target: 100 },   // Stay at 100

    { duration: '3m', target: 200 },   // 100-200 VUs
    { duration: '3m', target: 200 },   // Stay at 200

    { duration: '3m', target: 500 },   // 200-500 VUs
    { duration: '3m', target: 500 },   // Stay at 500

    // Stress Testing - 한계 탐색
    { duration: '3m', target: 1000 },  // 500-1000 VUs
    { duration: '5m', target: 1000 },  // Stay at 1000

    { duration: '3m', target: 2000 },  // 1000-2000 VUs
    { duration: '5m', target: 2000 },  // Stay at 2000

    { duration: '3m', target: 3000 },  // 2000-3000 VUs
    { duration: '5m', target: 3000 },  // Stay at 3000

    { duration: '3m', target: 5000 },  // 3000-5000 VUs (Breaking Point 예상)
    { duration: '5m', target: 5000 },  // Stay at 5000

    // Cool-down
    { duration: '2m', target: 0 },     // Ramp down to 0
  ],

  thresholds: {
    // 한계점 판단 기준
    'http_req_duration{scenario:stress}': ['p95<1000'], // p95 < 1s (느슨한 기준)
    'http_req_failed{scenario:stress}': ['rate<0.05'],  // 에러율 < 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';

// 테스트용 방 세션 ID
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

export default function () {
  const roomSession = TEST_ROOM_SESSIONS[Math.floor(Math.random() * TEST_ROOM_SESSIONS.length)];

  // 1. 방 정보 조회
  const getRoomRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
    tags: {
      name: 'GetRoom',
      api: 'GET_/api/v1/rooms/{session}',
      scenario: 'stress'
    },
  });

  check(getRoomRes, {
    'room retrieved': (r) => r.status === 200,
  });

  // 2. 통계 조회
  const getStatsRes = http.get(
    `${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`,
    {
      tags: {
        name: 'GetStatistics',
        api: 'GET_/api/v1/rooms/{session}/statistics',
        scenario: 'stress'
      },
    }
  );

  check(getStatsRes, {
    'statistics retrieved': (r) => r.status === 200,
  });

  // 짧은 대기 시간 (높은 부하 생성)
  sleep(1);
}
