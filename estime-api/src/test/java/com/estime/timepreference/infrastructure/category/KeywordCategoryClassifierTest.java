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
}