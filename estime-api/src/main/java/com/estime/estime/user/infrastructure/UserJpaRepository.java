package com.estime.estime.user.infrastructure;

import com.estime.estime.user.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<User, Long> {

    Optional<User> findByRoomIdAndName(Long roomId, String name);

    boolean existsByRoomIdAndName(Long roomId, String name);
}
