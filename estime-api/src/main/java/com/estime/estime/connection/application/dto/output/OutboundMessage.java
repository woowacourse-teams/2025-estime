package com.estime.estime.connection.application.dto.output;

import com.estime.estime.connection.domain.ConnectedRoom;
import com.estime.estime.room.domain.Room;
import java.time.format.DateTimeFormatter;

public record OutboundMessage(
        String text,
        String shortcut
) {

    // TODO refactor
    public static OutboundMessage roomCreated(final ConnectedRoom connectedRoom, final String url) {
        final Room room = connectedRoom.getRoom();
        final String subjectField = "**  제목  :  **" + room.getTitle();
        final String deadlineField = "**  마감기한  :  **" + room.getDeadLine().format(
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")); // TODO DT Formatter 관리 필요

        final String text = """
                %s
                %s
                """.formatted(subjectField, deadlineField).trim();

        return new OutboundMessage(text, url);
    }
}
