package com.bether.bether.connection.application;

import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateInput;
import com.bether.bether.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.bether.bether.connection.domain.ConnectedRoom;
import com.bether.bether.connection.domain.Platform;
import com.bether.bether.room.application.service.RoomDomainService;
import com.bether.bether.room.domain.Room;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ConnectedRoomApplicationService {

    private final RoomDomainService roomDomainService;
    private final ConnectedRoomDomainService connectedRoomDomainService;
    private final Map<Platform, MessageSender> messageSenders;

    @Transactional
    public ConnectedRoomCreateOutput save(final ConnectedRoomCreateInput input) {
        final Room room = roomDomainService.save(input.toRoomEntity());
        final ConnectedRoom connectedRoom = ConnectedRoom.withoutId(room, input.platform());
        connectedRoomDomainService.save(connectedRoom);
        sendConnectedRoomCreatedMessage(connectedRoom, input.channelId()); // 딜레이가 없는 경우 문제 발생

        return ConnectedRoomCreateOutput.from(connectedRoom);
    }

    // TODO refactor separate class
    /*
     * 1. 일정 조율 룸 생성 페이지 메시지 (나한테만)
     * 2. 일정 조율 룸 참여 메시지
     * 3. 마감 기한 임박 알림 메시지
     * 4. 일정 확정 메시지
     */
    private void sendConnectedRoomCreatedMessage(
            final ConnectedRoom connectedRoom,
            final String channelId
    ) {
        final Room room = connectedRoom.getRoom();
        final String url = "https://estime.today/" + room.getSession();

        sendMessage(connectedRoom.getPlatform(), channelId, generateCreatedMessage(room, url));
    }

    private String generateCreatedMessage(final Room room, final String url) {
        final String title = "**" + room.getTitle() + "**";
        final String line = "<" + url + "|🔗 바로가기>";
        final String deadLine = String.format(
                ":alarm_clock: 마감: %s",
                room.getDeadLine().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        return title + "\n" + line + "\n" + deadLine;
    }

    private void sendMessage(
            final Platform platform,
            final String channelId,
            final String message
    ) {
        switch (platform) {
            case DISCORD -> messageSenders.get(Platform.DISCORD).execute(channelId, message);
            case SLACK -> messageSenders.get(Platform.SLACK).execute(channelId, message);
        }
    }
}

