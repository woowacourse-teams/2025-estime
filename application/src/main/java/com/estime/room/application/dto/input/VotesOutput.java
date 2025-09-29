package com.estime.room.application.dto.input;

import com.estime.domain.room.participant.ParticipantName;
import com.estime.domain.room.participant.vote.Vote;
import com.estime.domain.room.participant.vote.Votes;
import java.util.List;

public record VotesOutput(
        ParticipantName name,
        List<Vote> votes
) {

    public static VotesOutput from(final ParticipantName name, final Votes votes) {
        return new VotesOutput(name, votes.getSortedVotes());
    }
}
