package com.estime.room.slot;

import com.estime.room.Room;
import com.estime.shared.BaseEntity;
import com.estime.shared.Validator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "start_at", nullable = false)
    private LocalDate startAt;

    public static DateSlot of(final Room room, final LocalDate startAt) {
        validateNull(room, startAt);
        return new DateSlot(room, startAt);
    }

    private static void validateNull(final Room room, final LocalDate startAt) {
        Validator.builder()
                .add("room", room)
                .add("startAt", startAt)
                .validateNull();
    }

    @Override
    public int compareTo(final DateSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
