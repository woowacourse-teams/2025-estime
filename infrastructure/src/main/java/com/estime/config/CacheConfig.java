package com.estime.config;

import com.estime.cache.CacheNames;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        final CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                CacheNames.VOTE_STATISTIC,
                CacheNames.COMPACT_VOTE_STATISTIC
        );
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(500, TimeUnit.MILLISECONDS)
                .maximumSize(1000));
        return cacheManager;
    }
}
