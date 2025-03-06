package com.project.mysell.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.project.mysell.exceptions.AccountLockedException;

import reactor.core.publisher.Mono;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class AttemptService {
    private final int MAX_ATTEMPT = 3; 
    private final long LOCK_TIME_DURATION = TimeUnit.HOURS.toMillis(24); 
    private ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> lockTimeCache = new ConcurrentHashMap<>();

    public void succeeded(String key) {
        attemptsCache.remove(key);
        lockTimeCache.remove(key);
    }

    public void failed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0);
        attempts++;
        attemptsCache.put(key, attempts);
        if (attempts >= MAX_ATTEMPT) {
            lockTimeCache.put(key, System.currentTimeMillis());
        }
    }

    public boolean isBlocked(String key) {
        if (lockTimeCache.containsKey(key)) {
            long lockTime = lockTimeCache.get(key);
            if (System.currentTimeMillis() - lockTime > LOCK_TIME_DURATION) {
                attemptsCache.remove(key);
                lockTimeCache.remove(key);
                return false; 
            }
            return true; 
        }
        return false; 
    }

}
