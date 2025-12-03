package com.estime.sse.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.estime.TestApplication;
import com.github.f4b6a3.tsid.TsidCreator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(classes = TestApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @DisplayName("GET /api/v1/sse/rooms/{session}/stream - SSE 스트림이 비동기로 시작된다")
    @Test
    void stream_asyncStarted() throws Exception {
        final String validSession = TsidCreator.getTsid().toString();

        mockMvc.perform(get("/api/v1/sse/rooms/{session}/stream", validSession))
                .andExpect(status().isOk())
                .andExpect(request().asyncStarted());
    }

    @DisplayName("GET /api/v1/sse/rooms/{session}/stream - 잘못된 세션 형식 시 400(code)")
    @Test
    void stream_invalidSessionFormat() throws Exception {
        mockMvc.perform(get("/api/v1/sse/rooms/{session}/stream", "invalid-session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }
}

