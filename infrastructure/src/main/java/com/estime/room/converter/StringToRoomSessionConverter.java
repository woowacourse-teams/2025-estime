package com.estime.room.converter;

import com.estime.room.RoomSession;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToRoomSessionConverter implements Converter<String, RoomSession> {

    @Override
    public RoomSession convert(final String source) {
        return RoomSession.from(source);
    }
}
