package com.estime.room;

import com.estime.shared.Validator;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@EqualsAndHashCode
public class RoomSession {

    private final String value;

    public static RoomSession from(final String roomSession) {
        validateNull(roomSession);
        return new RoomSession(roomSession);
    }

    private static void validateNull(final String roomSession) {
        Validator.builder()
                .add("roomSession", roomSession)
                .validateNull();
    }

    @Override
    public String toString() {
        return value;
    }
}
