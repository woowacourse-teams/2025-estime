import http from 'k6/http';
import {check, group} from 'k6';

// 현재 시간을 testid에 포함
const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '').replace(/:/g, '-');

/**
 * 투표 용량 테스트 (Vote Capacity Test)
 * - 점진적으로 VU를 증가시키면서 서버의 한계점 탐색
 * - p95가 500ms를 초과하면 테스트 중단
 */
export const options = {
    // 모든 메트릭에 적용되는 공통 태그
    tags: {
        testid: `vote-test-${timestamp}`,
        test_type: 'vote',
    },
    
    // 점진적 부하 증가 (Breaking Point 탐색)
    stages: [
        // Phase 1: Warm-up
        {duration: '8m', target: 135},    // 0 → 50 VU (1분)

        // // Phase 2: 점진적 증가 (각 단계마다 충분한 시간을 두고 관찰)
        // {duration: '1m', target: 30},   // 50 → 100 VU

        // {duration: '1m', target: 45},   // 100 → 200 VU

        // {duration: '1m', target: 60},   // 200 → 300 VU

        // {duration: '1m', target: 75},   // 300 → 400 VU

        // {duration: '1m', target: 90},   // 400 → 500 VU

        // {duration: '1m', target: 105},   // 500 → 600 VU

        // {duration: '1m', target: 120},   // 600 → 700 VU

        // {duration: '1m', target: 135},   // 700 → 800 VU

        // Phase 3: Cool-down (점진적 감소)
        {duration: '2m', target: 0},     // 현재 VU → 0
    ],

    // 임계값 설정 (하나라도 실패하면 테스트 중단)
    thresholds: {
        // HTTP 요청 duration p95가 500ms 초과 시 테스트 실패 및 중단
        'http_req_duration': [
            {
                threshold: 'p(95)<500',  // p95 < 500ms
                abortOnFail: true,        // 임계값 실패 시 즉시 테스트 중단
                delayAbortEval: '10s',     // 테스트 시작 후 1분은 평가 유예 (초기 안정화 시간)
            },
        ],

        // 추가 안전장치: 에러율 5% 초과 시 중단
        'http_req_failed': [
            {
                threshold: 'rate<0.05',   // 에러율 < 5%
                abortOnFail: true,
                delayAbortEval: '10s',     // 테스트 시작 후 1분은 평가 유예 (초기 안정화 시간)
            },
        ],

        // 개별 API endpoint별 임계값
        'http_req_duration{api:GET_/api/v1/rooms/{session}}': ['p(95)<500'],
        'http_req_duration{api:GET_/api/v1/rooms/{session}/statistics}': ['p(95)<500'],
        'http_req_duration{api:POST_/api/v1/rooms/{session}/participants}': ['p(95)<500'],
        'http_req_duration{api:GET_/api/v1/rooms/{session}/votes/participants}': ['p(95)<500'],
        'http_req_duration{api:PUT_/api/v1/rooms/{session}/votes/participants}': ['p(95)<500'],
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
    const participantName = `User_${__VU}`;

    group('Voting', () => {
        // 1. 방 정보 조회
        const getRoomRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}`, {
            tags: {name: 'GetRoom', api: 'GET_/api/v1/rooms/{session}'},
        });

        check(getRoomRes, {
            'room retrieved': (r) => r.status === 200,
        });

        // 2. 통계 조회
        const getStatsRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`, {
            tags: {name: 'GetStatistics', api: 'GET_/api/v1/rooms/{session}/statistics'},
        });

        check(getStatsRes, {
            'statistics retrieved': (r) => r.status === 200,
        });

        // 3. 참가자 생성
        const createParticipantPayload = JSON.stringify({
            participantName: participantName,
        });

        const createParticipantRes = http.post(
            `${BASE_URL}/api/v1/rooms/${roomSession}/participants`,
            createParticipantPayload,
            {
                headers: {'Content-Type': 'application/json'},
                tags: {name: 'CreateParticipant', api: 'POST_/api/v1/rooms/{session}/participants'},
            }
        );

        check(createParticipantRes, {
            'participant created': (r) => r.status === 200,
            'response time < 100ms': (r) => r.timings.duration < 100,
        });

        // 4. 투표 조회
        const getVotesRes = http.get(
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

        check(getVotesRes, {
            'votes retrieved': (r) => r.status === 200,
        });

        // 5. 투표 등록/수정 (1~3회 반복)
        const voteCount = Math.floor(Math.random() * 3) + 1; // 1~3회
        for (let i = 0; i < voteCount; i++) {
            const votePayload = JSON.stringify({
                participantName: participantName,
                dateTimeSlots: generateRandomDateTimeSlots(),
            });

            const voteRes = http.put(
                `${BASE_URL}/api/v1/rooms/${roomSession}/votes/participants`,
                votePayload,
                {
                    headers: {'Content-Type': 'application/json'},
                    tags: {name: 'UpdateVote', api: 'PUT_/api/v1/rooms/{session}/votes/participants'},
                }
            );

            check(voteRes, {
                'vote updated': (r) => r.status === 200,
                'response time < 100ms': (r) => r.timings.duration < 100,
            });

            // 6. 통계 재조회
            const reloadStatsRes = http.get(`${BASE_URL}/api/v1/rooms/${roomSession}/statistics/date-time-slots`, {
                tags: {name: 'GetStatistics', api: 'GET_/api/v1/rooms/{session}/statistics'},
            });

            check(reloadStatsRes, {
                'statistics reloaded': (r) => r.status === 200,
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

function generateRandomDateTimeSlots() {
    const dates = generateDateSlots(7);
    const times = generateTimeSlots();
    const count = 50;
    const slots = [];
    const usedIndices = new Set();

    // 필요한 개수만큼만 랜덤하게 선택 (중복 없이)
    while (slots.length < count) {
        const dateIdx = Math.floor(Math.random() * dates.length);
        const timeIdx = Math.floor(Math.random() * times.length);
        const key = dateIdx * times.length + timeIdx; // 고유 인덱스 생성

        if (!usedIndices.has(key)) {
            usedIndices.add(key);
            slots.push(`${dates[dateIdx]}T${times[timeIdx]}`);
        }
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
