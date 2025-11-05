package com.estime.room.dto.input;

import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.participant.vote.compact.CompactVotes;
import java.util.List;

public record CompactVotesOutput(
        ParticipantName name,
        List<CompactVote> votes
) {

    public static CompactVotesOutput from(final ParticipantName name, final CompactVotes votes) {
        return new CompactVotesOutput(name, votes.getSortedVotes());
    }
}
