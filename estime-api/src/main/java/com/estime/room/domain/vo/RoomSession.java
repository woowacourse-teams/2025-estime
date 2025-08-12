package com.estime.room.domain.vo;

import com.estime.common.util.Validator;
import com.github.f4b6a3.tsid.Tsid;
import com.github.f4b6a3.tsid.TsidCreator;
import java.io.Serializable;
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
        validateNull(roomSession);
        return new RoomSession(roomSession);
    }

    public static RoomSession generate() {
        return new RoomSession(TsidCreator.getTsid());
    }

    private static void validateNull(final Tsid roomSession) {
        Validator.builder()
                .add("roomSession", roomSession)
                .validateNull();
    }

    @Override
    public String toString() {
        return roomSession.toString();
    }
}
