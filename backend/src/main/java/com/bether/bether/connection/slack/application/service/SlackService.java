package com.bether.bether.connection.slack.application.service;

import com.bether.bether.connection.slack.application.dto.SlackRoomCreatedInput;
import com.bether.bether.connection.slack.application.util.SlackMessageBuilder;
import com.bether.bether.connection.slack.config.SlackBotProperties;
import com.slack.api.Slack;
import com.slack.api.methods.SlackApiException;
import com.slack.api.methods.request.chat.ChatPostMessageRequest;
import com.slack.api.methods.response.chat.ChatPostMessageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class SlackService {

    private static final String BASE_SCHEDULE_URL = "https://estime.today/schedule/";

    private final RestClient slackRestClient;
    private final Slack slack;
    private final SlackBotProperties slackProps;
    private final SlackMessageBuilder slackMessageBuilder;

    public void sendMessage(final String message) {
        try {
            final ChatPostMessageRequest request = ChatPostMessageRequest.builder()
                    .channel(slackProps.channelId())
                    .text(message)
                    .build();

            final ChatPostMessageResponse response = slack.methods(slackProps.token())
                    .chatPostMessage(request);

            if (response.isOk()) {
                log.info("Slack message sent: channel={}", response.getChannel());
            } else {
                log.warn("Slack API returned error response: {}", response.getError());
            }
        } catch (final SlackApiException e) {
            log.error("Slack API exception occurred: {}", e.getError(), e);
        } catch (final IOException e) {
            log.error("I/O error while sending Slack message", e);
        }
    }

    public void sendRoomCreatedMessage(final SlackRoomCreatedInput input) {
        final String scheduleLink = BASE_SCHEDULE_URL + input.session();
        final String message = slackMessageBuilder.buildRoomCreatedMessage(input, scheduleLink);

        final JSONObject payload = new JSONObject()
                .put("blocks", List.of(blockSection(message)));

        try {
            final String response = slackRestClient.post()
                    .uri(slackProps.webhookUrl())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload.toString())
                    .retrieve()
                    .body(String.class);

            log.info("Slack message sent for created room: '{}', Link: {}", input.title(), scheduleLink);
        } catch (final Exception e) {
            log.error("Failed to send Slack message for created room '{}'. Reason: {}", input.title(), e.getMessage(), e);
        }
    }

    private JSONObject blockSection(final String text) {
        return new JSONObject()
                .put("type", "section")
                .put("text", new JSONObject()
                        .put("type", "mrkdwn")
                        .put("text", text));
    }
}
