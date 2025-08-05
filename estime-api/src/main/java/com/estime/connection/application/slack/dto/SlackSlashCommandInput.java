package com.estime.connection.application.slack.dto;

public record SlackSlashCommandInput(
        String command,
        String channelId,
        String userId
) {
}
