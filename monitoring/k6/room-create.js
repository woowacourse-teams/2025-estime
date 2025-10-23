import http from 'k6/http';
import { check, sleep, group } from 'k6';

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
    // Phase 1: Warm-up
    { duration: '1m', target: 50 },    // 0 → 50 VU (1분)
    { duration: '30s', target: 50 },    // 50 VU 유지 (2분)

    // Phase 2: 점진적 증가 (각 단계마다 충분한 시간을 두고 관찰)
    { duration: '2m', target: 100 },   // 50 → 100 VU
    { duration: '30s', target: 100 },   // 100 VU 유지

    { duration: '2m', target: 200 },   // 100 → 200 VU
    { duration: '30s', target: 200 },   // 200 VU 유지

    { duration: '2m', target: 300 },   // 200 → 300 VU
    { duration: '30s', target: 300 },   // 300 VU 유지

    { duration: '2m', target: 400 },   // 300 → 400 VU
    { duration: '30s', target: 400 },   // 400 VU 유지

    { duration: '2m', target: 500 },   // 400 → 500 VU
    { duration: '30s', target: 500 },   // 500 VU 유지

    { duration: '2m', target: 600 },   // 500 → 600 VU
    { duration: '30s', target: 600 },   // 600 VU 유지

    { duration: '2m', target: 700 },   // 600 → 700 VU
    { duration: '30s', target: 700 },   // 700 VU 유지

    { duration: '2m', target: 800 },   // 700 → 800 VU
    { duration: '30s', target: 800 },   // 800 VU 유지

    // Phase 3: Cool-down (점진적 감소)
    { duration: '2m', target: 0 },     // 현재 VU → 0
  ],

  // 임계값 설정 (하나라도 실패하면 테스트 중단)
  thresholds: {
    // HTTP 요청 duration p95가 500ms 초과 시 테스트 실패 및 중단
    'http_req_duration': [
      {
        threshold: 'p(95)<500',  // p95 < 500ms
        abortOnFail: true,        // 임계값 실패 시 즉시 테스트 중단
        delayAbortEval: '1m',     // 테스트 시작 후 1분은 평가 유예 (초기 안정화 시간)
      },
    ],

    // 추가 안전장치: 에러율 5% 초과 시 중단
    'http_req_failed': [
      {
        threshold: 'rate<0.05',   // 에러율 < 5%
        abortOnFail: true,
        delayAbortEval: '1m',
      },
    ],

    // 개별 API endpoint별 임계값
    'http_req_duration{api:POST_/api/v1/rooms}': ['p(95)<500'],
  },
};

// 환경 변수로 설정
const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';

export default function () {
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
      'response time OK': (r) => r.timings.duration < 1000, // 개별 요청은 1초 이내
    });
  });

  sleep(1); // Think time
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
