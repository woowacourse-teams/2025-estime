-- 1) channel_id 컬럼 NULL 허용으로 추가
ALTER TABLE connected_room
    ADD COLUMN channel_id VARCHAR(255) NULL;

-- 2) 기존 행 더미 값으로 백필
UPDATE connected_room
SET channel_id = CONCAT('DUMMY_', id)
WHERE channel_id IS NULL;

-- 3) NOT NULL로 고정
ALTER TABLE connected_room
    MODIFY COLUMN channel_id VARCHAR(255) NOT NULL;

-- 4) platform → platform_type (ENUM 유지)
ALTER TABLE connected_room
    CHANGE COLUMN platform type ENUM('DISCORD') NOT NULL;

-- 5) 테이블명 변경
RENAME TABLE connected_room TO platform;

-- 6) manual.sql 수동 실행 #1
