ALTER TABLE room_available_date_slot DROP PRIMARY KEY;
ALTER TABLE room_available_date_slot
    ADD COLUMN id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST,
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE room_available_time_slot DROP PRIMARY KEY;
ALTER TABLE room_available_time_slot
    ADD COLUMN id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST,
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE room_available_time_slot RENAME TO available_time_slot;
ALTER TABLE room_available_date_slot RENAME TO available_date_slot;
