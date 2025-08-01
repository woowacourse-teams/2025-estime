package com.estime.connection.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

import com.estime.connection.application.dto.input.ConnectedRoomCreateInput;
import com.estime.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.estime.connection.discord.infrastructure.DiscordMessageSender;
import com.estime.connection.domain.ConnectedRoom;
import com.estime.connection.domain.ConnectedRoomRepository;
import com.estime.connection.domain.Platform;
import com.github.f4b6a3.tsid.Tsid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
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
                List.of(LocalDate.now()),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true,
                Platform.DISCORD,
                "testChannelId"
        );

        doNothing().when(discordMessageSender).sendConnectedRoomCreatedMessage(any(), any());

        // when
        final ConnectedRoomCreateOutput saved = connectedRoomApplicationService.save(input);

        // then
        assertThat(isValidTsid(saved.session()))
                .isTrue();

        final ConnectedRoom connectedRoom = connectedRoomRepository.findBySession(saved.session()).orElseThrow();
        assertThat(connectedRoom.getRoom().getSession()).isEqualTo(saved.session());
    }

    private boolean isValidTsid(final String tsid) {
        if (tsid == null || tsid.isEmpty()) {
            return false;
        }
        return Tsid.isValid(tsid);
    }
}
