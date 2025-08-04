package com.estime.room.infrastructure.participant.slot;

import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.vo.VoteId;
import com.estime.room.domain.participant.vote.vo.Votes;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantDateTimeSlotJpaRepository extends JpaRepository<Vote, VoteId> {

    List<Vote> findAllInParticipantIds(List<Long> participantIds);

    Votes findAllByParticipantId(Long participantId);
}
