package com.estime.config;

import com.estime.cache.CacheNames;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.core.Ordered;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
// 캐시 인터셉터를 트랜잭션 인터셉터보다 바깥에 둔다. 둘 다 기본 우선순위가 최저라
// 지정하지 않으면 순서가 정해지지 않는다. 바깥에 두면 캐시 히트일 때 트랜잭션을
// 열지 않아 커넥션을 잡지 않는다.
@EnableCaching(order = Ordered.HIGHEST_PRECEDENCE)
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        final CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                CacheNames.VOTE_STATISTIC
        );
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(500, TimeUnit.MILLISECONDS)
                .maximumSize(1000));
        return cacheManager;
    }
}
