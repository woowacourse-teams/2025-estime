package com.estime.room.application.port;

import com.estime.room.domain.slot.vo.DateTimeSlot;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface RoomForTimePreferenceQuery {

    List<RoomBriefForTimePreference> findBriefs(LocalDate startDate, LocalDate endDate);

    List<VoteCountForTimePreference> findVoteCounts(Collection<Long> roomIds, LocalDate start, LocalDate end);

    record RoomBriefForTimePreference(Long roomId, String title) {
    }

    record VoteCountForTimePreference(LocalDateTime dateTime, long count) {
        public VoteCountForTimePreference(final DateTimeSlot slot, final long count) {
            this(slot.getStartAt(), count);
        }
    }
}
