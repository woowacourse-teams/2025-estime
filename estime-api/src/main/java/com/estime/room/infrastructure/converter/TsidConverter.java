package com.estime.room.infrastructure.converter;

import com.estime.common.exception.application.InternalLogOnlyException;
import com.github.f4b6a3.tsid.Tsid;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class TsidConverter implements Converter<String, Tsid> {

    @Override
    public Tsid convert(final String source) {
        try {
            return Tsid.from(source);
        } catch (Exception e) {
            throw new InternalLogOnlyException("Invalid TSID format", source);
        }
    }
}
