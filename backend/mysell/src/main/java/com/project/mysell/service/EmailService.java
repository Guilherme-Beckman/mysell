package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

@Service
public class EmailService {
	@Autowired
	private JavaMailSender javaMailSender;

	public Mono<Void> sendEmail(String to, String subject, String body) {
		return Mono.fromRunnable(() -> {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(to);
			message.setSubject(subject);
			message.setText(body);
			javaMailSender.send(message);
		});
	}
}
