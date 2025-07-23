package com.bether.bether.user.infrastructure;

import com.bether.bether.user.domain.User;
import com.bether.bether.user.domain.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository userJpaRepository;

    @Override
    public User save(final User user) {
        return userJpaRepository.save(user);
    }

    @Override
    public boolean existsByRoomIdAndName(final Long roomId, final String name) {
        return userJpaRepository.existsByRoomIdAndName(roomId, name);
    }

    @Override
    public Optional<User> findByRoomIdAndName(final Long roomId, final String name) {
        return userJpaRepository.findByRoomIdAndName(roomId, name);
    }
}
