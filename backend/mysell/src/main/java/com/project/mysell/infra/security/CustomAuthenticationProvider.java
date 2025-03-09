package com.project.mysell.infra.security;

import com.project.mysell.exceptions.AccountLockedException;
import com.project.mysell.exceptions.InvalidCredentialsException;
import com.project.mysell.service.LoginAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class CustomAuthenticationProvider implements ReactiveAuthenticationManager {

    @Autowired
    private LoginAttemptService loginAttemptService;
    @Autowired
    private ReactiveUserDetailsService userDetailsService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        final String username = authentication.getName();
        final String password = authentication.getCredentials().toString();
        return verifyAccountNotLocked(username)
            .then(authenticateWithCredentials(username, password))
            .onErrorResume(e -> handleAuthenticationFailure(e, username));
    }

    private Mono<Void> verifyAccountNotLocked(String username) {
        return Mono.defer(() -> {
            return loginAttemptService.isBlocked(username)
                .flatMap(isBlocked -> {
                    return Mono.empty();
                });
        });
    }

    private Mono<Authentication> authenticateWithCredentials(String username, String password) {
        return userDetailsService.findByUsername(username)
            .switchIfEmpty(Mono.defer(() -> {
                return handleUserNotFound(username);
            }))
            .flatMap(user -> validateUserCredentials(user, password, username));
    }

    private Mono<UserDetails> handleUserNotFound(String username) {
        return Mono.error(new UsernameNotFoundException(username));
    }

    private Mono<Authentication> validateUserCredentials(UserDetails user, String rawPassword, String username) {
        return Mono.fromCallable(() -> passwordEncoder.matches(rawPassword, user.getPassword()))
            .flatMap(passwordMatches -> {
                if (!passwordMatches) {
                    return handleInvalidPassword(username);
                }
                return handleSuccessfulAuthentication(user, username);
            });
    }

    private Mono<Authentication> handleInvalidPassword(String username) {
        return loginAttemptService.failed(username)
            .then(Mono.error(new InvalidCredentialsException()));
    }

    private Mono<Authentication> handleSuccessfulAuthentication(UserDetails user, String username) {
        return loginAttemptService.succeeded(username)
            .then(Mono.just(createAuthenticationToken(user)));
    }

    private UsernamePasswordAuthenticationToken createAuthenticationToken(UserDetails user) {
        return new UsernamePasswordAuthenticationToken(
            user,
            user.getPassword(),
            user.getAuthorities()
        );
    }

    private Mono<Authentication> handleAuthenticationFailure(Throwable error, String username) {
        if (error instanceof AccountLockedException) {
            return Mono.error(error);
        }
        return Mono.error(new InvalidCredentialsException());
    }
}
