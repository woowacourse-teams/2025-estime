package com.estime.timepreference.infrastructure.category;

import com.estime.timepreference.domain.category.CategoryClassifier;
import com.estime.timepreference.domain.category.CategoryType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.Locale;

@Component
@Slf4j
public class KeywordCategoryClassifier implements CategoryClassifier {

    @Override
    public CategoryType classify(final String rawTitle) {
        if (rawTitle == null || rawTitle.isBlank()) {
            return CategoryType.ETC;
        }

        final String title = normalize(rawTitle);

        if (containsWorkKeywords(title))   return CategoryType.WORK;
        if (containsLeisureKeywords(title)) return CategoryType.LEISURE;
        if (containsSocialKeywords(title))  return CategoryType.SOCIAL;

        return CategoryType.ETC;
    }

    private static String normalize(final String s) {
        return Normalizer.normalize(s, Normalizer.Form.NFKC)
                .toLowerCase(Locale.ROOT)
                .trim();
    }

    private static boolean containsAny(final String title, final String... keywords) {
        for (final String kw : keywords) {
            if (title.contains(kw)) return true;
        }
        return false;
    }

    private boolean containsWorkKeywords(final String title) {
        return containsAny(title,
                "회의", "미팅", "스터디", "세미나", "프로젝트",
                "업무", "작업", "개발",
                "코딩", "수학", "영어", "회화",
                "워크숍", "워크샵"
        );
    }

    private boolean containsLeisureKeywords(final String title) {
        return containsAny(title,
                "게임", "운동", "영화", "취미",
                "배드민턴", "축구", "농구", "볼링",
                "쇼핑",
                "롤", "리그오브레전드", "lol",
                "배그", "pubg",
                "오버워치", "overwatch"
        );
    }

    private boolean containsSocialKeywords(final String title) {
        return containsAny(title,
                "회식", "모임", "파티", "동아리", "친목", "번개"
        );
    }
}
