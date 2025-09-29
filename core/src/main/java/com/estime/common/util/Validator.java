package com.estime.common.util;

import com.estime.common.exception.NullNotAllowedException;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class Validator {

    public static ValidatorBuilder builder() {
        return new ValidatorBuilder();
    }

    public static class ValidatorBuilder {

        private final List<ValidationElement> elements = new ArrayList<>();

        public ValidatorBuilder add(final String name, final Object target) {
            this.elements.add(new ValidationElement(name, target));
            return this;
        }

        public void validateNull() {
            for (final ValidationElement element : this.elements) {
                if (element.target() == null) {
                    throw new NullNotAllowedException(element.name());
                }
            }
        }

        private record ValidationElement(String name, Object target) {
        }
    }
}
