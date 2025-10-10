package com.estime.room.slot.converter;

import com.estime.room.slot.DateTimeSlot;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.sql.Timestamp;

@Converter(autoApply = true)
public class DateTimeSlotConverter implements AttributeConverter<DateTimeSlot, Timestamp> {

    @Override
    public Timestamp convertToDatabaseColumn(final DateTimeSlot dateTimeSlot) {
        return (dateTimeSlot != null) ? Timestamp.valueOf(dateTimeSlot.getStartAt()) : null;
    }

    @Override
    public DateTimeSlot convertToEntityAttribute(final Timestamp dateTime) {
        return (dateTime != null) ? DateTimeSlot.from(dateTime.toLocalDateTime()) : null;
    }
}
