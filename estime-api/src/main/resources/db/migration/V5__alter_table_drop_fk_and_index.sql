-- 물리적 외래키 삭제
ALTER TABLE participant
    DROP FOREIGN KEY FK_participant_room_id;
ALTER TABLE room_available_date_slot
    DROP FOREIGN KEY FK_room_date_slot_room_id;
ALTER TABLE room_available_time_slot
    DROP FOREIGN KEY FK_room_time_slot_room_id;
ALTER TABLE vote
    DROP FOREIGN KEY FK_vote_participant_id;

-- 자동 생성 인덱스 삭제
ALTER TABLE vote
    DROP INDEX FK_vote_participant_id;
ALTER TABLE participant
    DROP INDEX FK_participant_room_id;