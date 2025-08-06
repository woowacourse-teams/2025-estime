package com.estime.room.domain.vo;

import com.estime.room.infrastructure.RoomSessionGenerator;
import com.github.f4b6a3.tsid.Tsid;
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

    private final Tsid tsid;

    public static RoomSession from(final Tsid tsid) {
        validate(tsid);
        return new RoomSession(tsid);
    }

    public static RoomSession generate() {
        final Tsid tsid = RoomSessionGenerator.generateTsid();
        return new RoomSession(tsid);
    }

    private static void validate(final Tsid tsid) {
        Objects.requireNonNull(tsid, "tsid cannot be null");
    }
}
