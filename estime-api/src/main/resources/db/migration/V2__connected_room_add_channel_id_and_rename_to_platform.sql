-- 1) platform 테이블 생성
CREATE TABLE platform
(
    id BIGINT NOT NULL AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    type ENUM ('DISCORD') NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UK_platform_room_id (room_id),
    CONSTRAINT FK_platform_room_id
        FOREIGN KEY (room_id)
        REFERENCES room (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 2) platform에 기존 데이터 삽입
INSERT INTO platform (id, room_id, type, channel_id)
    SELECT id,
           room_id,
           platform,
           IFNULL(channel_id, CONCAT('DUMMY_', id)) AS channel_id
    FROM connected_room
    WHERE platform = 'DISCORD';

-- 3) manual.sql 수동 실행 #1
