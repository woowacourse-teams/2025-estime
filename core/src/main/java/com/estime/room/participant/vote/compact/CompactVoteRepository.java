package com.estime.room.participant.vote.compact;

import java.util.List;

public interface CompactVoteRepository {

    CompactVotes findAllByParticipantId(Long participantId);

    CompactVotes findAllByParticipantIds(List<Long> participantIds);

    CompactVote save(CompactVote vote);

    CompactVotes saveAll(CompactVotes votes);

    void deleteAllInBatch(CompactVotes votes);
}
