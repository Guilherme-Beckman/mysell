package com.project.mysell;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;

import com.project.mysell.exceptions.validation.ValidationException;
import com.project.mysell.infra.security.CustomAuthenticationSuccessHandler;
import com.project.mysell.repository.UserRepository;
import com.project.mysell.service.EmailService;
import com.project.mysell.service.auth.AuthService;
import com.project.mysell.service.auth.attempt.AttemptService;
import com.project.mysell.service.auth.attempt.LoginAttemptService;
import com.project.mysell.service.auth.code.CodeVerificationAttemptService;
import com.project.mysell.service.auth.code.EmailCodeService;


@TestConfiguration
    public class MockConfig {
        @Bean
        AuthService authService() {
            return Mockito.mock(AuthService.class);
        }
        @Bean
        UserRepository userRepository() {
        	return Mockito.mock(UserRepository.class);
        }
        @Bean
        ValidationException validationException() {
        	return Mockito.mock(ValidationException.class);
        }
        @Bean
        CustomAuthenticationSuccessHandler authenticationSuccessHandler() {
        	return Mockito.mock(CustomAuthenticationSuccessHandler.class);
        }
        @Bean
        LoginAttemptService loginAttemptService() {
        	return Mockito.mock(LoginAttemptService.class);
        }
        @Bean
        EmailCodeService codeService() {
        	return Mockito.mock(EmailCodeService.class);
        }
        @Bean
        AttemptService attemptService() {
        	return Mockito.mock(AttemptService.class);
        }
        @Bean
        CodeVerificationAttemptService verificationAttemptService() {
        	return Mockito.mock(CodeVerificationAttemptService.class);
        }
        @Bean
        EmailService emailService() {
        	return Mockito.mock(EmailService.class);
        }
        @Bean
        JavaMailSender javaMailSender() {
        	return Mockito.mock(JavaMailSender.class);
        }
}


        
        
        