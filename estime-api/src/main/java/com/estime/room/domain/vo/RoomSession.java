package com.estime.room.domain.vo;

import com.estime.room.infrastructure.RoomSessionGenerator;
import com.github.f4b6a3.tsid.Tsid;
import java.io.Serializable;
import java.util.Objects;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
public class RoomSession implements Serializable {

    private final Tsid tsid;

    private RoomSession(final Tsid tsid) {
        Objects.requireNonNull(tsid, "tsid cannot be null");
        this.tsid = tsid;
    }

    public static RoomSession from(final Tsid tsid) {
        return new RoomSession(tsid);
    }

    public static RoomSession generate() {
        final Tsid tsid = RoomSessionGenerator.generateTsid();
        return new RoomSession(tsid);
    }
}
