# CompactVote 디버깅 가이드

`compact_vote` 테이블은 날짜/시간을 압축된 정수값(`compact_date_time_slot`)으로 저장합니다.
이 문서는 디버깅 및 데이터 분석 시 압축된 값을 사람이 읽을 수 있는 형태로 변환하는 방법을 설명합니다.

## 압축 포맷

- **EPOCH**: `2025-10-24` (최종 데모일/런칭일)
- **날짜 부분** (12비트): EPOCH로부터 경과한 일수 (상위 12비트)
- **시간 부분** (8비트): 30분 단위 슬롯 인덱스 (하위 8비트, 0~47)

## 디버깅용 SQL 쿼리

### 기본 조회 쿼리

압축된 값을 날짜/시간으로 변환하여 조회:

```sql
SELECT
    CONCAT('0x', LPAD(HEX(v.compact_date_time_slot), 5, '0')) AS hex_code,
    v.compact_date_time_slot,
    DATE_ADD('2025-10-24', INTERVAL (v.compact_date_time_slot >> 8) DAY) AS date,
    SEC_TO_TIME(((v.compact_date_time_slot & 0xFF) * 30) * 60) AS time,
    TIMESTAMP(
        DATE_ADD('2025-10-24', INTERVAL (v.compact_date_time_slot >> 8) DAY),
        SEC_TO_TIME(((v.compact_date_time_slot & 0xFF) * 30) * 60)
    ) AS datetime,
    v.participant_id,
    p.name AS participant_name
FROM compact_vote v
INNER JOIN participant p ON v.participant_id = p.id;
```

### VIEW 생성 (선택사항)

자주 사용하는 경우 VIEW로 만들어 사용할 수 있습니다:

```sql
CREATE OR REPLACE VIEW compact_vote_readable AS
SELECT
    CONCAT('0x', LPAD(HEX(v.compact_date_time_slot), 5, '0')) AS hex_code,
    v.compact_date_time_slot,
    DATE_ADD('2025-10-24', INTERVAL (v.compact_date_time_slot >> 8) DAY) AS date,
    SEC_TO_TIME(((v.compact_date_time_slot & 0xFF) * 30) * 60) AS time,
    TIMESTAMP(
        DATE_ADD('2025-10-24', INTERVAL (v.compact_date_time_slot >> 8) DAY),
        SEC_TO_TIME(((v.compact_date_time_slot & 0xFF) * 30) * 60)
    ) AS datetime,
    v.participant_id,
    p.name AS participant_name
FROM compact_vote v
INNER JOIN participant p ON v.participant_id = p.id;
```

**참고**: VIEW 생성에는 `CREATE VIEW` 권한이 필요합니다.

### 사용 예시

VIEW를 생성한 경우:

```sql
-- 특정 참가자의 투표 조회
SELECT * FROM compact_vote_readable
WHERE participant_name = 'user1';

-- 특정 날짜의 모든 투표 조회
SELECT * FROM compact_vote_readable
WHERE date = '2025-11-01';

-- 특정 시간대의 투표 통계
SELECT date, time, COUNT(*) as vote_count
FROM compact_vote_readable
GROUP BY date, time
ORDER BY date, time;
```

## 값 변환 예시

| compact_date_time_slot (정수) | hex_code | 날짜 | 시간 | datetime |
|-------------------------------|----------|------|------|----------|
| 28 | 0x0001C | 2025-10-24 | 14:00 | 2025-10-24 14:00:00 |
| 3603 | 0x0E13 | 2025-11-07 | 09:30 | 2025-11-07 09:30:00 |
| 25647 | 0x642F | 2026-02-01 | 23:30 | 2026-02-01 23:30:00 |

## 관련 문서

- [API V2 가이드](./API_V2_GUIDE.md)
- [V2 성능 벤치마크](./V2_PERFORMANCE_BENCHMARK.md)