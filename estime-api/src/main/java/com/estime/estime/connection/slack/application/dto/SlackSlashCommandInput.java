package com.estime.estime.connection.slack.application.dto;

public record SlackSlashCommandInput(
        String command,
        String channelId,
        String userId
) {
}
