package com.estime.room.domain.participant;

import com.estime.common.NotFoundException;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParticipantDomainService {

//    private static final int PASSWORD_MAX_LENGTH = 8;
//
//    private final ParticipantRepository participantRepository;
//
//    public Participant getByRoomIdAndName(final Long roomId, final ParticipantCreateInput input) {
//        if (participantRepository.existsByRoomIdAndName(roomId, input.name())) {
//            final Participant participant = participantRepository.findIdByRoomIdAndName(roomId, input.name())
//                    .orElseThrow(() -> new NotFoundException(Participant.class.getSimpleName()));
//            checkPassword(participant, input.password());
//            return participant;
//        }
//        validatePasswordLength(input.password());
//        return participantRepository.save(input.toEntity(roomId));
//    }
//
//    private void checkPassword(final Participant participant, final String password) {
//        if (!participant.getPassword().equals(password)) {
//            throw new IllegalArgumentException("password is wrong.");
//        }
//    }
//
//    private void validatePasswordLength(final String password) {
//        if (password.length() > PASSWORD_MAX_LENGTH) {
//            throw new IllegalArgumentException("password length must be lower than 8.");
//        }
//    }
}
