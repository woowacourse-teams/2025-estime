package com.estime.common.converter;

import com.estime.room.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoomSessionConverter implements AttributeConverter<RoomSession, String> {

    @Override
    public String convertToDatabaseColumn(final RoomSession session) {
        return session == null ? null : session.getValue().toString();
    }

    @Override
    public RoomSession convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : RoomSession.from(Tsid.from(dbData));
    }
}
