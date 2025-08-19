package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.Votes;
import java.util.List;

public record ParticipantVotesOutput(
        String participantName,
        List<Vote> votes
) {

    public static ParticipantVotesOutput from(final String participantName, final Votes votes) {
        return new ParticipantVotesOutput(
                participantName,
                votes.getSortedVotes()
        );
    }
}
