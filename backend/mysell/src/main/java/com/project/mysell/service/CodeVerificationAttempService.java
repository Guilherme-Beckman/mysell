package com.project.mysell.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.project.mysell.exceptions.AccountLockedCodeException;
import com.project.mysell.exceptions.AccountLockedException;

import reactor.core.publisher.Mono;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class CodeVerificationAttempService extends AttemptService {

    private static final Logger logger = LoggerFactory.getLogger(CodeVerificationAttempService.class);

    private final long INITIAL_LOCK_TIME_DURATION = 1 * 60 * 1000; // 1 minuto em milissegundos
    private ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> lockTimeCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> lockDurationCache = new ConcurrentHashMap<>();

    @Override
    public Mono<Void> succeeded(String key) {
        return Mono.fromRunnable(() -> {
            attemptsCache.remove(key);
            lockTimeCache.remove(key);
            lockDurationCache.remove(key);
            logger.info("Login bem-sucedido para a chave: {}", key);
        });
    }

    @Override
    public Mono<Void> failed(String key) {
        return Mono.fromRunnable(() -> {
            int attempts = attemptsCache.getOrDefault(key, 0);
            attempts++;
            attemptsCache.put(key, attempts);
            long lockDuration = INITIAL_LOCK_TIME_DURATION * (1L << (attempts - 1)); // Dobra o tempo a cada falha
            lockDurationCache.put(key, lockDuration);
            lockTimeCache.put(key, System.currentTimeMillis() + lockDuration);
            logger.warn("Falha no login para a chave: {}. Tentativa número: {}. Tempo de bloqueio ajustado: {}ms", key, attempts, lockDuration);
        });
    }

    @Override
    public Mono<Boolean> isBlocked(String key) {
        if (lockTimeCache.containsKey(key)) {
            long lockTime = lockTimeCache.get(key);
            if (System.currentTimeMillis() >= lockTime) {
                lockTimeCache.remove(key);
                lockDurationCache.remove(key);
                logger.info("Conta desbloqueada para a chave: {}", key);
                return Mono.just(false);
            }
            long timeRemaining = lockTime - System.currentTimeMillis();
            logger.warn("Conta bloqueada para a chave: {}. Tempo restante de bloqueio: {}ms", key, timeRemaining);
            return Mono.error(new AccountLockedException(timeRemaining));
        }
        logger.info("Conta não bloqueada para a chave: {}", key);
        return Mono.just(false);
    }
}
