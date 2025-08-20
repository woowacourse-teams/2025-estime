package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.Votes;
import java.util.List;

public record VotesOutput(
        String participantName,
        List<Vote> votes
) {

    public static VotesOutput from(final String participantName, final Votes votes) {
        return new VotesOutput(
                participantName,
                votes.getSortedVotes()
        );
    }
}
