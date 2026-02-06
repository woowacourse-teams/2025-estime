package com.estime.room.participant.vote.compact;

import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.shared.Validator;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Transient;
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
public class CompactVote implements Persistable<CompactVoteId> {

    @EmbeddedId
    private CompactVoteId id;

    @Transient
    private boolean isNew = true;

    public static CompactVote of(
            final Long participantId,
            final CompactDateTimeSlot compactDateTimeSlot
    ) {
        Validator.builder()
                .add("participantId", participantId)
                .add("compactDateTimeSlot", compactDateTimeSlot)
                .validateNull();
        return new CompactVote(CompactVoteId.of(participantId, compactDateTimeSlot), true);
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

    public Long getParticipantId() {
        return id.getParticipantId();
    }

    public CompactDateTimeSlot getCompactDateTimeSlot() {
        return id.getCompactDateTimeSlot();
    }
}
