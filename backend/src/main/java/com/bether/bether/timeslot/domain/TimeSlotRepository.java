package com.bether.bether.timeslot.domain;

public interface TimeSlotRepository {

    TimeSlots findAllByRoomId(Long roomId);

    TimeSlots findAllByRoomIdAndUserName(Long roomId, String userName);

    TimeSlot save(TimeSlot timeSlot);

    TimeSlots saveAll(TimeSlots timeSlots);

    void deleteAllInBatch(TimeSlots timeSlots);
}
