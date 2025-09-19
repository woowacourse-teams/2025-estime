package com.estime.aws;

public class CloudWatchUtil {

//    @Bean
//    @Profile("dev")
//    public MeterRegistry devMeterRegistry() {
//
//        final CloudWatchAsyncClient cloudWatchClient = CloudWatchAsyncClient.builder()
//                .region(Region.AP_NORTHEAST_2)
//                .build();
//        final CloudWatchConfig cloudWatchConfig = new CloudWatchConfig() {
//
//            @Override
//            public String get(final String key) {
//                return null;
//            }
//
//            @Override
//            public String namespace() {
//                return "EC2/estime-api/dev";
//            }
//        };
//
//        return new CloudWatchMeterRegistry(cloudWatchConfig, Clock.SYSTEM, cloudWatchClient);
//    }
//
//    @Bean
//    @Profile("prod")
//    public MeterRegistry prodMeterRegistry() {
//
//        final CloudWatchAsyncClient cloudWatchClient = CloudWatchAsyncClient.builder()
//                .region(Region.AP_NORTHEAST_2)
//                .build();
//        final CloudWatchConfig cloudWatchConfig = new CloudWatchConfig() {
//
//            @Override
//            public String get(final String key) {
//                return null;
//            }
//
//            @Override
//            public String namespace() {
//                return "EC2/estime-api/prod";
//            }
//        };
//
//        return new CloudWatchMeterRegistry(cloudWatchConfig, Clock.SYSTEM, cloudWatchClient);
//    }
}
