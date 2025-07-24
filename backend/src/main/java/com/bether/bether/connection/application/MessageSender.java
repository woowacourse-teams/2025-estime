package com.bether.bether.connection.application;

import com.bether.bether.connection.application.dto.input.ConnectedRoomCreatedMessageInput;

public interface MessageSender {

    void sendTextMessage(String channelId, String message);

    void sendConnectedRoomCreatedMessage(String channelId, ConnectedRoomCreatedMessageInput input);

}
