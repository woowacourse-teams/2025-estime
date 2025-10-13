package com.estime.room.slot;

import com.estime.shared.BaseEntity;
import com.estime.shared.Validator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(indexes = {
        @Index(name = "idx_available_date_slot_room_id", columnList = "room_id")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class AvailableDateSlot extends BaseEntity implements Comparable<AvailableDateSlot> {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "start_at", nullable = false)
    private LocalDate startAt;

    public static AvailableDateSlot of(final Long roomId, final LocalDate startAt) {
        validateNull(roomId, startAt);
        return new AvailableDateSlot(roomId, startAt);
    }

    private static void validateNull(final Long roomId, final LocalDate startAt) {
        Validator.builder()
                .add("roomId", roomId)
                .add("startAt", startAt)
                .validateNull();
    }

    @Override
    public int compareTo(final AvailableDateSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
