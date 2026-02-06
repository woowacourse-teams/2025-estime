package com.estime.room.participant.vote;

import com.estime.room.participant.vote.compact.QCompactVote;
import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.participant.vote.compact.CompactVoteRepository;
import com.estime.room.participant.vote.compact.CompactVotes;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CompactVoteRepositoryAdapter implements CompactVoteRepository {

    private static final QCompactVote compactVote = QCompactVote.compactVote;
    private final CompactVoteJpaRepository jpaRepository;
    private final JPAQueryFactory queryFactory;

    @Override
    public CompactVote save(final CompactVote vote) {
        return jpaRepository.save(vote);
    }

    @Override
    public CompactVotes saveAll(final CompactVotes votes) {
        return CompactVotes.from(jpaRepository.saveAll(votes.getElements()));
    }

    @Override
    public CompactVotes findAllByParticipantId(final Long participantId) {
        return CompactVotes.from(
                queryFactory.selectFrom(compactVote)
                        .where(compactVote.id.participantId.eq(participantId))
                        .fetch()
        );
    }

    @Override
    public CompactVotes findAllByParticipantIds(final List<Long> participantIds) {
        return CompactVotes.from(
                queryFactory.selectFrom(compactVote)
                        .where(compactVote.id.participantId.in(participantIds))
                        .fetch()
        );
    }

    @Override
    public void deleteAllInBatch(final CompactVotes votes) {
        queryFactory.delete(compactVote)
                .where(compactVote.id.in(votes.getVoteIds()))
                .execute();
    }
}
