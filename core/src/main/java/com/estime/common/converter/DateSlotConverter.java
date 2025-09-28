package com.estime.common.converter;

import com.estime.room.timeslot.DateSlot;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalDate;

@Converter(autoApply = true)
public class DateSlotConverter implements AttributeConverter<DateSlot, LocalDate> {

    @Override
    public LocalDate convertToDatabaseColumn(final DateSlot dateSlot) {
        return dateSlot == null ? null : dateSlot.getStartAt();
    }

    @Override
    public DateSlot convertToEntityAttribute(final LocalDate date) {
        return date == null ? null : DateSlot.from(date);
    }
}
