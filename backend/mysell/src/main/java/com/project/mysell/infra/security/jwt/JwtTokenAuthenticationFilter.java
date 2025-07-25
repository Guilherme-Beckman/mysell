package com.project.mysell.infra.security.jwt;
import org.springframework.http.HttpHeaders;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RequiredArgsConstructor
public class JwtTokenAuthenticationFilter implements WebFilter {
    private final JwtTokenProvider tokenProvider;
    public static final String HEADER_PREFIX = "Bearer ";
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = this.resolveToken(exchange.getRequest());
        if (StringUtils.hasText(token) && this.tokenProvider.validateToken(token)) {
            return Mono.fromCallable(() -> this.tokenProvider.getAuthentication(token))
                    .subscribeOn(Schedulers.boundedElastic())
                    .flatMap(authentication -> {
                        return chain.filter(exchange)
                                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
                    });
        }
        return chain.filter(exchange);
    }
    private String resolveToken(ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(HEADER_PREFIX)) {
            return bearerToken.substring(7);
        }
        return null;
    }

}	