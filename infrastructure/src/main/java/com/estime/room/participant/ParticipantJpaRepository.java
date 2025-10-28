package com.estime.room.participant;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ParticipantJpaRepository extends JpaRepository<Participant, Long> {

    @Modifying
    @Transactional
    @Query(
            value = "INSERT IGNORE INTO participant (room_id, name, active) VALUES (?1, ?2, ?3)",
            nativeQuery = true
    )
    int saveIgnore(Long roomId, String name, boolean active);
}
