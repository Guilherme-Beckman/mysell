package com.project.mysell.service;
import reactor.core.publisher.Mono;

public interface EmailService {
    Mono<Void> sendEmail (String to, String subject, String htmlBody);
}
