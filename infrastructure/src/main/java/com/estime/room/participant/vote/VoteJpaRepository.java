package com.estime.room.participant.vote;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteJpaRepository extends JpaRepository<Vote, VoteId> {
}
