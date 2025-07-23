package com.bether.bether.connection.slack.application.util;

import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.bether.bether.connection.application.dto.input.ConnectedRoomCreatedMessageInput;
import com.slack.api.model.block.ActionsBlock;
import com.slack.api.model.block.LayoutBlock;
import com.slack.api.model.block.SectionBlock;
import com.slack.api.model.block.composition.MarkdownTextObject;
import com.slack.api.model.block.composition.PlainTextObject;
import com.slack.api.model.block.element.ButtonElement;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SlackMessageBuilder {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public List<LayoutBlock> buildRoomCreateBlocks(ConnectedRoomCreateMessageInput input) {
        return List.of(
                SectionBlock.builder()
                        .text(markdown("*🗓 일정조율 시작하기*"))
                        .build(),
                ActionsBlock.builder()
                        .elements(List.of(
                                ButtonElement.builder()
                                        .text(plain("아인슈타임 바로가기"))
                                        .url(input.connectedRoomCreateUrl())
                                        .actionId("create-room")
                                        .build()
                        ))
                        .build()
        );
    }

    public List<LayoutBlock> buildRoomCreatedBlocks(ConnectedRoomCreatedMessageInput input) {
        String formattedDeadline = input.deadLine().format(DATE_TIME_FORMATTER);

        return List.of(
                SectionBlock.builder()
                        .text(markdown("*🗓 일정이 생성되었습니다!*"))
                        .build(),
                ActionsBlock.builder()
                        .elements(List.of(
                                ButtonElement.builder()
                                        .text(plain("아인슈타임 바로가기"))
                                        .url(input.connectedRoomCreatedUrl())
                                        .actionId("view-created-room")
                                        .build()
                        ))
                        .build(),
                SectionBlock.builder()
                        .fields(List.of(
                                markdown("*제목:*\n" + input.title()),
                                markdown("*마감기한:*\n" + formattedDeadline)
                        ))
                        .build()
        );
    }

    private MarkdownTextObject markdown(String text) {
        return MarkdownTextObject.builder().text(text).build();
    }

    private PlainTextObject plain(String text) {
        return PlainTextObject.builder().text(text).emoji(true).build();
    }
}
