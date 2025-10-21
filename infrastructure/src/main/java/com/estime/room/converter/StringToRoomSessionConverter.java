package com.estime.room.converter;

import com.estime.exception.InvalidRoomSessionFormatException;
import com.estime.room.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToRoomSessionConverter implements Converter<String, RoomSession> {

    @Override
    public RoomSession convert(final String source) {
        try {
            Tsid.decode(source, 32);
        } catch (final Exception e) {
            throw new InvalidRoomSessionFormatException(source);
        }

        return RoomSession.from(source);
    }
}
