package com.estime.room;

import com.estime.room.exception.DeadlineOverdueException;
import com.estime.room.exception.PastNotAllowedException;
import com.estime.shared.BaseEntity;
import com.estime.shared.DomainTerm;
import com.estime.shared.Validator;
import com.estime.shared.exception.InvalidLengthException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
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
@Table(indexes = {
        @Index(name = "idx_room_session", columnList = "session"),
        @Index(name = "idx_room_deadline", columnList = "deadline")
})
public class Room extends BaseEntity {

    private static final int TITLE_MAX_LENGTH = 20;

    @Column(name = "session", nullable = false)
    private RoomSession session;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    public static Room withoutId(
            final String title,
            final LocalDateTime deadline
    ) {
        validateTitleAndDeadline(title, deadline);
        final String trimmedTitle = title.trim();
        validateTitle(trimmedTitle);
        validateDeadline(deadline);
        return new Room(
                RoomSession.generate(),
                trimmedTitle,
                deadline
        );
    }

    private static void validateTitleAndDeadline(final String title, final LocalDateTime deadline) {
        Validator.builder()
                .add(Fields.title, title)
                .add(Fields.deadline, deadline)
                .validateNull();
    }

    private static void validateTitle(final String trimmedTitle) {
        if (trimmedTitle.isBlank() || trimmedTitle.length() > TITLE_MAX_LENGTH) {
            throw new InvalidLengthException(DomainTerm.ROOM, trimmedTitle);
        }
    }

    private static void validateDeadline(final LocalDateTime deadline) {
        if (deadline.isBefore(LocalDateTime.now())) {
            throw new PastNotAllowedException(DomainTerm.DEADLINE, deadline);
        }
    }

    public void ensureDeadlineNotPassed(final LocalDateTime currentDateTime) {
        if (deadline.isBefore(currentDateTime)) {
            throw new DeadlineOverdueException(session, deadline, currentDateTime);
        }
    }
}
