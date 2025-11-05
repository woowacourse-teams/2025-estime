package com.estime.room.slot.converter;

import com.estime.room.slot.CompactDateTimeSlot;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CompactDateTimeSlotConverter implements AttributeConverter<CompactDateTimeSlot, Integer> {

    @Override
    public Integer convertToDatabaseColumn(final CompactDateTimeSlot compactSlot) {
        return (compactSlot != null) ? compactSlot.getEncoded() : null;
    }

    @Override
    public CompactDateTimeSlot convertToEntityAttribute(final Integer encoded) {
        return (encoded != null) ? CompactDateTimeSlot.from(encoded) : null;
    }
}
