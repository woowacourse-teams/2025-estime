package com.bether.bether.connection.slack.application.util;

import com.bether.bether.connection.slack.application.dto.SlackRoomCreatedInput;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class SlackMessageBuilder {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public String buildRoomCreatedMessage(final SlackRoomCreatedInput input, final String scheduleLink) {
        final String dates = input.availableDates().stream()
                .map(DATE_FORMATTER::format)
                .collect(Collectors.joining(", "));

        final String start = input.startTimeStartAt().format(TIME_FORMATTER);
        final String end = input.endTimeStartAt().format(TIME_FORMATTER);

        return String.join("\n",
                "🗓 *일정이 생성되었습니다!*",
                "> <" + scheduleLink + "|*일정조율 링크바로가기*>",
                "> 제목 : " + input.title(),
                "> 날짜 : " + dates,
                "> 시간 : " + start + " ~ " + end
        );
    }
}
