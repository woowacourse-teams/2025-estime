package com.estime.room.participant.vote;

import com.estime.room.participant.vote.exception.DuplicateNotAllowedException;
import com.estime.room.slot.DateTimeSlot;
import com.estime.shared.DomainTerm;
import com.estime.shared.Validator;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Votes {

    private final Set<Vote> elements;

    public record Diff(Votes toRemove, Votes toAdd) {
    }

    public record Statistic(Map<DateTimeSlot, Set<Long>> dateTimeSlotParticipants) {

        public Set<Long> allParticipantIds() {
            return dateTimeSlotParticipants.values().stream()
                    .flatMap(Collection::stream)
                    .collect(Collectors.toSet());
        }

        public Set<DateTimeSlot> dateTimeSlots() {
            return dateTimeSlotParticipants.keySet();
        }

        public Set<Long> participantIdsFor(final DateTimeSlot slot) {
            return dateTimeSlotParticipants.getOrDefault(slot, Set.of());
        }
    }

    public static Votes from(final List<Vote> votes) {
        validateNull(votes);
        validateDuplicate(votes);
        return new Votes(new HashSet<>(votes));
    }

    private static void validateNull(final List<Vote> votes) {
        Validator.builder()
                .add("votes", votes)
                .validateNull();
    }

    private static void validateDuplicate(final List<Vote> votes) {
        final long uniqueCount = votes.stream()
                .distinct()
                .count();

        if (uniqueCount != votes.size()) {
            throw new DuplicateNotAllowedException(DomainTerm.VOTES);
        }
    }

    public Diff diff(final Votes updated) {
        return new Diff(this.subtract(updated), updated.subtract(this));
    }

    public Votes subtract(final Votes other) {
        final Set<Vote> removed = new HashSet<>(this.elements);
        removed.removeAll(other.elements);
        return new Votes(removed);
    }

    public Statistic calculateStatistic() {
        return new Statistic(elements.stream()
                .collect(Collectors.groupingBy(
                        Vote::getDateTimeSlot,
                        Collectors.mapping(Vote::getParticipantId, Collectors.toSet())
                )));
    }

    public List<Vote> getSortedVotes() {
        return elements.stream()
                .sorted(Comparator.comparing(Vote::getDateTimeSlot))
                .toList();
    }

    public Set<Vote> getElements() {
        return new HashSet<>(elements);
    }

    public List<VoteId> getVoteIds() {
        return elements.stream()
                .map(Vote::getId)
                .toList();
    }

    public int size() {
        return elements.size();
    }

    public boolean isEmpty() {
        return elements.isEmpty();
    }
}
