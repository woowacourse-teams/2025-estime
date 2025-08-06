package com.estime.room.domain.vo;

import com.estime.room.infrastructure.RoomSessionGenerator;
import com.github.f4b6a3.tsid.Tsid;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
public class RoomSession implements Serializable {

    private final Tsid tsid;

    public RoomSession(final Tsid tsid) {
        Objects.requireNonNull(tsid, "tsid cannot be null");
        this.tsid = tsid;
    }

    public static RoomSession of(final String tsid) {
        validate(tsid);
        return new RoomSession(Tsid.from(tsid));
    }

    public static RoomSession generate() {
        final Tsid tsid = RoomSessionGenerator.generateTsid();
        validate(tsid.toString());
        return new RoomSession(tsid);
    }

    private static void validate(final String tsid) {
        validateLength(tsid);
        validateASCII(tsid);
    }

    private static void validateLength(final String tsid) {
        if (tsid.length() != 13) {
            throw new IllegalArgumentException("session id must be exactly 13 characters.");
        }
    }

    private static void validateASCII(final String tsid) {
        if (!StandardCharsets.US_ASCII.newEncoder().canEncode(tsid)) {
            throw new IllegalArgumentException("session id must be ASCII characters only.");
        }
    }
}
