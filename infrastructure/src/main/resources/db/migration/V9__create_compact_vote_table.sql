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

-- 가독성을 위한 VIEW (디버깅/분석용)
-- compact_date_time_slot을 실제 날짜/시간으로 변환하여 표시
-- EPOCH: 2025-10-24 (최종 데모일/런칭일)
CREATE OR REPLACE VIEW compact_vote_readable AS
SELECT CONCAT('0x', LPAD(HEX(v.compact_date_time_slot), 5, '0'))            AS hex_code,
       v.compact_date_time_slot,
       DATE_ADD('2025-10-24', INTERVAL (v.compact_date_time_slot >> 8) DAY) AS date,
       SEC_TO_TIME(((v.compact_date_time_slot & 0xFF) * 30) * 60)           AS time,
       TIMESTAMP(
               DATE_ADD('2025-10-24', INTERVAL (v.compact_date_time_slot >> 8) DAY),
               SEC_TO_TIME(((v.compact_date_time_slot & 0xFF) * 30) * 60)
       )                                                                    AS datetime,
       v.participant_id,
       p.name                                                               AS participant_name
FROM compact_vote v
         INNER JOIN participant p ON v.participant_id = p.id;
