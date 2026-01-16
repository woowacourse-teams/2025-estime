package com.estime.room.slot;

import com.estime.room.Room;
import com.estime.shared.Validator;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;

@Entity
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = "room")
@EqualsAndHashCode(of = "id")
@FieldNameConstants
public class RoomAvailableSlot implements Comparable<RoomAvailableSlot> {

    @EmbeddedId
    private RoomAvailableSlotId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId(RoomAvailableSlotId.Fields.roomId)
    @JoinColumn(name = "room_id")
    private Room room;

    public static RoomAvailableSlot of(
            final CompactDateTimeSlot slotCode,
            final Room room
    ) {
        validateNull(slotCode, room);
        return new RoomAvailableSlot(RoomAvailableSlotId.of(slotCode), room);
    }

    private static void validateNull(
            final CompactDateTimeSlot slotCode,
            final Room room
    ) {
        Validator.builder()
                .add(RoomAvailableSlotId.Fields.slotCode, slotCode)
                .add(RoomAvailableSlot.Fields.room, room)
                .validateNull();
    }

    public CompactDateTimeSlot getSlotCode() {
        return id.getSlotCode();
    }

    public LocalDateTime getStartAt() {
        final CompactDateTimeSlot slotCode = id.getSlotCode();
        return LocalDateTime.of(slotCode.getStartAtLocalDate(), slotCode.getStartAtLocalTime());
    }

    @Override
    public int compareTo(final RoomAvailableSlot other) {
        return this.getSlotCode().compareTo(other.getSlotCode());
    }
}
