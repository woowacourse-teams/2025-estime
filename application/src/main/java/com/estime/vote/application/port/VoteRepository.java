package com.estime.vote.application.port;

import com.estime.domain.room.participant.vote.Vote;
import com.estime.domain.room.participant.vote.Votes;
import java.util.List;

public interface VoteRepository {

    Votes findAllByParticipantId(Long participantId);

    Votes findAllByParticipantIds(List<Long> participantIds);

    Vote save(Vote vote);

    Votes saveAll(Votes dateTimeSlots);

    void deleteAllInBatch(Votes dateTimeSlots);
}
