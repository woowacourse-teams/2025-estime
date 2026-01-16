-- 복합 기본키를 가진 room_available_slot 테이블 생성
-- slot_code 인코딩: (dayOffset << 8) | timeSlotIndex
-- dayOffset = EPOCH(2025-10-24) 기준 일수, timeSlotIndex = (hour * 60 + minute) / 30
CREATE TABLE room_available_slot
(
    room_id   BIGINT NOT NULL,
    slot_code INT    NOT NULL,
    PRIMARY KEY (room_id, slot_code)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 기존 데이터 마이그레이션 (date × time 카테시안 곱)
INSERT INTO room_available_slot (room_id, slot_code)
SELECT d.room_id,
       ((DATEDIFF(d.start_at, '2025-10-24') << 8) |
        ((HOUR(t.start_at) * 60 + MINUTE(t.start_at)) DIV 30)) AS slot_code
FROM available_date_slot d
         JOIN available_time_slot t ON d.room_id = t.room_id
WHERE d.active = true
  AND t.active = true;

-- 기존 테이블 삭제
DROP TABLE available_date_slot;
DROP TABLE available_time_slot;
