package com.bether.bether.connection.application;

public interface MessageSender {

    void execute(String channelId, String message);
}
