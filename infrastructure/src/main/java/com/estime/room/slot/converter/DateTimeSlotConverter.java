package com.estime.room.slot.converter;

import com.estime.room.slot.DateTimeSlot;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DateTimeSlotConverter implements AttributeConverter<DateTimeSlot, Integer> {

    @Override
    public Integer convertToDatabaseColumn(final DateTimeSlot dateTimeSlot) {
        return (dateTimeSlot != null) ? dateTimeSlot.getEncoded() : null;
    }

    @Override
    public DateTimeSlot convertToEntityAttribute(final Integer encoded) {
        return (encoded != null) ? DateTimeSlot.from(encoded) : null;
    }
}
