## 프로덕션 부하테스트 — k6 시나리오 3종 + 결과 보고서

프로덕션 서버(Tomcat 15스레드, Hikari 5커넥션)의 성능 한계를 k6로 측정했습니다.
3개 시나리오 x 4단계(안정→한계→극한)로 총 12회 테스트를 수행했으며, 전체 결과와 분석은 [load-test-report.md](./load-test-report.md)에 정리되어 있습니다.

### 핵심 결과

| | 방 생성 + 참여자 등록 | 투표 수정 | 통계 조회 폴링 |
|---|---|---|---|
| **안정 구간** | 30VU, p50=30ms | 50VU, p50=39ms | 150VU, p50=43ms |
| **최대 TPS (에러 0%)** | 335 (혼합) | **104** | **173** |
| **에러 0% 한계** | 500VU까지 에러 없음 | 500VU까지 에러 없음 | **~733VU에서 최초 에러** |
| **1차 병목** | Hikari 커넥션 풀 | Hikari 커넥션 풀 | Tomcat 스레드 풀 |

- 쓰기는 Hikari 5개 커넥션이 병목. 투표 수정은 read-modify-write로 커넥션 점유가 길어 **~100 TPS가 물리적 천장**.
- 읽기는 캐시 덕에 DB를 우회하지만, **Tomcat 15스레드가 먼저 소진**되어 ~733VU에서 `connection reset by peer` 발생.
- 모든 쓰기 시나리오에서 500VU까지 에러율 0% — 서버가 에러 대신 응답 지연으로 대응하는 **graceful degradation** 확인.

### 발견한 잠재적 결함

투표 수정 API(`RoomApplicationService.updateParticipantVotes()`)에서 **차집합 기반 동시 수정 시 PK 중복 INSERT** race condition 발견.
동일 참여자에 대한 동시 요청이 같은 스냅샷을 읽고 각자 차집합을 계산하여, 양쪽 모두 "새 슬롯"으로 판단한 것을 INSERT할 때 충돌합니다.
정상 사용에서는 발생하지 않으나 네트워크 재시도로 트리거 가능하며, 낙관적 락(`@Version` + `OPTIMISTIC_FORCE_INCREMENT`)으로 해결 가능합니다.

### 변경 파일

```
load-test/
├── k6/
│   ├── config.js                    # BASE_URL, 공통 헤더
│   ├── helpers/api.js               # V1 API 호출 헬퍼
│   ├── scenarios/
│   │   ├── room-create.js           # 시나리오 1: 방 생성 + 참여자 등록
│   │   ├── vote-write.js            # 시나리오 2: 투표 수정
│   │   └── statistics-polling.js    # 시나리오 3: 통계 조회 폴링
│   └── results/                     # 시나리오별 raw 결과 (1~4차)
├── load-test-plan.md                # 테스트 계획서
└── load-test-report.md              # 종합 보고서 (병목 분석, API 무거움 순서, 코드 검증)
```
