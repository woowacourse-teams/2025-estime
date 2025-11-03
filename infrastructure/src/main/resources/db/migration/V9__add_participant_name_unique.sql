ALTER TABLE participant
    ADD CONSTRAINT uk_participant_room_id_name UNIQUE (room_id, name);
