package com.project.mysell.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

import com.project.mysell.repository.UserRepository;

@Configuration
public class SecurityConfiguration {

	@Bean
	SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity http,
	        JwtTokenProvider tokenProvider,
	        ReactiveAuthenticationManager reactiveAuthenticationManager) {
	    final String PATH_POSTS="/posts/**";
	    
	    return http.csrf(ServerHttpSecurity.CsrfSpec::disable)
	        .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
	        .authenticationManager(reactiveAuthenticationManager)
	        .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
	        .authorizeExchange(it->it
	            .pathMatchers(HttpMethod.GET,PATH_POSTS).permitAll()
	            .pathMatchers(HttpMethod.DELETE,PATH_POSTS).hasRole("ADMIN")
	            .pathMatchers(PATH_POSTS).authenticated()
	            .pathMatchers("/me").authenticated()
	            .anyExchange().permitAll())
	        .addFilterAt(new JwtTokenAuthenticationFilter(tokenProvider),SecurityWebFiltersOrder.HTTP_BASIC)
	        .build();
	}
	
	@Bean
	 ReactiveAuthenticationManager reactiveAuthenticationManager(ReactiveUserDetailsService userDetailsService,
	        PasswordEncoder passwordEncoder) {
	        var authenticationManager = new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
	        authenticationManager.setPasswordEncoder(passwordEncoder);
	        return authenticationManager;
	}
	@Bean
	 ReactiveUserDetailsService userDetailsService(UserRepository users){
	    return username->users.findByEmail(username)
	       .map(u -> User
	            .withUsername(u.getUsername()).password(u.getPassword())
	            .authorities(u.getAuthorities())
	            .build()
	        );
	}

}
