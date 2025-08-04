package com.estime.room.infrastructure.participant.slot;

import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.VoteRepository;
import com.estime.room.domain.participant.vote.vo.Votes;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class VoteRepositoryImpl implements VoteRepository {

    private final ParticipantDateTimeSlotJpaRepository jpaRepository;

    @Override
    public Vote save(final Vote vote) {
        return jpaRepository.save(vote);
    }

    @Override
    public Votes saveAll(final Votes votes) {
        return Votes.from(jpaRepository.saveAll(votes.getElements()));
    }

    @Override
    public Votes findAllByParticipantIds(final List<Long> participantIds) {
        return Votes.from(
                jpaRepository.findAllInParticipantIds(participantIds));
    }

    @Override
    public void deleteAllInBatch(final Votes votes) {
        jpaRepository.deleteAllInBatch(votes.getElements());
    }

    @Override
    public Votes findAllByParticipantId(final Long participantId) {
        return Votes.from(jpaRepository.findAllByParticipantId(participantId).getElements());
    }
}
