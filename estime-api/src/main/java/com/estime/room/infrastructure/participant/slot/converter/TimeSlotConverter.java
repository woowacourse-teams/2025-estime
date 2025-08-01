package com.estime.room.infrastructure.participant.slot.converter;

import com.estime.datetimeslot.TimeSlot;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalTime;

@Converter(autoApply = true)
public class TimeSlotConverter implements AttributeConverter<TimeSlot, LocalTime> {

    @Override
    public LocalTime convertToDatabaseColumn(final TimeSlot timeSlot) {
        return timeSlot == null ? null : timeSlot.getStartAt();
    }

    @Override
    public TimeSlot convertToEntityAttribute(final LocalTime time) {
        return time == null ? null : TimeSlot.from(time);
    }
}
