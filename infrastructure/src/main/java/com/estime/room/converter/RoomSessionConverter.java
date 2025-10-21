package com.estime.room.converter;

import com.estime.room.RoomSession;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoomSessionConverter implements AttributeConverter<RoomSession, String> {

    @Override
    public String convertToDatabaseColumn(final RoomSession session) {
        return session == null ? null : session.getValue();
    }

    @Override
    public RoomSession convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : RoomSession.from(dbData);
    }
}
