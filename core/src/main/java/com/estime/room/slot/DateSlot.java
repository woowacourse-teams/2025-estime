package com.estime.room.slot;

import com.estime.shared.BaseEntity;
import com.estime.shared.Validator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "room_available_date_slot")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class DateSlot extends BaseEntity implements Comparable<DateSlot> {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "start_at", nullable = false)
    private LocalDate startAt;

    public static DateSlot of(final Long roomId, final LocalDate startAt) {
        validateNull(roomId, startAt);
        return new DateSlot(roomId, startAt);
    }

    private static void validateNull(final Long roomId, final LocalDate startAt) {
        Validator.builder()
                .add("roomId", roomId)
                .add("startAt", startAt)
                .validateNull();
    }

    @Override
    public int compareTo(final DateSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
