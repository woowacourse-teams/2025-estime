DELIMITER //

DROP FUNCTION IF EXISTS TSID;
DROP PROCEDURE IF EXISTS GenerateScenarioData;

CREATE FUNCTION TSID()
    RETURNS VARCHAR(13)
        CHARSET utf8mb4
    NOT DETERMINISTIC
BEGIN
    -- 변수 선언
    DECLARE v_tsid_num BIGINT UNSIGNED;
    DECLARE v_timestamp_ms BIGINT UNSIGNED;
    DECLARE v_random_bits INT UNSIGNED;

    DECLARE v_alphabet VARCHAR(32) DEFAULT '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    DECLARE v_result VARCHAR(13) DEFAULT '';
    DECLARE v_remainder INT;

    -- 1. 64비트 TSID 숫자 생성
    -- 42비트: 현재 시간을 밀리초 단위로 변환
    SET v_timestamp_ms = FLOOR(UNIX_TIMESTAMP(NOW(3)) * 1000);
    -- 22비트: 0 ~ 4,194,303 사이의 랜덤 숫자 생성 (2^22 - 1)
    SET v_random_bits = FLOOR(RAND() * 4194304);

    -- 타임스탬프를 왼쪽으로 22비트 옮기고, 랜덤 비트를 OR 연산으로 결합
    SET v_tsid_num = (v_timestamp_ms << 22) | v_random_bits;

    -- 2. Base32 인코딩 (13자리로 변환)
    WHILE LENGTH(v_result) < 13
        DO
            SET v_remainder = v_tsid_num MOD 32;
            SET v_result = CONCAT(SUBSTRING(v_alphabet, v_remainder + 1, 1), v_result);
            SET v_tsid_num = FLOOR(v_tsid_num / 32);
        END WHILE;

    RETURN v_result;
END //

CREATE PROCEDURE GenerateScenarioData()
BEGIN
    -- 변수 선언
    DECLARE v_room_counter INT DEFAULT 1;
    DECLARE v_total_rooms INT DEFAULT 3000;
    DECLARE v_room_id BIGINT;
    DECLARE v_num_participants INT;
    DECLARE v_participant_counter INT;
    DECLARE v_num_dates INT;
    DECLARE v_num_times INT;
    DECLARE v_vote_probability FLOAT;
    DECLARE v_scenario VARCHAR(20);
    DECLARE v_start_date DATE;
    DECLARE v_session VARCHAR(13);

    -- 성능 최적화 설정
    SET FOREIGN_KEY_CHECKS = 0;
    SET UNIQUE_CHECKS = 0;
    SET SESSION cte_max_recursion_depth = 5000;
    SET SQL_LOG_BIN = 0;
    START TRANSACTION;

    -- 데이터 삭제
    DELETE FROM vote;
    DELETE FROM room_available_time_slot;
    DELETE FROM room_available_date_slot;
    DELETE FROM platform;
    DELETE FROM participant;
    ALTER TABLE participant
        AUTO_INCREMENT = 1;
    DELETE FROM room;
    ALTER TABLE room
        AUTO_INCREMENT = 1;

    -- 방(Room) 생성 메인 루프
    WHILE v_room_counter <= v_total_rooms
        DO

            -- 시나리오 결정
            IF v_room_counter <= (v_total_rooms * 0.15) THEN
                SET v_scenario = '활발한 방'; SET v_num_participants = FLOOR(8 + RAND() * 3);
                SET v_num_dates = FLOOR(5 + RAND() * 3); SET v_num_times = FLOOR(32 + RAND() * 17);
                SET v_vote_probability = 0.7;
            ELSEIF v_room_counter <= (v_total_rooms * 0.55) THEN
                SET v_scenario = '일반적인 방'; SET v_num_participants = FLOOR(5 + RAND() * 4);
                SET v_num_dates = FLOOR(3 + RAND() * 3); SET v_num_times = FLOOR(16 + RAND() * 17);
                SET v_vote_probability = 0.4;
            ELSEIF v_room_counter <= (v_total_rooms * 0.90) THEN
                SET v_scenario = '저조한 방'; SET v_num_participants = FLOOR(2 + RAND() * 4);
                SET v_num_dates = FLOOR(2 + RAND() * 4); SET v_num_times = FLOOR(8 + RAND() * 17);
                SET v_vote_probability = 0.15;
            ELSE
                SET v_scenario = '막 생성된 방'; SET v_num_participants = FLOOR(3 + RAND() * 4);
                SET v_num_dates = FLOOR(4 + RAND() * 4); SET v_num_times = FLOOR(16 + RAND() * 17);
                SET v_vote_probability = 0.0;
            END IF;

            -- Session 생성 및 Room 삽입
            SET v_session = TSID();
            INSERT INTO room (deadline, session, title)
            VALUES (DATE_ADD('2027-01-01', INTERVAL FLOOR(RAND() * 30) DAY),
                    v_session,
                    CONCAT(v_scenario, ' #', v_room_counter));
            SET v_room_id = LAST_INSERT_ID();

            -- Participant 데이터 삽입
            SET v_participant_counter = 1;
            WHILE v_participant_counter <= v_num_participants
                DO
                    INSERT INTO participant (name, room_id) VALUES (CONCAT('참가자', v_participant_counter), v_room_id);
                    SET v_participant_counter = v_participant_counter + 1;
                END WHILE;

            -- 날짜/시간 슬롯 및 투표 데이터 생성
            CREATE TEMPORARY TABLE temp_dates
            (
                gen_date DATE
            );
            CREATE TEMPORARY TABLE temp_times
            (
                gen_time TIME
            );
            SET v_start_date = DATE_ADD('2026-01-01', INTERVAL FLOOR(RAND() * 10) DAY);
            INSERT INTO temp_dates (gen_date)
            WITH RECURSIVE DateSeries AS (SELECT 0 AS offset
                                          UNION ALL
                                          SELECT offset + 1
                                          FROM DateSeries
                                          WHERE offset + 1 < v_num_dates)
            SELECT DATE_ADD(v_start_date, INTERVAL offset DAY)
            FROM DateSeries;
            INSERT INTO temp_times (gen_time)
            WITH RECURSIVE TimeSeries AS (SELECT 0 AS offset
                                          UNION ALL
                                          SELECT offset + 1
                                          FROM TimeSeries
                                          WHERE offset + 1 < v_num_times)
            SELECT SEC_TO_TIME(offset * 1800)
            FROM TimeSeries;
            INSERT INTO room_available_date_slot (room_id, start_at) SELECT v_room_id, gen_date FROM temp_dates;
            INSERT INTO room_available_time_slot (room_id, start_at) SELECT v_room_id, gen_time FROM temp_times;

            IF v_vote_probability > 0 THEN
                INSERT INTO vote (participant_id, date_time_slot)
                SELECT p.id, TIMESTAMP(td.gen_date, tt.gen_time)
                FROM participant p
                         CROSS JOIN temp_dates td
                         CROSS JOIN temp_times tt
                WHERE p.room_id = v_room_id
                  AND RAND() < v_vote_probability;
            END IF;

            DROP TEMPORARY TABLE temp_dates;
            DROP TEMPORARY TABLE temp_times;

            SET v_room_counter = v_room_counter + 1;
        END WHILE;

    -- 작업 완료 및 설정 복구
    COMMIT;
    SET FOREIGN_KEY_CHECKS = 1;
    SET UNIQUE_CHECKS = 1;
    SET SQL_LOG_BIN = 1;

END //

DELIMITER ;

-- 1800000 밀리초 = 1800초 = 30분
SET SESSION max_execution_time = 1800000;
SET GLOBAL log_bin_trust_function_creators = 1;
drop table if exists temp_times;
drop table if exists temp_dates;

-- 프로시저 호출
call GenerateScenarioData();

-- 프로시저 실행 완료 후, 기존 설정으로 복구
SET GLOBAL log_bin_trust_function_creators = 0;

SELECT 'room' AS table_name, COUNT(*) AS row_count
FROM room
UNION ALL
SELECT 'participant' AS table_name, COUNT(*) AS row_count
FROM participant
UNION ALL
SELECT 'room_available_date_slot' AS table_name, COUNT(*) AS row_count
FROM room_available_date_slot
UNION ALL
SELECT 'room_available_time_slot' AS table_name, COUNT(*) AS row_count
FROM room_available_time_slot
UNION ALL
SELECT 'vote' AS table_name, COUNT(*) AS row_count
FROM vote
UNION ALL
SELECT 'platform' AS table_name, COUNT(*) AS row_count
FROM platform
ORDER BY row_count DESC;
