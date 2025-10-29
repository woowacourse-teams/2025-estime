package com.estime.room.participant.vote;

import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.participant.vote.compact.CompactVoteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompactVoteJpaRepository extends JpaRepository<CompactVote, CompactVoteId> {
}
