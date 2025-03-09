package com.project.mysell.service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Service;
import com.project.mysell.exceptions.AccountLockedException;
import reactor.core.publisher.Mono;

@Service
public class AttemptService {
    private final int maxAttempts = 3;
    private final long lockTimeDuration = TimeUnit.HOURS.toMillis(24);  // Corrigi a conversão de horas para milissegundos
    private final ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> accountLockTimeCache = new ConcurrentHashMap<>();

    public Mono<Void> succeeded(String key) {
        return Mono.fromRunnable(() -> {
            resetSecurityCache(key);
        });
          
    }

    public Mono<Void> failed(String key) {
        return Mono.fromRunnable(() -> {
            int attempts = incrementAttempts(key);
            if (attempts >= maxAttempts) {
                lockAccount(key);
            }
        });
    }

    public Mono<Boolean> isBlocked(String key) {
        return Mono.defer(() -> {
            Long lockTimestamp = accountLockTimeCache.get(key);

            if (lockTimestamp == null) {
                return Mono.just(false);
            }

            long elapsedTime = System.currentTimeMillis() - lockTimestamp;

            if (elapsedTime > lockTimeDuration) {
                resetSecurityCache(key);
                return Mono.just(false);
            }

            long remainingTime = lockTimeDuration - elapsedTime;
            return Mono.error(new AccountLockedException(remainingTime));
        });
    }

    private int incrementAttempts(String key) {
        int newAttempts = attemptsCache.compute(key, (k, attempts) -> 
            attempts == null ? 1 : attempts + 1
        );
        return newAttempts;
    }

    private void lockAccount(String key) {
        accountLockTimeCache.put(key, System.currentTimeMillis());
    }

    private void resetSecurityCache(String key) {
        attemptsCache.remove(key);
        accountLockTimeCache.remove(key);
    }
}
