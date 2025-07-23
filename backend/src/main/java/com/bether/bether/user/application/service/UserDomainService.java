package com.bether.bether.user.application.service;

import com.bether.bether.common.NotFoundException;
import com.bether.bether.user.application.dto.input.UserCreateInput;
import com.bether.bether.user.domain.User;
import com.bether.bether.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDomainService {

    private static final int PASSWORD_MAX_LENGTH = 8;

    private final UserRepository userRepository;

    public User getByRoomIdAndName(final Long roomId, final UserCreateInput input) {
        if (userRepository.existsByRoomIdAndName(roomId, input.name())) {
            final User user = userRepository.findByRoomIdAndName(roomId, input.name())
                    .orElseThrow(() -> new NotFoundException(User.class.getSimpleName()));
            checkPassword(user, input.password());
            return user;
        }
        validatePasswordLength(input.password());
        return userRepository.save(input.toEntity(roomId));
    }

    private void checkPassword(final User user, final String password) {
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("password is wrong.");
        }
    }

    private void validatePasswordLength(final String password) {
        if (password.length() > PASSWORD_MAX_LENGTH) {
            throw new IllegalArgumentException("password length must be lower than 8.");
        }
    }
}
