package com.estime.room.domain.participant.vote;

import com.estime.room.domain.participant.vote.vo.Votes;
import java.util.List;

public interface VoteRepository {

    Votes findAllByParticipantId(Long participantId);

    Votes findAllByParticipantIds(List<Long> participantIds);

    Vote save(Vote vote);

    Votes saveAll(Votes dateTimeSlots);

    void deleteAllInBatch(Votes dateTimeSlots);
}
