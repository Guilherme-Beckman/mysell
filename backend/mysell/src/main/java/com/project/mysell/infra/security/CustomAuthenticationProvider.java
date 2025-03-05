package com.project.mysell.infra.security;

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

@Component
public class CustomAuthenticationProvider implements ReactiveAuthenticationManager {
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

        return validateAccountStatus(username)
            .then(authenticateUser(username, password))
            .onErrorResume(e -> handleAuthenticationError(e, username));
    }

    private Mono<Void> validateAccountStatus(String username) {
        return Mono.defer(() -> {
            if (loginAttemptService.isBlocked(username)) {
                return Mono.error(new AccountLockedException());
            }
            return Mono.empty();
        });
    }

    private Mono<Authentication> authenticateUser(String username, String password) {
        return userDetailsService.findByUsername(username)
            .flatMap(userDetails -> validateCredentials(userDetails, password, username))
            .switchIfEmpty(Mono.defer(() -> Mono.error(new UsernameNotFoundException(username))));
    }

    private Mono<Authentication> validateCredentials(UserDetails userDetails, String rawPassword, String username) {
        return Mono.defer(() -> {
            if (!passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
                handleFailedLoginAttempt(username);
                return Mono.error(new InvalidCredentialsException());
            }
            handleSuccessfulLoginAttempt(username);
            return createAuthenticationToken(userDetails);
        });
    }

    private Mono<Authentication> createAuthenticationToken(UserDetails userDetails) {
        return Mono.just(new UsernamePasswordAuthenticationToken(
            userDetails, 
            userDetails.getPassword(), 
            userDetails.getAuthorities()
        ));
    }

    private void handleSuccessfulLoginAttempt(String username) {
        loginAttemptService.loginSucceeded(username);
    }

    private void handleFailedLoginAttempt(String username) {
        loginAttemptService.loginFailed(username);
    }

    private Mono<Authentication> handleAuthenticationError(Throwable error, String username) {
        if (error instanceof UsernameNotFoundException) {
        	Mono.error(new UsernameNotFoundException(username));
        }
        return Mono.error(error);
    }
}