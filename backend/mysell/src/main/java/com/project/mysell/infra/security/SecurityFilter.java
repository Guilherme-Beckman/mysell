package com.project.mysell.infra.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.project.mysell.exceptions.user.UserNotFoundException;
import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;

import reactor.core.publisher.Mono;

@Component
public class SecurityFilter implements WebFilter{
	@Autowired
	private TokenService tokenService;
	@Autowired
	private UserRepository userRepository;
	@Override
	public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain filterChain) {
		var token = this.recoverToken(exchange.getRequest());
		
        var login = tokenService.validateToken(token);

        if(login != null){
            UserModel userModel = userRepository.findByEmail(login).orElseThrow(() -> new UserNotFoundException(login));
            var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
            var authentication = new UsernamePasswordAuthenticationToken(userModel, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        return filterChain.filter(exchange);
	}
	
    private String recoverToken(ServerHttpRequest request) {
        var authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}