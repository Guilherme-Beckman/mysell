package com.project.mysell.service;
import org.springframework.stereotype.Service;
import com.project.mysell.exceptions.AccountLockedCodeException;
import reactor.core.publisher.Mono;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class CodeVerificationAttemptService extends AttemptService {


    private long initialLockDuration = TimeUnit.MINUTES.toMillis(1);
    private ConcurrentHashMap<String, Integer> verificationAttemptsCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> accountUnlockTimestampCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> currentLockDurationCache = new ConcurrentHashMap<>();

    @Override
    public Mono<Void> succeeded(String key) {
        return Mono.fromRunnable(() -> {
            resetVerificationState(key);
        });
    }

    @Override
    public Mono<Void> failed(String key) {
        return Mono.fromRunnable(() -> {
            int attempts = incrementVerificationAttempts(key);
            long newLockDuration = calculateExponentialBackoff(attempts);
            updateLockState(key, newLockDuration);
        });
    }

    @Override
    public Mono<Boolean> isBlocked(String key) {
        return Mono.defer(() -> {
            Long unlockTimestamp = accountUnlockTimestampCache.get(key);
            
            if (unlockTimestamp == null) {
                return Mono.just(false);
            }
            
            if (System.currentTimeMillis() >= unlockTimestamp) {
                resetVerficationTimeCache(key);
                return Mono.just(false);
            }
            
            long remainingTime = unlockTimestamp - System.currentTimeMillis();
            return Mono.error(new AccountLockedCodeException(remainingTime));
        });
    }

    private int incrementVerificationAttempts(String key) {
        int attempts = verificationAttemptsCache.compute(key, (k, v) -> (v == null ? 0 : v) + 1);
        return attempts;
    }

    private long calculateExponentialBackoff(int attemptCount) {
        long backoffDuration = initialLockDuration * (1L << (attemptCount - 1));
        return backoffDuration;
    }

    private void updateLockState(String key, long lockDuration) {
        long unlockTime = System.currentTimeMillis() + lockDuration;
        currentLockDurationCache.put(key, lockDuration);
        accountUnlockTimestampCache.put(key, unlockTime);
    }

    private void resetVerificationState(String key) {
        verificationAttemptsCache.remove(key);
        accountUnlockTimestampCache.remove(key);
        currentLockDurationCache.remove(key);
    }

    private void resetVerficationTimeCache(String key) {
        accountUnlockTimestampCache.remove(key);
        currentLockDurationCache.remove(key);
    }
}
