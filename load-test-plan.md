# 아인슈타임(Estime) 부하테스트 계획

## Context

아인슈타임은 모임 시간 조율 서비스로, 방장이 방을 생성하고 참여자들이 가능한 시간에 투표하는 구조입니다. 인증 없이 공개 API로 운영되며, 실시간 업데이트를 SSE로 제공합니다.

현재 프로덕션 리소스가 매우 제한적이므로, 이 제약 조건 하에서 서비스가 어디까지 버틸 수 있는지 확인하는 것이 핵심 목표입니다.

### 테스트 환경
- **대상**: Production 서버 (`https://prod.estime.today`)
- **도구**: k6
- **API 버전**: V1 (V2는 Nginx에서 프록시되지 않아 404 반환)
- **주의**: 프로덕션 대상이므로 보수적 임계값 + 자동 중단(abort) 조건 필수

### 인프라 제약
| 리소스 | 설정값 |
|--------|-------|
| Tomcat max-threads | **15** |
| Tomcat accept-count | **5** |
| Hikari max-pool-size | **5** |
| Hikari connection-timeout | **30s** |
| Caffeine cache TTL | **500ms** |
| Nginx rate limit (api_general) | **300r/m (5r/s)** - 테스트 시 비활성화 |
| Nginx rate limit (api_sse) | **10r/m** - 테스트 시 비활성화 |

### 테스트 방법론

각 시나리오는 3~4회 실행합니다:
- **1~2차**: 적절한 부하를 견딜 수 있는지 안정성 확인 (재현성 검증)
- **3~4차**: 어디까지 버틸 수 있는지 한계 탐색 (실패 지점 도달 시 조기 종료)

### 임계값 (Thresholds)

```js
http_req_failed: rate == 0  (에러 발생 시 즉시 중단)
http_req_duration: p(50) < 100ms, p(95) < 500ms, p(99) < 3000ms
checks: rate == 1  (체크 실패 시 즉시 중단)
```

---

## 시나리오 목록

| 순서 | 시나리오 | 파일 | 결과 |
|------|---------|------|------|
| 사전 탐색 | 통계 조회 (가벼운 데이터) | - | [results/exploration.md](load-test/k6/results/exploration.md) |
| 1 | 방 생성 + 참여자 등록 | `room-create.js` | [results/room-create.md](load-test/k6/results/room-create.md) |
| 2 | 투표 쓰기 | `vote-write.js` | [results/vote-write.md](load-test/k6/results/vote-write.md) |
| 3 | 통계 조회 강화 | `statistics-polling.js` | [results/statistics-polling.md](load-test/k6/results/statistics-polling.md) |

---

## 파일 구조

```
load-test/
└── k6/
    ├── config.js                      # BASE_URL, 임계값, 헤더
    ├── helpers/
    │   └── api.js                     # API 호출 헬퍼 (V1)
    ├── scenarios/
    │   ├── room-create.js             # 시나리오 1: 방 생성 + 참여자 등록
    │   ├── vote-write.js              # 시나리오 2: 투표 쓰기
    │   └── statistics-polling.js      # 시나리오 3: 통계 조회
    └── results/
        ├── exploration.md             # 사전 탐색 결과
        ├── room-create.md             # 시나리오 1 결과
        ├── vote-write.md              # 시나리오 2 결과
        └── statistics-polling.md      # 시나리오 3 결과
```

## 실행 방법

```bash
# Nginx rate limit 비활성화 (테스트 전)
sudo sed -i 's/^\(\s*limit_req zone=\)/# \1/' /etc/nginx/sites-available/default
sudo nginx -t && sudo nginx -s reload

# 시나리오 순서대로 실행
k6 run load-test/k6/scenarios/room-create.js
k6 run load-test/k6/scenarios/vote-write.js
k6 run load-test/k6/scenarios/statistics-polling.js

# Nginx rate limit 원복 (테스트 후)
sudo sed -i 's/^# \(\s*limit_req zone=\)/\1/' /etc/nginx/sites-available/default
sudo nginx -t && sudo nginx -s reload
```

## 발견 사항

### Nginx Rate Limiting
- `api_general`: 300r/m (5r/s), burst=100
- `api_sse`: 10r/m, burst=5
- 같은 IP에서 부하테스트 시 ~7 VU부터 429 Too Many Requests 발생
- **해결**: 테스트 시 `limit_req` 주석처리 -> 테스트 후 원복

### V2 API 미지원
- 프로덕션 Nginx가 V2 엔드포인트를 프록시하지 않아 404 반환
- 모든 테스트 스크립트를 V1 API로 작성

### GC STW Pause
- 읽기 테스트에서 VU 수와 무관하게 p99 ~1.06s 일정하게 관측
- GC Stop-The-World pause로 추정 (Grafana `jvm_gc_pause_seconds_max` 확인 필요)
