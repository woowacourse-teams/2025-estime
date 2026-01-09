ALTER TABLE platform
    CHANGE COLUMN notification_on_created notification_on_creation TINYINT(1) NOT NULL,
    CHANGE COLUMN notification_on_remind notification_on_reminder TINYINT(1) NOT NULL;
