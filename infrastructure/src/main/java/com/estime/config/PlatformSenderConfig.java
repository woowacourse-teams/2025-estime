package com.estime.config;

import com.estime.port.out.PlatformMessageSender;
import com.estime.room.platform.PlatformType;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PlatformSenderConfig {

    @Bean
    public Map<PlatformType, PlatformMessageSender> platformMessageSenders(
            final List<PlatformMessageSender> senders
    ) {
        return senders.stream()
                .collect(Collectors.toMap(
                        PlatformMessageSender::getPlatformType,
                        Function.identity()
                ));
    }
}
