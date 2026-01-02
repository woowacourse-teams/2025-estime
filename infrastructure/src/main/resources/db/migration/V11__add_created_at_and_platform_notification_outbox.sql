-- Add created_at column to BaseEntity tables
ALTER TABLE room
    ADD COLUMN created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

ALTER TABLE participant
    ADD COLUMN created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

ALTER TABLE platform
    ADD COLUMN created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

ALTER TABLE available_date_slot
    ADD COLUMN created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

ALTER TABLE available_time_slot
    ADD COLUMN created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- Create platform_notification_outbox table
CREATE TABLE platform_notification_outbox
(
    id                         BIGINT                                                NOT NULL AUTO_INCREMENT,
    room_id                    BIGINT                                                NOT NULL,
    platform_type              ENUM ('DISCORD')                                      NOT NULL,
    channel_id                 VARCHAR(255)                                          NOT NULL,
    platform_notification_type ENUM ('CREATED', 'REMIND', 'SOLVED')                  NOT NULL,
    status                     ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL,
    scheduled_at               DATETIME(6)                                           NOT NULL,
    retry_count                INT                                                   NOT NULL DEFAULT 0,
    created_at                 DATETIME(6)                                           NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    active                     BOOLEAN                                               NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    INDEX idx_outbox_status_scheduled_at (status, scheduled_at),
    INDEX idx_outbox_room_id (room_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
