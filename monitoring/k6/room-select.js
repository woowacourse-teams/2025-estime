import http from 'k6/http';
import { check, sleep } from 'k6';

// 현재 시간을 testid에 포함
const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '').replace(/:/g, '-');

/**
 * 용량 테스트 (Capacity Test)
 * - 점진적으로 VU를 증가시키면서 서버의 한계점 탐색
 * - p95가 500ms를 초과하면 테스트 중단
 */
export const options = {
  // 모든 메트릭에 적용되는 공통 태그
  tags: {
    testid: `capacity-test-${timestamp}`,
    test_type: 'capacity',
  },

  // 점진적 부하 증가 (Breaking Point 탐색)
  stages: [
    { duration: '5m', target: 100 },
  ],

  // 임계값 설정 (하나라도 실패하면 테스트 중단)
  thresholds: {
    // HTTP 요청 duration p95가 500ms 초과 시 테스트 실패 및 중단
    'http_req_duration': [
      {
        threshold: 'p(95)<500',  // p95 < 500ms
        abortOnFail: true,        // 임계값 실패 시 즉시 테스트 중단
        delayAbortEval: '10s',     // 10초는 평가 유예 (초기 안정화 시간)
      },
    ],

    // 추가 안전장치: 에러율 5% 초과 시 중단
    'http_req_failed': [
      {
        threshold: 'rate<0.05',   // 에러율 < 5%
        abortOnFail: true,
        delayAbortEval: '10s',
      },
    ],

    // 개별 API endpoint별 임계값
    'http_req_duration{api:GET_/api/v1/rooms/{session}}': ['p(95)<500'],
    'http_req_duration{api:GET_/api/v1/rooms/{session}/statistics}': ['p(95)<500'],
  },
};

// 환경 변수로 설정
const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';

// 테스트용 방 세션 ID
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

  // 1. 방 정보 조회
  const getRoomRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
    tags: {
      name: 'GetRoom',
      api: 'GET_/api/v1/rooms/{session}',
    },
  });

  check(getRoomRes, {
    'room retrieved': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 1000, // 개별 요청은 1초 이내
  });

  // 2. 통계 조회
  const getStatsRes = http.get(
    `${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`,
    {
      tags: {
        name: 'GetStatistics',
        api: 'GET_/api/v1/rooms/{session}/statistics',
      },
    }
  );

  check(getStatsRes, {
    'statistics retrieved': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 1000,
  });
}

/**
 * 테스트 결과 분석 가이드:
 *
 * 1. 테스트가 완료되거나 중단되면:
 *    - Grafana에서 testid로 필터링
 *    - Performance Overview 패널에서 VU와 응답시간 상관관계 확인
 *    - 어느 VU 수준에서 p95가 500ms를 넘었는지 확인
 *
 * 2. 용량 판단:
 *    - 테스트가 중단된 시점의 VU 수 = 최대 처리 가능 동시 사용자 수
 *    - p95가 400ms 근처를 유지하는 VU 수 = 안전한 운영 용량
 *
 * 3. 다음 단계:
 *    - 병목 구간 식별 (HTTP Latency Timings 패널)
 *    - 데이터베이스, 네트워크, 애플리케이션 레이어 분석
 *    - 최적화 후 재테스트
 */
