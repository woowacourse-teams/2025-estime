package com.estime.room.infrastructure;

import com.estime.room.SlotBatchRepository;
import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableTimeSlot;
import java.sql.Time;
import java.util.Collection;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class JdbcSlotBatchRepository implements SlotBatchRepository {

    private static final int BATCH_SIZE = 50;
    private static final String INSERT_DATE_SLOT_SQL = "INSERT INTO available_date_slot (room_id, start_at) VALUES (?, ?)";
    private static final String INSERT_TIME_SLOT_SQL = "INSERT INTO available_time_slot (room_id, start_at) VALUES (?, ?)";

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void batchInsertSlots(final Collection<AvailableDateSlot> availableDateSlots,
                                 final Collection<AvailableTimeSlot> availableTimeSlots) {
        batchInsertDateSlots(availableDateSlots);
        batchInsertTimeSlots(availableTimeSlots);
    }

    private void batchInsertDateSlots(final Collection<AvailableDateSlot> availableDateSlots) {
        jdbcTemplate.batchUpdate(
                INSERT_DATE_SLOT_SQL,
                availableDateSlots,
                BATCH_SIZE,
                (ps, slot) -> {
                    ps.setLong(1, slot.getRoomId());
                    ps.setObject(2, slot.getStartAt());
                }
        );
    }

    private void batchInsertTimeSlots(final Collection<AvailableTimeSlot> availableTimeSlots) {
        jdbcTemplate.batchUpdate(
                INSERT_TIME_SLOT_SQL,
                availableTimeSlots,
                BATCH_SIZE,
                (ps, slot) -> {
                    ps.setLong(1, slot.getRoomId());
                    ps.setTime(2, Time.valueOf(slot.getStartAt()));
                }
        );
    }
}
