package com.estime.connection.application;

import static org.assertj.core.api.SoftAssertions.assertSoftly;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

import com.estime.connection.application.dto.input.ConnectedRoomCreateInput;
import com.estime.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.estime.connection.domain.ConnectedRoom;
import com.estime.connection.domain.ConnectedRoomRepository;
import com.estime.connection.domain.Platform;
import com.estime.connection.infrastructure.discord.DiscordMessageSender;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import com.estime.room.domain.vo.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class ConnectedRoomApplicationServiceTest {

    @Autowired
    private ConnectedRoomApplicationService connectedRoomApplicationService;

    @Autowired
    private ConnectedRoomRepository connectedRoomRepository;

    @MockitoBean
    private DiscordMessageSender discordMessageSender;

    @DisplayName("플랫폼과 연결된 방 생성을 할 수 있다")
    @Test
    void createConnectedRoom() {
        // given
        final ConnectedRoomCreateInput input = new ConnectedRoomCreateInput(
                "title",
                List.of(DateSlot.from(LocalDate.now())),
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2026, 1, 1, 0, 0)),
                Platform.DISCORD,
                "testChannelId"
        );

        doNothing().when(discordMessageSender).sendConnectedRoomCreatedMessage(any(), any());

        // when
        final ConnectedRoomCreateOutput saved = connectedRoomApplicationService.save(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(isValidSession(saved.session()))
                    .isTrue();

            final ConnectedRoom connectedRoom = connectedRoomRepository.findBySession(saved.session()).orElseThrow();
            softly.assertThat(connectedRoom.getRoom().getSession()).isEqualTo(saved.session());
        });
    }

    private boolean isValidSession(final RoomSession session) {
        return Tsid.isValid(session.toString());
    }
}
