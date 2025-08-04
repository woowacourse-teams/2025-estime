package com.estime.room.infrastructure.participant.slot.converter;

import com.estime.room.domain.participant.vote.vo.DateTimeSlot;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalDateTime;

@Converter(autoApply = true)
public class DateTimeSlotConverter implements AttributeConverter<DateTimeSlot, LocalDateTime> {

    @Override
    public LocalDateTime convertToDatabaseColumn(final DateTimeSlot dateTimeSlot) {
        return dateTimeSlot == null ? null : dateTimeSlot.getStartAt();
    }

    @Override
    public DateTimeSlot convertToEntityAttribute(final LocalDateTime dateTime) {
        return dateTime == null ? null : DateTimeSlot.from(dateTime);
    }
}
