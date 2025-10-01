create index idx_room_session on room (session);
create index idx_room_deadline on room (deadline);
create index idx_participant_room_id on participant (room_id);
ALTER TABLE vote
    DROP PRIMARY KEY,
    ADD PRIMARY KEY (participant_id, date_time_slot);
