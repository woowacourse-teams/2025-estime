package com.estime.estime.connection.application;

import com.estime.estime.common.config.WebConfigProperties;
import com.estime.estime.connection.application.dto.input.ConnectedRoomCreateInput;
import com.estime.estime.connection.application.dto.input.ConnectedRoomCreatedMessageInput;
import com.estime.estime.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.estime.estime.connection.domain.ConnectedRoom;
import com.estime.estime.connection.domain.Platform;
import com.estime.estime.room.application.service.RoomDomainService;
import com.estime.estime.room.domain.Room;
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
    private final WebConfigProperties webConfigProperties; // TODO rename

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
     * 1. 일정 조율 룸 생성 페이지 메시지 (나에게만)
     * 2. 일정 조율 룸 참여 메시지
     * 3. 마감 기한 임박 알림 메시지
     * 4. 일정 확정 메시지
     */
    private void sendConnectedRoomCreatedMessage(final ConnectedRoom connectRoom, final String channelId) {
        final Room room = connectRoom.getRoom();
        final String shortcut = webConfigProperties.dev() + "check?id=" + room.getSession();
        final ConnectedRoomCreatedMessageInput input = ConnectedRoomCreatedMessageInput.of(shortcut, room);
        messageSenders.get(connectRoom.getPlatform()).sendConnectedRoomCreatedMessage(channelId, input);
    }
}

