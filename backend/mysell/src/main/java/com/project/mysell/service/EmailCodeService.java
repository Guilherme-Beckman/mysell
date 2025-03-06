package com.project.mysell.service;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

@Service
public class EmailCodeService implements EmailService{
	private ConcurrentHashMap<String, String> pendingCodes = new ConcurrentHashMap<>();
	@Autowired
	private JavaMailSender javaMailSender;
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
		return this.generateCode().flatMap(code ->{
			this.pendingCodes.put(email, code);
			Mono.delay(Duration.ofSeconds(60))
				.doOnNext(t -> pendingCodes.remove(email))
				.subscribe();
			return this.sendEmail(email, "validation", code.toString());
		});
		
	}

	private Mono<String> generateCode() {
		var randomNumber = ThreadLocalRandom.current().nextInt(10000, 100000);
		return Mono.just(String.valueOf(randomNumber));
	}
    public Mono<Boolean> validateCode(String email, String code) {
        String storedCode = pendingCodes.get(email);
        if (storedCode != null && storedCode.equals(code)) {
            pendingCodes.remove(email);
            return Mono.just(true);
        }
        return Mono.just(false);
    }

}
