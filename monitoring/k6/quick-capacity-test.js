import http from 'k6/http';
import { check, sleep } from 'k6';

// 현재 시간을 testid에 포함
const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '').replace(/:/g, '-');

/**
 * 빠른 용량 테스트 (Quick Capacity Test)
 * - 짧은 시간 안에 서버 용량의 대략적인 한계 파악
 * - p95가 500ms를 초과하면 즉시 테스트 중단
 * - 총 소요 시간: 약 10-20분 (중단 시점에 따라)
 */
export const options = {
  tags: {
    testid: `quick-capacity-${timestamp}`,
    test_type: 'quick-capacity',
  },

  // 빠른 증가 전략
  stages: [
    // Warm-up
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },

    // 50씩 빠르게 증가
    { duration: '1m', target: 100 },
    { duration: '2m', target: 100 },

    { duration: '1m', target: 150 },
    { duration: '2m', target: 150 },

    { duration: '1m', target: 200 },
    { duration: '2m', target: 200 },

    { duration: '1m', target: 250 },
    { duration: '2m', target: 250 },

    { duration: '1m', target: 300 },
    { duration: '2m', target: 300 },

    { duration: '1m', target: 350 },
    { duration: '2m', target: 350 },

    { duration: '1m', target: 400 },
    { duration: '2m', target: 400 },

    { duration: '1m', target: 450 },
    { duration: '2m', target: 450 },

    { duration: '1m', target: 500 },
    { duration: '2m', target: 500 },

    // Cool-down
    { duration: '1m', target: 0 },
  ],

  thresholds: {
    'http_req_duration': [
      {
        threshold: 'p(95)<500',
        abortOnFail: true,
        delayAbortEval: '30s',  // 30초만 유예
      },
    ],
    'http_req_failed': [
      {
        threshold: 'rate<0.05',
        abortOnFail: true,
        delayAbortEval: '30s',
      },
    ],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';

const TEST_ROOM_SESSIONS = __ENV.TEST_ROOMS
  ? JSON.parse(__ENV.TEST_ROOMS)
  : [
      "0NAS1423WDGDW",
      "0NAS0K37GDJ6C",
      "0NAS07850DJ6T",
      "0NARZJ8Q0DGW9",
      "0NARXDRM0DKP7",
      "0NARX9QB8DJDJ",
      "0NARX8E2GDJ3D",
      "0NARX72T0DJB2",
      "0NARW9PEWDKPP",
      "0NARW1DERDG2V"
    ];

export default function () {
  const roomSession = TEST_ROOM_SESSIONS[Math.floor(Math.random() * TEST_ROOM_SESSIONS.length)];

  const getRoomRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
    tags: { name: 'GetRoom', api: 'GET_/api/v1/rooms/{session}' },
  });

  check(getRoomRes, {
    'room retrieved': (r) => r.status === 200,
  });

  const getStatsRes = http.get(
    `${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`,
    {
      tags: { name: 'GetStatistics', api: 'GET_/api/v1/rooms/{session}/statistics' },
    }
  );

  check(getStatsRes, {
    'statistics retrieved': (r) => r.status === 200,
  });

  sleep(1);
}
