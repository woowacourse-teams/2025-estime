package com.estime.room.infrastructure;

import com.github.f4b6a3.tsid.TsidCreator;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RoomSessionGenerator {

    public static String generateTsid() {
        return TsidCreator.getTsid().toString();
    }
}
