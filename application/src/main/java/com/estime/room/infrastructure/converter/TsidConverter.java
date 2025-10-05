package com.estime.room.infrastructure.converter;

import com.github.f4b6a3.tsid.Tsid;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class TsidConverter implements Converter<String, Tsid> {

    @Override
    public Tsid convert(final String source) {
        return Tsid.from(source);
    }
}
