package com.project.mysell.service.auth.code;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.auth.email.SucessSendEmailDTO;
import com.project.mysell.exceptions.code.ExistingCodeException;
import com.project.mysell.exceptions.code.InvalidCodeException;
import com.project.mysell.exceptions.code.NoVerificationCodeFoundException;
import com.project.mysell.service.EmailService;
import com.project.mysell.service.auth.attempt.EmailSendVericationAttemtpService;

import reactor.core.publisher.Mono;

@Service
public class EmailCodeService {
	private ConcurrentHashMap<String, String> pendingVerificationCodes = new ConcurrentHashMap<>();
	@Autowired
	private CodeVerificationAttemptService attemptService;
	@Autowired
	private EmailSendVericationAttemtpService emailSendVericationAttemtpService;
	private Duration codeExpirationDuration = Duration.ofSeconds(60);
	@Autowired
	private EmailService emailService;

	public Mono<Void> sendEmail(String to, String verificationCode) {
		return this.emailService.sendVerificationEmail(to, verificationCode);
	}

	public Mono<SucessSendEmailDTO> sendVerificationCode(String email) {
		return verifyNoExistingCode(email)
				.then(validateEmailStatus(email))
				.then(validateAccountStatus(email))
				.then(handleExcessiveSendEmails(email))
				.then(generateVerificationCode())
				.flatMap(code -> {
			storeAndSendCode(email, code).subscribe(null, error -> {
				System.err.println("Erro ao executar storeAndSendCode: " + error.getMessage());
			});
			return Mono.just(new SucessSendEmailDTO("Email sended with sucess", codeExpirationDuration));
		});
	}

	public Mono<Boolean> validateCode(String email, String code) {
		return validateAccountStatus(email).then(validateCodeAgainstStore(email, code));
	}

	private Mono<Void> validateAccountStatus(String username) {
		return Mono.defer(() -> {
			return attemptService.isBlocked(username).flatMap(isBlocked -> {
				return Mono.empty();
			});
		});
	}
	private Mono<Void> validateEmailStatus(String username) {
		return Mono.defer(() -> {
			return emailSendVericationAttemtpService.isBlocked(username).flatMap(isBlocked -> {
				return Mono.empty();
			});
		});
	}

	private Mono<Void> storeAndSendCode(String email, String code) {
		return Mono.fromRunnable(() -> pendingVerificationCodes.put(email, code)).then(sendEmail(email, code))
				.then(scheduleCodeExpiration(email));
	}

	private Mono<Void> scheduleCodeExpiration(String email) {
		return Mono.delay(codeExpirationDuration).doOnNext(__ -> {
			pendingVerificationCodes.remove(email);
		}).then();
	}

	private Mono<String> generateVerificationCode() {
		return Mono.fromSupplier(() -> {
			int code = ThreadLocalRandom.current().nextInt(10000, 100000);
			return String.valueOf(code);
		});
	}

	private Mono<Void> verifyNoExistingCode(String email) {
		return Mono.defer(() -> pendingVerificationCodes.containsKey(email) ? Mono.error(new ExistingCodeException())
				: Mono.empty());
	}

	private Mono<Boolean> validateCodeAgainstStore(String email, String code) {
		return Mono.fromCallable(() -> {
			String storedCode = pendingVerificationCodes.get(email);
			if (storedCode == null) {
				throw new NoVerificationCodeFoundException();
			}
			if (!storedCode.equals(code)) {
				return false;
			}
			pendingVerificationCodes.remove(email);
			return true;
		}).flatMap(isValid -> {
			if (isValid) {
				return handleSuccessfullAttempt(email).thenReturn(true);
			} else {
				return handleFailedAttempt(email).then(Mono.just(false));
			}
		});
	}

	private Mono<Void> handleSuccessfullAttempt(String username) {
		return attemptService.succeeded(username).then(sendWelcomeEmail(username));
	}

	private Mono<Void> sendWelcomeEmail(String username) {
		return this.emailService.sendWelcomeEmail(username);
	}

	private Mono<Void> handleFailedAttempt(String username) {
		return attemptService.failed(username).then(Mono.error(new InvalidCodeException()));
	}
	private Mono<Void> handleExcessiveSendEmails(String email) {
		return emailSendVericationAttemtpService.failed(email);
	}

}