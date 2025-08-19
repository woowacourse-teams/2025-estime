package com.estime.room.domain;

import com.estime.common.BaseEntity;
import com.estime.common.DomainTerm;
import com.estime.common.exception.domain.DeadlineOverdueException;
import com.estime.common.exception.domain.PastNotAllowedException;
import com.estime.common.exception.domain.UnavailableSlotException;
import com.estime.common.util.Validator;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import com.estime.room.domain.vo.RoomSession;
import com.estime.room.infrastructure.converter.DateSlotConverter;
import com.estime.room.infrastructure.converter.DateTimeSlotConverter;
import com.estime.room.infrastructure.converter.RoomSessionConverter;
import com.estime.room.infrastructure.converter.TimeSlotConverter;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class Room extends BaseEntity {

    @Column(name = "session", nullable = false)
    @Convert(converter = RoomSessionConverter.class)
    private RoomSession session;

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
        validateNull(title, availableDateSlots, availableTimeSlots, deadline);
        validateDeadline(deadline);
        return new Room(
                RoomSession.generate(),
                title,
                Set.copyOf(availableDateSlots),
                Set.copyOf(availableTimeSlots),
                deadline
        );
    }

    private static void validateNull(
            final String title,
            final List<DateSlot> availableDateSlots,
            final List<TimeSlot> availableTimeSlots,
            final DateTimeSlot deadline
    ) {
        Validator.builder()
                .add(Fields.title, title)
                .add(Fields.availableDateSlots, availableDateSlots)
                .add(Fields.availableTimeSlots, availableTimeSlots)
                .add(Fields.deadline, deadline)
                .validateNull();
    }

    private static void validateDeadline(final DateTimeSlot deadline) {
        if (deadline.isBefore(LocalDateTime.now())) {
            throw new PastNotAllowedException(DomainTerm.DEADLINE, deadline);
        }
    }

    public void ensureAvailableDateTimeSlots(final List<DateTimeSlot> dateTimeSlots) {
        for (final DateTimeSlot dateTimeSlot : dateTimeSlots) {
            final DateSlot dateSlot = dateTimeSlot.toDateSlot();
            final TimeSlot timeSlot = dateTimeSlot.toTimeSlot();
            if (!availableDateSlots.contains(dateSlot) || !availableTimeSlots.contains(timeSlot)) {
                throw new UnavailableSlotException(DomainTerm.DATE_TIME_SLOT, session, dateTimeSlot);
            }
        }
    }

    public void ensureDeadlineNotPassed(final LocalDateTime currentDateTime) {
        if (deadline.isBefore(currentDateTime)) {
            throw new DeadlineOverdueException(session, deadline, currentDateTime);
        }
    }
}
