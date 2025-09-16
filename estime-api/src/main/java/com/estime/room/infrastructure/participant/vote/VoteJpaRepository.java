package com.estime.room.infrastructure.participant.vote;

import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteJpaRepository extends JpaRepository<Vote, VoteId> {
}
