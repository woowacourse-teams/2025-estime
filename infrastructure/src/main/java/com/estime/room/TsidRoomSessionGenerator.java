package com.estime.room;

import com.estime.port.out.RoomSessionGenerator;
import com.github.f4b6a3.tsid.TsidCreator;
import org.springframework.stereotype.Component;

@Component
public class TsidRoomSessionGenerator implements RoomSessionGenerator {

    @Override
    public String generate() {
        return TsidCreator.getTsid().toString();
    }
}
