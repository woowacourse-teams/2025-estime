package com.bether.bether.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // 기본 생성자
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자
public class CustomApiResponse<T> {

    private int code;
    private boolean success; // 처리 성공 여부
    private String message;  // 추가 메시지(에러 설명 등)
    private T data;          // 실제 응답 데이터

    public static <T> CustomApiResponse<T> ok() {
        return ok(null, null);
    }

    public static <T> CustomApiResponse<T> ok(final T data) {
        return ok(null, data);
    }

    public static <T> CustomApiResponse<T> ok(final String message, final T data) {
        return new CustomApiResponse<>(200, true, message, data);
    }

    public static <T> CustomApiResponse<T> created() {
        return created(null, null);
    }

    public static <T> CustomApiResponse<T> created(final T data) {
        return created(null, data);
    }

    public static <T> CustomApiResponse<T> created(final String message, final T data) {
        return new CustomApiResponse<>(201, true, message, data);
    }

    public static <T> CustomApiResponse<T> fail(final String message) {
        return new CustomApiResponse<>(400, false, message, null);
    }
}
