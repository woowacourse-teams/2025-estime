package com.estime.timepreference.infrastructure.category;

import static org.assertj.core.api.Assertions.assertThat;

import com.estime.timepreference.domain.category.CategoryType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class KeywordCategoryClassifierTest {

    private final KeywordCategoryClassifier classifier = new KeywordCategoryClassifier();

    @DisplayName("업무 관련 키워드가 있으면 WORK 카테고리를 반환한다")
    @Test
    void classify_workKeywords_returnsWork() {
        assertThat(classifier.classify("프로젝트 회의")).isEqualTo(CategoryType.WORK);
        assertThat(classifier.classify("개발 미팅")).isEqualTo(CategoryType.WORK);
        assertThat(classifier.classify("스터디 모임")).isEqualTo(CategoryType.WORK);
        assertThat(classifier.classify("코딩 세미나")).isEqualTo(CategoryType.WORK);
    }

    @DisplayName("여가 관련 키워드가 있으면 LEISURE 카테고리를 반환한다")
    @Test
    void classify_leisureKeywords_returnsLeisure() {
        assertThat(classifier.classify("배드민턴 게임")).isEqualTo(CategoryType.LEISURE);
        assertThat(classifier.classify("영화 보기")).isEqualTo(CategoryType.LEISURE);
        assertThat(classifier.classify("롤 게임")).isEqualTo(CategoryType.LEISURE);
        assertThat(classifier.classify("축구 경기")).isEqualTo(CategoryType.LEISURE);
    }

    @DisplayName("모임 관련 키워드가 있으면 SOCIAL 카테고리를 반환한다")
    @Test
    void classify_socialKeywords_returnsSocial() {
        assertThat(classifier.classify("회식 자리")).isEqualTo(CategoryType.SOCIAL);
        assertThat(classifier.classify("동아리 모임")).isEqualTo(CategoryType.SOCIAL);
        assertThat(classifier.classify("친목 파티")).isEqualTo(CategoryType.SOCIAL);
        assertThat(classifier.classify("번개 모임")).isEqualTo(CategoryType.SOCIAL);
    }

    @DisplayName("해당하는 키워드가 없으면 ETC 카테고리를 반환한다")
    @Test
    void classify_noMatchingKeywords_returnsEtc() {
        assertThat(classifier.classify("일반적인 제목")).isEqualTo(CategoryType.ETC);
        assertThat(classifier.classify("기타 내용")).isEqualTo(CategoryType.ETC);
    }

    @DisplayName("빈 문자열이나 null이면 ETC 카테고리를 반환한다")
    @Test
    void classify_emptyOrNull_returnsEtc() {
        assertThat(classifier.classify(null)).isEqualTo(CategoryType.ETC);
        assertThat(classifier.classify("")).isEqualTo(CategoryType.ETC);
        assertThat(classifier.classify("   ")).isEqualTo(CategoryType.ETC);
    }

    @DisplayName("대소문자와 공백을 무시하고 분류한다")
    @Test
    void classify_ignoreCaseAndSpaces_correctlyClassifies() {
        assertThat(classifier.classify("  프로젝트  ")).isEqualTo(CategoryType.WORK);
        assertThat(classifier.classify("MEETING")).isEqualTo(CategoryType.ETC);
        assertThat(classifier.classify("게임")).isEqualTo(CategoryType.LEISURE);
    }

    @DisplayName("영어 대소문자 정규화 테스트")
    @Test
    void classify_englishCaseNormalization() {
        assertThat(classifier.classify("LOL 대회")).isEqualTo(CategoryType.LEISURE);
        assertThat(classifier.classify("Overwatch 모임")).isEqualTo(CategoryType.LEISURE);
        assertThat(classifier.classify("PUBG 스쿼드")).isEqualTo(CategoryType.LEISURE);
    }

    @DisplayName("전각/반각 문자 정규화 테스트")
    @Test
    void classify_fullWidthCharacterNormalization() {
        // 전각 영어 → 반각 영어로 정규화
        assertThat(classifier.classify("ｌｏｌ 대회")).isEqualTo(CategoryType.LEISURE); // 전각 lol
        assertThat(classifier.classify("ｇａｍｅ 시간")).isEqualTo(CategoryType.LEISURE); // 전각 game
        assertThat(classifier.classify("ｐｕｂｇ 플레이")).isEqualTo(CategoryType.LEISURE); // 전각 pubg
    }

    @DisplayName("호환 문자 정규화 테스트")
    @Test
    void classify_compatibilityCharacterNormalization() {
        // 원 안의 숫자, 괄호 안의 숫자 등 호환 문자
        assertThat(classifier.classify("①차 회의")).isEqualTo(CategoryType.WORK); // ①(원 안의 1)
        assertThat(classifier.classify("⑴번째 미팅")).isEqualTo(CategoryType.WORK); // ⑴(괄호 안의 1)
        assertThat(classifier.classify("②번째 게임")).isEqualTo(CategoryType.LEISURE); // ②(원 안의 2)
    }

    @DisplayName("다양한 공백 문자 정규화 테스트")
    @Test
    void classify_whitespaceNormalization() {
        // 일반 공백, 탭, 개행, 전각 공백 등
        assertThat(classifier.classify("\t회의\n")).isEqualTo(CategoryType.WORK);
        assertThat(classifier.classify("　게임　")).isEqualTo(CategoryType.LEISURE); // 전각 공백(U+3000)
        assertThat(classifier.classify(" 　\t모임\n　 ")).isEqualTo(CategoryType.SOCIAL); // 혼합 공백
    }

    @DisplayName("복합 정규화 테스트")
    @Test
    void classify_mixedNormalization() {
        // 여러 정규화가 동시에 적용되는 경우
        System.out.println(classifier.classify("　　①번째　ＬＯＬ　대회　　"));
        System.out.println(classifier.classify("⑴차　　ＧＡＭＥ　모임"));
        assertThat(classifier.classify("　　①번째　ＬＯＬ　대회　　")).isEqualTo(CategoryType.LEISURE); 
        // 전각공백 + 원 안의 숫자 + 전각 LOL + 전각공백

        assertThat(classifier.classify("⑴차　　ＧＡＭＥ　모임")).isEqualTo(CategoryType.LEISURE);
        // 괄호 안의 숫자 + 전각공백 + 전각 GAME
    }

    @DisplayName("우선순위 테스트 - 먼저 매칭되는 카테고리가 선택됨")
    @Test
    void classify_priority_firstMatchWins() {
        // WORK 키워드가 먼저 체크되므로 WORK로 분류
        assertThat(classifier.classify("회의 후 게임하기")).isEqualTo(CategoryType.WORK);
        assertThat(classifier.classify("스터디 모임 파티")).isEqualTo(CategoryType.WORK);
        
        // LEISURE가 SOCIAL보다 먼저 체크되므로 LEISURE로 분류  
        assertThat(classifier.classify("게임 모임")).isEqualTo(CategoryType.LEISURE);
    }
}
