package com.estime.room.presentation.dto.request;

import com.estime.room.application.dto.input.VotesUpdateInput;
import java.time.LocalDateTime;
import java.util.List;

public record VotesUpdateRequest(
        String name,
        List<LocalDateTime> dateTimes
) {

    public VotesUpdateInput toInput(final String roomSession) {
        return new VotesUpdateInput(roomSession, name, dateTimes);
    }
}
