package com.estime.room.participant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ParticipantJpaRepository extends JpaRepository<Participant, Long> {

    @Modifying
    @Query(
            value = "INSERT IGNORE INTO participant (room_id, name, active) VALUES (?1, ?2, ?3)",
            nativeQuery = true
    )
    int saveIfNotExists(Long roomId, String name, boolean active);
}
