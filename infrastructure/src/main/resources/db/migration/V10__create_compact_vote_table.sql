-- CompactVote 테이블 생성
-- CompactDateTimeSlot을 사용한 압축 저장 방식
-- 기존 vote 테이블과 병렬 운영

CREATE TABLE compact_vote
(
    compact_date_time_slot MEDIUMINT UNSIGNED NOT NULL COMMENT '압축된 날짜+시간 슬롯 (20비트: 날짜 12비트 + 시간 8비트)',
    participant_id         BIGINT             NOT NULL,
    PRIMARY KEY (participant_id, compact_date_time_slot)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
