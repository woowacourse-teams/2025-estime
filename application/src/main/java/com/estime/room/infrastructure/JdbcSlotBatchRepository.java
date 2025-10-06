package com.estime.room.infrastructure;

import com.estime.room.SlotBatchRepository;
import com.estime.room.slot.DateSlot;
import com.estime.room.slot.TimeSlot;
import java.sql.Time;
import java.util.Collection;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class JdbcSlotBatchRepository implements SlotBatchRepository {

    private static final int BATCH_SIZE = 50;
    private static final String INSERT_DATE_SLOT_SQL = "INSERT INTO room_available_date_slot (room_id, start_at) VALUES (?, ?)";
    private static final String INSERT_TIME_SLOT_SQL = "INSERT INTO room_available_time_slot (room_id, start_at) VALUES (?, ?)";

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void batchInsertSlots(final Long roomId, final Collection<DateSlot> dateSlots, final Collection<TimeSlot> timeSlots) {
        batchInsertDateSlots(roomId, dateSlots);
        batchInsertTimeSlots(roomId, timeSlots);
    }

    private void batchInsertDateSlots(final Long roomId, final Collection<DateSlot> dateSlots) {
        jdbcTemplate.batchUpdate(
                INSERT_DATE_SLOT_SQL,
                dateSlots,
                BATCH_SIZE,
                (ps, slot) -> {
                    ps.setLong(1, roomId);
                    ps.setObject(2, slot.getStartAt());
                }
        );
    }

    private void batchInsertTimeSlots(final Long roomId, final Collection<TimeSlot> timeSlots) {
        jdbcTemplate.batchUpdate(
                INSERT_TIME_SLOT_SQL,
                timeSlots,
                BATCH_SIZE,
                (ps, slot) -> {
                    ps.setLong(1, roomId);
                    ps.setTime(2, Time.valueOf(slot.getStartAt()));
                }
        );
    }
}
