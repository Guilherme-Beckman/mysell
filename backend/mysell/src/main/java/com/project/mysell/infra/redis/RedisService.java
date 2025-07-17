package com.project.mysell.infra.redis;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

@Service
public class RedisService {
	@Autowired
    private ReactiveRedisTemplate<String, Object> redisTemplate;


    public Mono<Boolean> setValue(String key, Object value) {
        return redisTemplate.opsForValue().set(key, value);
    }

    public Mono<Object> getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public Mono<Boolean> setValueWithExpiration(String key, Object value, long seconds) {
        return redisTemplate.opsForValue().set(key, value, Duration.ofSeconds(seconds));
    }

    public Mono<Boolean> setIfAbsent(String key, Object value) {
        return redisTemplate.opsForValue().setIfAbsent(key, value);
    }

    public Mono<Boolean> deleteKey(String key) {
        return redisTemplate.opsForValue().delete(key);
    }
}
