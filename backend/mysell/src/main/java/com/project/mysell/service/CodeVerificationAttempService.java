package com.project.mysell.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.project.mysell.exceptions.AccountLockedCodeException;

import reactor.core.publisher.Mono;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class CodeVerificationAttempService extends AttemptService{


    private final long INITIAL_LOCK_TIME_DURATION = 1 * 60 * 1000; // 1 minuto em milissegundos
    private ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> lockTimeCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> lockDurationCache = new ConcurrentHashMap<>();
    @Override
    public void succeeded(String key) {
        attemptsCache.remove(key);
        lockTimeCache.remove(key);
        lockDurationCache.remove(key);
    }
    @Override
    public void failed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0);
        attempts++;
        attemptsCache.put(key, attempts);
        long lockDuration = INITIAL_LOCK_TIME_DURATION * (1L << (attempts - 1)); // Dobra o tempo a cada falha
        lockDurationCache.put(key, lockDuration);
        lockTimeCache.put(key, System.currentTimeMillis() + lockDuration);
    }
    @Override
    public boolean isBlocked(String key) {
        if (lockTimeCache.containsKey(key)) {
            long lockTime = lockTimeCache.get(key);
            if (System.currentTimeMillis() >= lockTime) {
                attemptsCache.remove(key);
                lockTimeCache.remove(key);
                lockDurationCache.remove(key);
                return false;
            }
            throw new AccountLockedCodeException(lockTime - System.currentTimeMillis());

        }
        return false;
    }
}
