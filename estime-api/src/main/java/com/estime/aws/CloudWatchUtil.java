package com.estime.aws;

import io.micrometer.cloudwatch2.CloudWatchConfig;
import io.micrometer.cloudwatch2.CloudWatchMeterRegistry;
import io.micrometer.core.instrument.Clock;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchAsyncClient;

@Component
public class CloudWatchUtil {

    @Bean
    public MeterRegistry meterRegistry() {

        final CloudWatchAsyncClient cloudWatchClient = CloudWatchAsyncClient.builder()
                .region(Region.AP_NORTHEAST_2)
                .build();
        final CloudWatchConfig cloudWatchConfig = new CloudWatchConfig() {

            @Override
            public String get(final String key) {
                return null;
            }

            @Override
            public String namespace() {
                return "EC2/estime-api/dev";
            }
        };

        return new CloudWatchMeterRegistry(cloudWatchConfig, Clock.SYSTEM, cloudWatchClient);
    }
}
