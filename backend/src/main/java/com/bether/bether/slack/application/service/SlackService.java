package com.bether.bether.slack.application.service;

import com.bether.bether.slack.application.service.dto.SlackRoomCreatedInput;
import com.bether.bether.slack.config.SlackBotProperties;
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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SlackService {

    private static final String BASE_SCHEDULE_URL = "https://estime.today/schedule/";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final RestClient restClient = RestClient.builder().build();
    private final Slack slack;
    private final SlackBotProperties slackProps;

    public void sendMessage(final String message) {
        try {
            final ChatPostMessageRequest request = ChatPostMessageRequest.builder()
                    .channel(slackProps.getChannelId())
                    .text(message)
                    .build();

            final ChatPostMessageResponse response = slack.methods(slackProps.getToken())
                    .chatPostMessage(request);

            if (response.isOk()) {
                log.info("Slack message sent: channel={}, ts={}", response.getChannel(), response.getTs());
            } else {
                log.warn("Slack API responded with error: {}", response.getError());
            }
        } catch (final IOException | SlackApiException e) {
            log.error("Failed to send Slack message", e);
        }
    }

    public void sendRoomCreatedMessage(final SlackRoomCreatedInput input) {
        final String scheduleLink = BASE_SCHEDULE_URL + input.session();
        final String message = buildRoomCreatedMessage(input, scheduleLink);

        final JSONObject payload = new JSONObject()
                .put("blocks", List.of(blockSection(message)));

        try {
            final String response = restClient.post()
                    .uri(slackProps.getWebhookUrl())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload.toString())
                    .retrieve()
                    .body(String.class);

            log.info("Slack message sent for created room: '{}', Link: {}", input.title(), scheduleLink);
        } catch (final Exception e) {
            log.error("Failed to send Slack message for created room '{}'. Reason: {}", input.title(), e.getMessage(), e);
        }
    }

    private String buildRoomCreatedMessage(final SlackRoomCreatedInput input, final String scheduleLink) {
        final String dates = input.availableDates().stream()
                .map(DATE_FORMATTER::format)
                .collect(Collectors.joining(", "));

        final String start = input.startTime().format(TIME_FORMATTER);
        final String end = input.endTime().format(TIME_FORMATTER);

        return String.join("\n",
                "🗓 *일정이 생성되었습니다!*",
                "> <" + scheduleLink + "|*일정조율 링크바로가기*>",
                "> 제목 : " + input.title(),
                "> 날짜 : " + dates,
                "> 시간 : " + start + " ~ " + end
        );
    }

    private JSONObject blockSection(final String text) {
        return new JSONObject()
                .put("type", "section")
                .put("text", new JSONObject()
                        .put("type", "mrkdwn")
                        .put("text", text));
    }
}
