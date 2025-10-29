package com.estime.room.participant.vote.compact;

import com.estime.room.participant.vote.exception.DuplicateNotAllowedException;
import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.shared.DomainTerm;
import com.estime.shared.Validator;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CompactVotes {

    private final Set<CompactVote> elements;

    public static CompactVotes from(final List<CompactVote> votes) {
        validateDuplicate(votes);
        validateNull(votes);
        return new CompactVotes(new HashSet<>(votes));
    }

    private static void validateNull(final List<CompactVote> votes) {
        Validator.builder()
                .add("votes", votes)
                .validateNull();
    }

    private static void validateDuplicate(final List<CompactVote> votes) {
        final long uniqueCount = votes.stream()
                .map(CompactVote::dateTimeSlot)
                .distinct()
                .count();

        if (uniqueCount != votes.size()) {
            throw new DuplicateNotAllowedException(DomainTerm.VOTES);
        }
    }

    public CompactVotes subtract(final CompactVotes other) {
        final Set<CompactVote> removed = new HashSet<>(this.elements);
        removed.removeAll(other.elements);
        return new CompactVotes(removed);
    }

    public Map<CompactDateTimeSlot, Set<Long>> calculateStatistic() {
        return elements.stream()
                .collect(Collectors.groupingBy(
                        CompactVote::dateTimeSlot,
                        Collectors.mapping(CompactVote::participantId, Collectors.toSet())
                ));
    }

    public List<CompactVote> getSortedVotes() {
        return elements.stream()
                .sorted(Comparator.comparing(CompactVote::dateTimeSlot))
                .toList();
    }

    public Set<CompactVote> getElements() {
        return new HashSet<>(elements);
    }

    public List<CompactVoteId> getVoteIds() {
        return elements.stream()
                .map(CompactVote::getId)
                .toList();
    }

    public int size() {
        return elements.size();
    }

    public boolean isEmpty() {
        return elements.isEmpty();
    }
}
