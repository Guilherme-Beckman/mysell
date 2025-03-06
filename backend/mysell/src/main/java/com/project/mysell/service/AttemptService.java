package com.project.mysell.service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.project.mysell.exceptions.AccountLockedException;

import reactor.core.publisher.Mono;

@Service
public class AttemptService {
    private static final Logger logger = LoggerFactory.getLogger(AttemptService.class);

    private final int MAX_ATTEMPT = 3; 
    private final long LOCK_TIME_DURATION = TimeUnit.HOURS.toMillis(24); 
    private ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> lockTimeCache = new ConcurrentHashMap<>();

    public Mono<Void> succeeded(String key) {
        return Mono.fromRunnable(() -> {
            attemptsCache.remove(key);
            lockTimeCache.remove(key);
            logger.info("Login bem-sucedido, cache de tentativas removido para a chave: {}", key);
        });
    }

    public Mono<Void> failed(String key) {
        return Mono.fromRunnable(() -> {
            int attempts = attemptsCache.getOrDefault(key, 0);
            attempts++;
            attemptsCache.put(key, attempts);
            logger.warn("Tentativa de login falhou. Tentativas para {}: {}", key, attempts);

            if (attempts >= MAX_ATTEMPT) {
                lockTimeCache.put(key, System.currentTimeMillis());
                logger.warn("Conta bloqueada para a chave: {}. Tentativas excederam o máximo permitido.", key);
            }
        });
    }

    public Mono<Boolean> isBlocked(String key) {
        return Mono.defer(() -> {
            if (lockTimeCache.containsKey(key)) {
                long lockTime = lockTimeCache.get(key);
                if (System.currentTimeMillis() - lockTime > LOCK_TIME_DURATION) {
                    attemptsCache.remove(key);
                    lockTimeCache.remove(key);
                    logger.info("Bloqueio expirado para a chave: {}", key);
                    return Mono.just(false);
                }
                long timeRemaining = LOCK_TIME_DURATION - (System.currentTimeMillis() - lockTime);
                logger.warn("Conta ainda bloqueada para a chave: {}. Tempo restante de bloqueio: {} ms", key, timeRemaining);
                return Mono.error(new AccountLockedException(timeRemaining));
            }
            logger.info("Conta não bloqueada para a chave: {}", key);
            return Mono.just(false);
        });
    }
}
