package com.estime.room.slot;

import com.estime.shared.Validator;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode
@ToString
@FieldNameConstants
public class RoomAvailableSlotId implements Serializable {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "slot", nullable = false)
    private DateTimeSlot slot;

    public static RoomAvailableSlotId of(final DateTimeSlot slot) {
        validateNull(slot);
        // roomId는 @MapsId에 의해 persist 시점에 채워짐
        return new RoomAvailableSlotId(null, slot);
    }

    private static void validateNull(final DateTimeSlot slot) {
        Validator.builder()
                .add(Fields.slot, slot)
                .validateNull();
    }
}
