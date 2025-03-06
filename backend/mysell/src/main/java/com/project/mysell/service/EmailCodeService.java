package com.project.mysell.service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.project.mysell.exceptions.AccountLockedCodeException;
import com.project.mysell.exceptions.ExistingCodeException;
import com.project.mysell.exceptions.InvalidCodeException;

import reactor.core.publisher.Mono;

@Service
public class EmailCodeService implements EmailService {


    private ConcurrentHashMap<String, String> pendingCodes = new ConcurrentHashMap<>();

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private CodeVerificationAttempService attempService;

    @Override
    public Mono<Void> sendEmail(String to, String subject, String body) {
        return Mono.fromRunnable(() -> {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            javaMailSender.send(message);
        });
    }

    public Mono<Void> sendCode(String email) {
        return this.verifyExistingCode(email)
                .then(generateCode().flatMap(code -> {
                    this.pendingCodes.put(email, code);
                    Mono.delay(Duration.ofSeconds(60))
                        .doOnNext(t -> {
                            pendingCodes.remove(email);
                        })
                        .subscribe();

                    return this.sendEmail(email, "validation", code);
                }));
    }

    private Mono<Void> verifyExistingCode(String email) {
        return Mono.defer(() -> {
            if (pendingCodes.get(email) != null) {
                return Mono.error(new ExistingCodeException());
            }
            return Mono.empty();
        });
    }

    private Mono<String> generateCode() {
        int randomNumber = ThreadLocalRandom.current().nextInt(10000, 100000);
        String code = String.valueOf(randomNumber);
        return Mono.just(code);
    }

    public Mono<Boolean> validateCode(String email, String code) {
        return this.validateAccountStatus(email)
            .then(Mono.defer(() -> {
                String storedCode = pendingCodes.get(email);
                if (storedCode != null && storedCode.equals(code)) {
                    handleSuccessfullAttempt(email);
                    pendingCodes.remove(email);
                    return Mono.just(true);
                }
                handleFailedAttempt(email);
                return Mono.error(new InvalidCodeException());
            }));
    }


    private void handleSuccessfullAttempt(String username) {
        attempService.succeeded(username);
    }

    private void handleFailedAttempt(String username) {
        attempService.failed(username);
    }

    private Mono<Void> validateAccountStatus(String username) {
        return Mono.defer(() -> {
            attempService.isBlocked(username);
            return Mono.empty();
        });
    }
}
