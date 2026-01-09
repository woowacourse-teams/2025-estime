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
    platform_notification_type ENUM ('CREATION', 'REMINDER', 'DEADLINE')             NOT NULL,
    status                     ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL,
    scheduled_at               DATETIME(6)                                           NOT NULL,
    retry_count                INT                                                   NOT NULL DEFAULT 0,
    updated_at                 DATETIME(6)                                           NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_outbox_status_scheduled_at (status, scheduled_at),
    INDEX idx_outbox_status_updated_at (status, updated_at)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
