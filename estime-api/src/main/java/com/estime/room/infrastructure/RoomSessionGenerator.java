package com.estime.room.infrastructure;

import com.github.f4b6a3.tsid.Tsid;
import com.github.f4b6a3.tsid.TsidCreator;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RoomSessionGenerator {

    public static Tsid generateTsid() {
        return TsidCreator.getTsid();
    }
}
