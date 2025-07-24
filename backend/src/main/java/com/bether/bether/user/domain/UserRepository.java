package com.bether.bether.user.domain;

import java.util.Optional;

public interface UserRepository {

    User save(User user);

    boolean existsByRoomIdAndName(Long roomId, String name);

    Optional<User> findByRoomIdAndName(Long roomId, String name);
}
