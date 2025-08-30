CREATE TABLE room_category
(
    id       BIGINT AUTO_INCREMENT,
    room_id  BIGINT      NOT NULL,
    category VARCHAR(20) NOT NULL,
    active   BOOLEAN     NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
