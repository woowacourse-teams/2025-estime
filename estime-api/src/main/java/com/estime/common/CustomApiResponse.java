package com.estime.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomApiResponse<T> {

    @Schema(example = "200", description = "custom 응답 코드")
    private int code;

    @Schema(example = "true", description = "custom 요청 처리 성공 여부")
    private boolean success;

    @Schema(example = "true", description = "부가 메시지", nullable = true)
    private String message;

    @Schema(description = "응답 데이터", nullable = true)
    private T data;

    public static <T> CustomApiResponse<T> ok() {
        return ok(null, null);
    }

    public static <T> CustomApiResponse<T> ok(final T data) {
        return ok(null, data);
    }

    public static <T> CustomApiResponse<T> ok(final String message, final T data) {
        return new CustomApiResponse<>(200, true, message, data);
    }

    public static <T> CustomApiResponse<T> badRequest(final String message) {
        return new CustomApiResponse<>(400, false, message, null);
    }

    public static <T> CustomApiResponse<T> internalServerError(final String message) {
        return new CustomApiResponse<>(500, false, message, null);
    }
}
