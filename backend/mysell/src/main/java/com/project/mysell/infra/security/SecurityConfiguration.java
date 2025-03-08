package com.project.mysell.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
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
	        CustomAuthenticationProvider authenticationProvider, CustomAuthenticationSuccessHandler successHandler) {
	    
	    return http
	    	.oauth2Login(oauth2 -> oauth2.authenticationSuccessHandler(successHandler))
	    	.csrf(ServerHttpSecurity.CsrfSpec::disable)
	        .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
	        .authenticationManager(authenticationProvider)
	        .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
	        .authorizeExchange(it->it
	        		 .pathMatchers(HttpMethod.POST, "/auth/login").permitAll()
	        		 .pathMatchers(HttpMethod.GET, "/auth/login").permitAll()
	                 .pathMatchers(HttpMethod.POST, "/auth/register").permitAll()
	                 .pathMatchers(HttpMethod.GET, "/category").permitAll()
	                 .pathMatchers(HttpMethod.POST, "/category").hasAuthority("ADMIN")
	                 .pathMatchers(HttpMethod.PUT, "/category").hasAuthority("ADMIN")
	                 .pathMatchers(HttpMethod.DELETE, "/category").hasAuthority("ADMIN")
	                 .pathMatchers(HttpMethod.GET, "/unity").permitAll()
	                 .pathMatchers(HttpMethod.POST, "/unity").hasAuthority("ADMIN")
	                 .pathMatchers(HttpMethod.PUT, "/unity").hasAuthority("ADMIN")
	                 .pathMatchers(HttpMethod.DELETE, "/unity").hasAuthority("ADMIN")
	        .anyExchange().authenticated())
	        .addFilterAt(new JwtTokenAuthenticationFilter(tokenProvider),SecurityWebFiltersOrder.HTTP_BASIC)
	        .build();
	}
	

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    


    }
    

  
    
