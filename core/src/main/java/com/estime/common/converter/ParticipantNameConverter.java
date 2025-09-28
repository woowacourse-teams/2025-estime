package com.estime.common.converter;

import com.estime.room.participant.ParticipantName;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ParticipantNameConverter implements AttributeConverter<ParticipantName, String> {

    @Override
    public String convertToDatabaseColumn(final ParticipantName name) {
        return name == null ? null : name.getValue();
    }

    @Override
    public ParticipantName convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : ParticipantName.from(dbData);
    }
}
