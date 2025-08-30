package com.estime.timepreference.application;

import com.estime.timepreference.domain.category.CategoryClassifier;
import com.estime.timepreference.domain.category.RoomCategory;
import com.estime.timepreference.domain.category.RoomCategoryRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomCategoryService {

    private final RoomCategoryRepository roomCategoryRepository;
    private final CategoryClassifier categoryClassifier;

    @Transactional
    public List<RoomCategory> classifyRooms(final Map<Long, String> titleByRoomId) {
        if (titleByRoomId == null || titleByRoomId.isEmpty()) {
            return List.of();
        }

        final List<RoomCategory> existing =
                roomCategoryRepository.findAllInRoomId(titleByRoomId.keySet());

        final Set<Long> classifiedRoomId = existing.stream()
                .map(RoomCategory::getRoomId)
                .collect(Collectors.toSet());

        final Set<Long> unclassifiedRoomIds = titleByRoomId.keySet().stream()
                .filter(id -> !classifiedRoomId.contains(id))
                .collect(Collectors.toSet());

        final List<RoomCategory> categories = unclassifiedRoomIds.stream()
                .map(id -> RoomCategory.withoutId(
                        id,
                        categoryClassifier.classify(
                                titleByRoomId.get(id))))
                .toList();

        final List<RoomCategory> saved = roomCategoryRepository.saveAll(categories);

        final List<RoomCategory> result = new ArrayList<>();
        result.addAll(existing);
        result.addAll(saved);

        return List.copyOf(result);
    }
}
