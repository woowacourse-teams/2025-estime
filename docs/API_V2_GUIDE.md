# Compact Vote API 가이드

## 개요

30분 단위 고정 시간을 압축 인코딩하여 저장하는 투표 API입니다.

**주요 개선사항:**

- DB 스토리지 절감: 8 bytes → 3 bytes
- 연산 성능 향상: 통계 계산 2.7배, 정렬 2.2배 빠름
- V1과 병렬 운영 가능

---

## 압축 슬롯 인코딩

### 포맷: 20비트 (날짜 12비트 + 시간 8비트)

```
[날짜 부분] - 12비트
  - 범위: 0 ~ 4095일
  - 기준일(EPOCH): 2025-10-24
  - 약 11.2년 표현 가능

[시간 부분] - 8비트
  - 범위: 0 ~ 47 (30분 단위, 00:00 ~ 23:30)
  - 여유: 48 ~ 255 (미사용, 추후 슬롯 크기 변경 고려 [30 -> 10, 15])
```

### 클라이언트 계산 공식

```javascript
const EPOCH = new Date('2025-10-24');

// 인코딩: 날짜/시간 → 슬롯 코드
function encode(dateTime) {
    const dayOffset = Math.floor((dateTime - EPOCH) / (1000 * 60 * 60 * 24));
    const timeSlotIndex = Math.floor((dateTime.getHours() * 60 + dateTime.getMinutes()) / 30);
    return (dayOffset << 8) | timeSlotIndex;
}

// 디코딩: 슬롯 코드 → 날짜/시간
function decode(encoded) {
    const dayOffset = (encoded >> 8) & 0xFFF;
    const timeSlotIndex = encoded & 0xFF;

    const date = new Date(EPOCH);
    date.setDate(date.getDate() + dayOffset);

    const totalMinutes = timeSlotIndex * 30;
    date.setHours(Math.floor(totalMinutes / 60));
    date.setMinutes(totalMinutes % 60);

    return date;
}
```

### 예시

| 날짜/시간            | 계산               | 결과    |
|------------------|------------------|-------|
| 2025-10-24 14:00 | day=0, slot=28   | 28    |
| 2025-11-07 09:30 | day=14, slot=19  | 3603  |
| 2026-02-01 23:30 | day=100, slot=47 | 25647 |

### 데이터 표현

슬롯 코드는 **정수(integer)** 로 처리하고 전송합니다.

- 서버: int 타입 (Java), MEDIUMINT (DB)
- 통신: 10진수 정수 (JSON number)
- 연산: 정수 비교/해싱
- 예시: 3603 (2025-11-07 09:30)


**인코딩 포맷:**
- 20비트 구조 (날짜 12비트 + 시간 8비트)
- 실제 연산은 단순 정수 비교 (`3603 < 3604`)
- 비트 연산은 디코딩 시에만 사용 (디버깅/검증)

**특징:**
- 최대값: 1,048,575 (20비트)
- 실제 사용: 처음 1년간 0~18,000
- JSON number 타입 (따옴표 불필요)
- 클라이언트/서버 모두 정수로 처리하도록 최적화하는 방향으로 진행하기로 협의

---

### Q. EPOCH는 왜 2025-10-24인가요?

최종 데모일(런칭일)을 기준으로 설정했습니다.

### Q. V1과 V2를 동시에 사용할 수 있나요?

네, 현재 V1과 V2는 별도 테이블(`vote`, `compact_vote`)을 사용하여 독립적으로 동작합니다.
