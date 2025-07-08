package com.bether.bether.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // 기본 생성자
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자
public class ApiResponse<T> {

    private boolean success; // 처리 성공 여부
    private String message;  // 추가 메시지(에러 설명 등)
    private T data;          // 실제 응답 데이터

    public static <T> ApiResponse<T> ok() {
        return new ApiResponse<>(true, null, null);
    }

    public static <T> ApiResponse<T> ok(final T data) {
        return new ApiResponse<>(true, null, data);
    }

    public static <T> ApiResponse<T> ok(final String message, final T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> fail(final String message) {
        return new ApiResponse<>(false, message, null);
    }
}
