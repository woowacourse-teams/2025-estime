package com.estime.vote;

import com.estime.room.participant.vote.QVote;
import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.VoteRepository;
import com.estime.room.participant.vote.Votes;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class VoteRepositoryAdapter implements VoteRepository {

    private static final QVote vote = QVote.vote;
    private final VoteJpaRepository jpaRepository;
    private final JPAQueryFactory queryFactory;

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
                queryFactory.selectFrom(vote)
                        .where(vote.id.participantId.in(participantIds))
                        .fetch()
        );
    }

    @Override
    public void deleteAllInBatch(final Votes votes) {
        queryFactory.delete(vote)
                .where(vote.id.in(votes.getVoteIds()))
                .execute();
    }

    @Override
    public Votes findAllByParticipantId(final Long participantId) {
        return Votes.from(
                queryFactory.selectFrom(vote)
                        .where(vote.id.participantId.eq(participantId))
                        .fetch()
        );
    }
}
