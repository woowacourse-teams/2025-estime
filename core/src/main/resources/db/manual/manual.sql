-- 1) 제약 조건 이름 변경
-- MySQL에서는 직접 이름 변경 불가 → 드롭 후 재생성 필요
ALTER TABLE connected_room DROP FOREIGN KEY FK_connected_room_room_id;
ALTER TABLE connected_room DROP INDEX UK_connected_room_room_id;

ALTER TABLE connected_room
    ADD CONSTRAINT UK_platform_room_id UNIQUE (room_id),
    ADD CONSTRAINT FK_platform_room_id
        FOREIGN KEY (room_id) REFERENCES room (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
