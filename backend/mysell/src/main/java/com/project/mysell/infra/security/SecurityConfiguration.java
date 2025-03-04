package com.project.mysell.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

import com.project.mysell.infra.security.jwt.JwtTokenAuthenticationFilter;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
@Configuration
public class SecurityConfiguration {
	@Bean
	SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity http,
	        JwtTokenProvider tokenProvider,
	        ReactiveAuthenticationManager reactiveAuthenticationManager, CustomAuthenticationSuccessHandler successHandler) {
	    
	    return http
	    	.oauth2Login(oauth2 -> oauth2.authenticationSuccessHandler(successHandler))
	    	.csrf(ServerHttpSecurity.CsrfSpec::disable)
	        .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
	        .authenticationManager(reactiveAuthenticationManager)
	        .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
	        .authorizeExchange(it->it
	        		 .pathMatchers(HttpMethod.POST, "/auth/login").permitAll()
	                 .pathMatchers(HttpMethod.POST, "/auth/register").permitAll()
	        .anyExchange().authenticated())
	        .addFilterBefore(new JwtTokenAuthenticationFilter(tokenProvider),SecurityWebFiltersOrder.HTTP_BASIC)
	        .build();
	}
	

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    ReactiveAuthenticationManager reactiveAuthenticationManager(
            ReactiveUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
            var authenticationManager = new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
            authenticationManager.setPasswordEncoder(passwordEncoder);
            return authenticationManager;
        };


    }
    

  
    
