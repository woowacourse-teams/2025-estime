package com.estime.room.participant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParticipantJpaRepository extends JpaRepository<Participant, Long> {

    @Modifying
    @Query(
            value = "INSERT IGNORE INTO participant (room_id, name, active) VALUES (:room_id, :name, :active)",
            nativeQuery = true
    )
    int saveIfNotExists(
            @Param("room_id") Long roomId,
            @Param("name") String name,
            @Param("active") boolean active
    );
}
