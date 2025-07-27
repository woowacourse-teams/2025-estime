package com.bether.bether.room.infrastructure;

import com.github.f4b6a3.tsid.TsidCreator;

public class RoomSessionGenerator {

    public static String generateTsid() {
        return TsidCreator.getTsid().toString();
    }
}
