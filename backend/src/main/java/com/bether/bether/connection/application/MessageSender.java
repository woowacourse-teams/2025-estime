package com.bether.bether.connection.application;

import com.bether.bether.connection.application.dto.output.OutboundMessage;

public interface MessageSender {

    void execute(String channelId, OutboundMessage message);
}
