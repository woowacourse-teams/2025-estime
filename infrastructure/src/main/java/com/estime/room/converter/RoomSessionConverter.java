package com.estime.room.converter;

import com.estime.room.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Converter(autoApply = true)
public class RoomSessionConverter implements AttributeConverter<RoomSession, String> {

    @Override
    public String convertToDatabaseColumn(final RoomSession session) {
        if (session == null) {
            return null;
        }

        final Tsid value = session.getValue();
        if (value == null) {
            log.error("RoomSession's internal value(Tsid) is null! RoomSession Object: {}", session);
            return null;
        }

        return value.toString();
    }

    @Override
    public RoomSession convertToEntityAttribute(final String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return RoomSession.from(Tsid.from(dbData));
        } catch (Exception e) {
            log.error("Failed to convert String '{}' to RoomSession.", dbData, e);
            throw e;
        }
    }
}
