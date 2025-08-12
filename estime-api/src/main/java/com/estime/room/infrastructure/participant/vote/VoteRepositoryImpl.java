package com.estime.room.infrastructure.participant.vote;

import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.VoteRepository;
import com.estime.room.domain.participant.vote.Votes;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class VoteRepositoryImpl implements VoteRepository {

    private final VoteJpaRepository jpaRepository;

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
                jpaRepository.findAllById_ParticipantIdIn(participantIds));
    }

    @Override
    public void deleteAllInBatch(final Votes votes) {
        jpaRepository.deleteAllInBatch(votes.getElements());
    }

    @Override
    public Votes findAllByParticipantId(final Long participantId) {
        return Votes.from(jpaRepository.findAllById_ParticipantId(participantId));
    }
}
