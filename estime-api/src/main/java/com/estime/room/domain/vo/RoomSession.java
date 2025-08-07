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

    private final Tsid session;

    public static RoomSession from(final Tsid session) {
        validate(session);
        return new RoomSession(session);
    }

    public static RoomSession generate() {
        return new RoomSession(TsidCreator.getTsid());
    }

    private static void validate(final Tsid session) {
        Objects.requireNonNull(session, "session cannot be null");
    }

    @Override
    public String toString() {
        return session.toString();
    }
}
