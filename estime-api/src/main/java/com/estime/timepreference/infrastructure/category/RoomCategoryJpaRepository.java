package com.estime.timepreference.infrastructure.category;

import com.estime.timepreference.domain.category.RoomCategory;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomCategoryJpaRepository extends JpaRepository<RoomCategory, Long> {

    Optional<RoomCategory> findByRoomId(Long roomId);
}
