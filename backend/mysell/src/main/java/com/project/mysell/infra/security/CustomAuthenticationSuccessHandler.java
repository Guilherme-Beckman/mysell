package com.project.mysell.infra.security;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;

import com.project.mysell.dto.auth.UserDTO;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;

import reactor.core.publisher.Mono;

@Component
public class CustomAuthenticationSuccessHandler implements ServerAuthenticationSuccessHandler {

    private static final String EMAIL_ATTRIBUTE = "email";
    private static final String APP_CALLBACK = "mysell://callback";
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public Mono<Void> onAuthenticationSuccess(WebFilterExchange webFilterExchange, Authentication authentication) {
        OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oauth2Token.getPrincipal();
        String email = oauth2User.getAttribute(EMAIL_ATTRIBUTE);

        return processUserAuthentication(webFilterExchange, email, authentication)
                .onErrorResume(e -> handleAuthenticationError(webFilterExchange.getExchange(), e));
    }

    private Mono<Void> processUserAuthentication(WebFilterExchange webFilterExchange,
                                                   String email,
                                                   Authentication authentication) {
        return generateAuthenticationToken(email, authentication)
                .flatMap(token -> redirectToLogin(webFilterExchange.getExchange(), token));
    }

    private Mono<String> generateAuthenticationToken(String email, Authentication authentication) {
        return userRepository.findByEmail(email)
                .flatMap(existingUser -> createToken(authentication))
                .switchIfEmpty(Mono.defer(() -> createNewUserAndGenerateToken(email, authentication)));
    }

    private Mono<String> createToken(Authentication authentication) {
        return jwtTokenProvider.createTokenFromOAuth2(authentication);
    }

    private Mono<String> createNewUserAndGenerateToken(String email, Authentication authentication) {
        return userRepository.save(newUser(email))
                .flatMap(savedUser -> createToken(authentication));
    }

    private UserModel newUser(String email) {
        return new UserModel(new UserDTO(email, ""));
    }

    private Mono<Void> redirectToLogin(ServerWebExchange exchange, String token) {
        URI redirectUri = UriComponentsBuilder
                    .fromUriString(APP_CALLBACK)
                    .queryParam("token", token)
                    .build()
                    .toUri();

        exchange.getResponse().setStatusCode(HttpStatus.FOUND);
        exchange.getResponse().getHeaders().setLocation(redirectUri);
        return exchange.getResponse().setComplete();
    }

    private Mono<Void> handleAuthenticationError(ServerWebExchange exchange, Throwable error) {
        exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        return exchange.getResponse().setComplete();
    }
}
