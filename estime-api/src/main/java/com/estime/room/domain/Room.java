package com.estime.room.domain;

import com.estime.common.BaseEntity;
import com.estime.datetimeslot.DateSlot;
import com.estime.datetimeslot.DateTimeSlot;
import com.estime.datetimeslot.TimeSlot;
import com.estime.room.infrastructure.participant.slot.converter.DateSlotConverter;
import com.estime.room.infrastructure.participant.slot.converter.DateTimeSlotConverter;
import com.estime.room.infrastructure.participant.slot.converter.TimeSlotConverter;
import com.estime.room.infrastructure.RoomSessionGenerator;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class Room extends BaseEntity {

    @Column(name = "session", nullable = false, length = 13, columnDefinition = "CHAR(13) CHARACTER SET ascii")
    private String session;

    @Column(name = "title", nullable = false)
    private String title;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "room_available_date_slot",
            joinColumns = @JoinColumn(name = "room_id")
    )
    @Column(name = "start_at", nullable = false)
    @Convert(converter = DateSlotConverter.class)
    private Set<DateSlot> availableDateSlots = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "room_available_time_slot",
            joinColumns = @JoinColumn(name = "room_id")
    )
    @Column(name = "start_at", nullable = false)
    @Convert(converter = TimeSlotConverter.class)
    private Set<TimeSlot> availableTimeSlots = new HashSet<>();

    @Column(name = "dead_line", nullable = false)
    @Convert(converter = DateTimeSlotConverter.class)
    private DateTimeSlot deadLine;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    public static Room withoutId(
            final String title,
            final Collection<DateSlot> availableDateSlots,
            final Collection<TimeSlot> availableTimeSlots,
            final DateTimeSlot deadLine,
            final Boolean isPublic
    ) {
        validateNonNull(title, availableDateSlots, availableTimeSlots, deadLine, isPublic);
        final String session = RoomSessionGenerator.generateTsid();
        return new Room(
                session,
                title,
                (Set<DateSlot>) availableDateSlots,
                (Set<TimeSlot>) availableTimeSlots,
                deadLine,
                isPublic
        );
    }

    private static void validateNonNull(
            final String title,
            final Collection<DateSlot> availableDateSlots,
            final Collection<TimeSlot> availableTimeSlots,
            final DateTimeSlot deadLine,
            final Boolean isPublic
    ) {
        Objects.requireNonNull(title, "title cannot be null");
        Objects.requireNonNull(availableDateSlots, "availableDateSlots cannot be null");
        Objects.requireNonNull(availableTimeSlots, "availableTimeSlots cannot be null");
        Objects.requireNonNull(deadLine, "deadLine cannot be null");
        Objects.requireNonNull(isPublic, "isPublic cannot be null");
    }

    //TODO 도메인 서비스로 이동
//    private static void validateDates(final Collection<DateSlot> dateSlots) {
//        if (dateSlots.isEmpty()) {
//            throw new IllegalArgumentException("availableDates cannot be empty");
//        }
//        for (final DateSlot dateSlot : dateSlots) {
//            if (dateSlot.isBefore(LocalDate.now())) {
//                throw new IllegalArgumentException(
//                        "availableDates cannot contain past dates: " + dateSlot.getStartAt());
//            }
//        }
//    }

    //TODO 도메인 서비스로 이동
//    private static void validateDeadLine(final LocalDateTime deadLine) {
//        if (deadLine.isBefore(LocalDateTime.now())) {
//            throw new IllegalArgumentException("The deadline cannot be in the past.");
//        }
//        if (deadLine.getMinute() != 0 && deadLine.getMinute() != 30) {
//            throw new IllegalArgumentException("The deadline must be set in 30-minute intervals.");
//        }
//    }
}
