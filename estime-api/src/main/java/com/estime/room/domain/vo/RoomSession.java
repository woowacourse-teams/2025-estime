package com.estime.room.domain.vo;

import com.github.f4b6a3.tsid.Tsid;
import com.github.f4b6a3.tsid.TsidCreator;
import java.io.Serializable;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@EqualsAndHashCode
public class RoomSession implements Serializable {

    private final Tsid roomSession;

    public static RoomSession from(final Tsid roomSession) {
        validate(roomSession);
        return new RoomSession(roomSession);
    }

    public static RoomSession generate() {
        return new RoomSession(TsidCreator.getTsid());
    }

    private static void validate(final Tsid roomSession) {
        Objects.requireNonNull(roomSession, "session cannot be null");
    }

    @Override
    public String toString() {
        return roomSession.toString();
    }
}
