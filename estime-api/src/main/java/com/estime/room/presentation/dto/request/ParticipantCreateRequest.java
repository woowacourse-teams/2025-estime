package com.estime.room.presentation.dto.request;

import com.estime.room.application.dto.input.ParticipantCreateInput;

public record ParticipantCreateRequest(
        String name,
        String password
) {

    public ParticipantCreateInput toInput(final String roomSession) {
        return new ParticipantCreateInput(roomSession, name, password);
    }
}
