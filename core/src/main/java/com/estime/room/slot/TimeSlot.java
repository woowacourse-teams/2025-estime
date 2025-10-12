package com.estime.room.slot;

import com.estime.room.Room;
import com.estime.room.slot.exception.InvalidTimeDetailException;
import com.estime.room.slot.exception.SlotNotDivideException;
import com.estime.shared.BaseEntity;
import com.estime.shared.DomainTerm;
import com.estime.shared.Validator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Duration;
import java.time.LocalTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "room_available_time_slot")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString(exclude = "room")
@EqualsAndHashCode(callSuper = true, of = {})
public class TimeSlot extends BaseEntity implements Comparable<TimeSlot> {

    public static final Duration UNIT = Duration.ofMinutes(30);

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "start_at", nullable = false)
    private LocalTime startAt;

    public static TimeSlot of(final Room room, final LocalTime startAt) {
        validateNull(room, startAt);
        validateStartAt(startAt);
        return new TimeSlot(room, startAt);
    }

    private static void validateNull(final Room room, final LocalTime startAt) {
        Validator.builder()
                .add("room", room)
                .add("startAt", startAt)
                .validateNull();
    }

    private static void validateStartAt(final LocalTime startAt) {
        if (startAt.getSecond() != 0 || startAt.getNano() != 0) {
            throw new InvalidTimeDetailException(DomainTerm.TIME_SLOT, startAt);
        }

        final long seconds = startAt.toSecondOfDay();
        if (seconds % UNIT.getSeconds() != 0) {
            throw new SlotNotDivideException(DomainTerm.TIME_SLOT, UNIT.toMinutes());
        }
    }

    @Override
    public int compareTo(final TimeSlot other) {
        return this.startAt.compareTo(other.startAt);
    }
}
