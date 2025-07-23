package com.bether.bether.connection.slack.application.dto;

public record SlackSlashCommandInput(
        String command,
        String channelId
) {
}
