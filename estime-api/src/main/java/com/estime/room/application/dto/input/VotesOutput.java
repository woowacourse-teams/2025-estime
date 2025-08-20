package com.estime.room.application.dto.input;

import com.estime.room.domain.participant.vo.ParticipantName;
import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.Votes;
import java.util.List;

public record VotesOutput(
        ParticipantName name,
        List<Vote> votes
) {

    public static VotesOutput from(final ParticipantName name, final Votes votes) {
        return new VotesOutput(name, votes.getSortedVotes());
    }
}
