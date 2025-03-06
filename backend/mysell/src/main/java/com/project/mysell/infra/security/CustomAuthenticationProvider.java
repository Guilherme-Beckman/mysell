package com.project.mysell.infra.security;

import com.project.mysell.exceptions.AccountLockedCodeException;
import com.project.mysell.exceptions.AccountLockedException;
import com.project.mysell.exceptions.InvalidCredentialsException;
import com.project.mysell.service.LoginAttemptService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class CustomAuthenticationProvider implements ReactiveAuthenticationManager {
    private static final Logger logger = LoggerFactory.getLogger(CustomAuthenticationProvider.class);

    @Autowired
    private LoginAttemptService loginAttemptService;
    @Autowired
    private CustomReactiveUserDetailsService userDetailsService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        final String username = authentication.getName();
        final String password = authentication.getCredentials().toString();

        logger.info("Iniciando autenticação para o usuário: {}", username);

        return validateAccountStatus(username)
            .then(authenticateUser(username, password))
            .onErrorResume(e -> handleAuthenticationError(e, username));
    }

    private Mono<Void> validateAccountStatus(String username) {
        return Mono.defer(() -> {
            logger.info("Validando status da conta para o usuário: {}", username);
            return loginAttemptService.isBlocked(username)
                .flatMap(isBlocked -> {
                    if (isBlocked) {
                        logger.warn("Conta bloqueada para o usuário: {}", username);
                        return Mono.error(new AccountLockedException(0)); // Ajuste o valor conforme necessário
                    }
                    return Mono.empty();
                });
        });
    }

    private Mono<Authentication> authenticateUser(String username, String password) {
        logger.info("Autenticando usuário: {}", username);
        return userDetailsService.findByUsername(username)
            .flatMap(userDetails -> validateCredentials(userDetails, password, username))
            .switchIfEmpty(Mono.defer(() -> {
                logger.warn("Usuário não encontrado: {}", username);
                return Mono.error(new UsernameNotFoundException(username));
            }));
    }

    private Mono<Authentication> validateCredentials(UserDetails userDetails, String rawPassword, String username) {
        return Mono.defer(() -> {
            if (!passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
                logger.warn("Senha inválida para o usuário: {}", username);
                return handleFailedLoginAttempt(username)
                		//assin
                .then(Mono.error(new InvalidCredentialsException()));
                
            }
            logger.info("Autenticação bem-sucedida para o usuário: {}", username);
            return handleSuccessfulLoginAttempt(username).then(createAuthenticationToken(userDetails));
        });
    }

    private Mono<Authentication> createAuthenticationToken(UserDetails userDetails) {
        return Mono.just(new UsernamePasswordAuthenticationToken(
            userDetails, 
            userDetails.getPassword(), 
            userDetails.getAuthorities()
        ));
    }

    private Mono<Void> handleSuccessfulLoginAttempt(String username) {
        logger.info("Login bem-sucedido para o usuário: {}", username);
        return loginAttemptService.succeeded(username);
    }

    private Mono<Void> handleFailedLoginAttempt(String username) {
        logger.warn("Falha no login para o usuário: {}", username);
        return loginAttemptService.failed(username);
    }


    private Mono<Authentication> handleAuthenticationError(Throwable error, String username) {
        logger.error("Erro de autenticação para o usuário: {}: {}", username, error.getMessage());
        if (error instanceof UsernameNotFoundException) {
            return Mono.error(new UsernameNotFoundException(username));
        }
        return Mono.error(error);
    }
}
