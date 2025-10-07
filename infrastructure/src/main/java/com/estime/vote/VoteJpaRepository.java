package com.estime.vote;

import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteJpaRepository extends JpaRepository<Vote, VoteId> {
}
