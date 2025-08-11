  -- Room
CREATE TABLE room (
    id BIGINT NOT NULL AUTO_INCREMENT,
    deadline DATETIME(6) NOT NULL,
    session VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Connected Room
CREATE TABLE connected_room (
    id BIGINT NOT NULL AUTO_INCREMENT,
    platform ENUM ('DISCORD','SLACK') NOT NULL,
    room_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UK_connected_room_room_id (room_id),
    CONSTRAINT FK_connected_room_room_id
        FOREIGN KEY (room_id) REFERENCES room (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Participant
CREATE TABLE participant (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    room_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_participant_room_id
        FOREIGN KEY (room_id) REFERENCES room (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Room Available Date Slot
CREATE TABLE room_available_date_slot (
    room_id BIGINT NOT NULL,
    start_at DATE NOT NULL,
    PRIMARY KEY (room_id, start_at),
    CONSTRAINT FK_room_date_slot_room_id
        FOREIGN KEY (room_id) REFERENCES room (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Room Available Time Slot
CREATE TABLE room_available_time_slot (
    room_id BIGINT NOT NULL,
    start_at TIME(6) NOT NULL,
    PRIMARY KEY (room_id, start_at),
    CONSTRAINT FK_room_time_slot_room_id
        FOREIGN KEY (room_id) REFERENCES room (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vote
CREATE TABLE vote (
    date_time_slot DATETIME(6) NOT NULL,
    participant_id BIGINT NOT NULL,
    PRIMARY KEY (date_time_slot, participant_id),
    CONSTRAINT FK_vote_participant_id
        FOREIGN KEY (participant_id) REFERENCES participant (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
