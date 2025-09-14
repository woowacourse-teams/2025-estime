package com.estime.room.domain.participant;

import com.estime.common.util.Validator;
import com.estime.room.domain.participant.vo.ParticipantName;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Participants {

    List<Participant> values;

    private Participants(final List<Participant> values) {
        this.values = values;
    }

    public static Participants from(final List<Participant> participants) {
        validateNull(participants);
        return new Participants(List.copyOf(participants));
    }

    private static void validateNull(final List<Participant> participants) {
        Validator.builder()
                .add("participants", participants)
                .validateNull();
    }

    public List<Participant> getValues() {
        return List.copyOf(values);
    }

    public int getSize() {
        return values.size();
    }

    public List<ParticipantName> getAllNames() {
        return values.stream()
                .map(Participant::getName)
                .toList();
    }

    public Map<Long, ParticipantName> getIdToName() {
        return values.stream()
                .collect(Collectors.toMap(Participant::getId, Participant::getName));
    }
}
