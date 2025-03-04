package com.project.mysell.infra.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.ResponseDTO;
import com.project.mysell.dto.UserDTO;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;

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
import reactor.core.publisher.Mono;

@Component
public class CustomAuthenticationSuccessHandler implements ServerAuthenticationSuccessHandler {

    private static final String EMAIL_ATTRIBUTE = "email";
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private ObjectMapper objectMapper;


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
            .flatMap(token -> buildSuccessResponse(webFilterExchange.getExchange(), email, token));
    }

    private Mono<String> generateAuthenticationToken(String email, Authentication authentication) {
        return userRepository.findByEmail(email)
            .flatMap(existingUser -> generateToken(authentication))
            .switchIfEmpty(Mono.defer(() -> createNewUserAndGenerateToken(email, authentication)));
    }

    private Mono<String> generateToken(Authentication authentication) {
        return Mono.just(jwtTokenProvider.createTokenFromOAuth2(authentication));
    }

    private Mono<String> createNewUserAndGenerateToken(String email, Authentication authentication) {
        return userRepository.save(createNewUser(email))
            .flatMap(savedUser -> generateToken(authentication));
    }

    private UserModel createNewUser(String email) {
        return new UserModel(new UserDTO(email, ""));
    }

    private Mono<Void> buildSuccessResponse(ServerWebExchange exchange, String email, String token) {
        return serializeResponse(new ResponseDTO(email, token))
            .flatMap(responseBytes -> {
                exchange.getResponse().setStatusCode(HttpStatus.OK);
                exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
                return writeResponse(exchange, responseBytes);
            });
    }

    private Mono<byte[]> serializeResponse(ResponseDTO response) {
        return Mono.fromCallable(() -> objectMapper.writeValueAsBytes(response))
            .onErrorMap(JsonProcessingException.class, ex -> new RuntimeException("Error serializing response", ex));
    }

    private Mono<Void> writeResponse(ServerWebExchange exchange, byte[] responseBytes) {
        return exchange.getResponse().writeWith(
            Mono.just(exchange.getResponse().bufferFactory().wrap(responseBytes))
        );
    }

    private Mono<Void> handleAuthenticationError(ServerWebExchange exchange, Throwable error) {
        exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        return exchange.getResponse().setComplete();
    }
}