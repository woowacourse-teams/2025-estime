package com.estime.room.participant.vote;

import com.estime.room.slot.DateTimeSlot;
import com.estime.shared.Validator;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.domain.Persistable;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
@EqualsAndHashCode(of = "id")
public class Vote implements Persistable<VoteId> {

    @EmbeddedId
    private VoteId id;

    @Transient
    private boolean isNew = true;

    public static Vote of(final Long participantId, final DateTimeSlot dateTimeSlot) {
        Validator.builder()
                .add("participantId", participantId)
                .add("dateTimeSlot", dateTimeSlot)
                .validateNull();
        return new Vote(VoteId.of(participantId, dateTimeSlot), true);
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostLoad
    @PostPersist
    void markNotNew() {
        this.isNew = false;
    }

    public Long participantId() {
        return id.getParticipantId();
    }

    public DateTimeSlot dateTimeSlot() {
        return id.getDateTimeSlot();
    }

    public LocalDateTime startAt() {
        return dateTimeSlot().getStartAt();
    }
}
