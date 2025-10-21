ALTER TABLE platform
    ADD COLUMN notification_on_created  TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN notification_on_remind   TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN notification_on_deadline TINYINT(1) NOT NULL DEFAULT 0;
