package com.estime.room.domain;

import com.estime.common.BaseEntity;
import com.estime.room.domain.vo.DateSlot;
import com.estime.room.domain.vo.DateTimeSlot;
import com.estime.room.domain.vo.TimeSlot;
import com.estime.room.infrastructure.RoomSessionGenerator;
import com.estime.room.infrastructure.converter.DateSlotConverter;
import com.estime.room.infrastructure.converter.DateTimeSlotConverter;
import com.estime.room.infrastructure.converter.TimeSlotConverter;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
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
    private Set<DateSlot> availableDateSlots;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "room_available_time_slot",
            joinColumns = @JoinColumn(name = "room_id")
    )
    @Column(name = "start_at", nullable = false)
    @Convert(converter = TimeSlotConverter.class)
    private Set<TimeSlot> availableTimeSlots;

    @Column(name = "deadline", nullable = false)
    @Convert(converter = DateTimeSlotConverter.class)
    private DateTimeSlot deadline;

    public static Room withoutId(
            final String title,
            final List<DateSlot> availableDateSlots,
            final List<TimeSlot> availableTimeSlots,
            final DateTimeSlot deadline
    ) {
        validateNonNull(title, availableDateSlots, availableTimeSlots, deadline);
        validateDeadline(deadline);
        return new Room(
                RoomSessionGenerator.generateTsid(),
                title,
                Set.copyOf(availableDateSlots),
                Set.copyOf(availableTimeSlots),
                deadline
        );
    }

    private static void validateNonNull(
            final String title,
            final Collection<DateSlot> availableDateSlots,
            final Collection<TimeSlot> availableTimeSlots,
            final DateTimeSlot deadline
    ) {
        Objects.requireNonNull(title, "title cannot be null");
        Objects.requireNonNull(availableDateSlots, "availableDateSlots cannot be null");
        Objects.requireNonNull(availableTimeSlots, "availableTimeSlots cannot be null");
        Objects.requireNonNull(deadline, "deadline cannot be null");
    }

    private static void validateDeadline(final DateTimeSlot deadline) {
        if (deadline.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("deadline cannot be in the past");
        }
    }
}
