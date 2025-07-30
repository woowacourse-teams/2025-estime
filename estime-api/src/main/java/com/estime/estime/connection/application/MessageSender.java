package com.estime.estime.connection.application;

import com.estime.estime.connection.application.dto.input.ConnectedRoomCreatedMessageInput;

public interface MessageSender {

    void sendTextMessage(String channelId, String message);

    void sendConnectedRoomCreatedMessage(String channelId, ConnectedRoomCreatedMessageInput input);

}
