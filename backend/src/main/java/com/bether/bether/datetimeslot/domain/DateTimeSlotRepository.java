package com.bether.bether.datetimeslot.domain;

public interface DateTimeSlotRepository {

    DateTimeSlots findAllByRoomId(Long roomId);

    DateTimeSlots findAllByRoomIdAndUserName(Long roomId, String userName);

    DateTimeSlot save(DateTimeSlot dateTimeSlot);

    DateTimeSlots saveAll(DateTimeSlots dateTimeSlots);

    void deleteAllInBatch(DateTimeSlots dateTimeSlots);
}
