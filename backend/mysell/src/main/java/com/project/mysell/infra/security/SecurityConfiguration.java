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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import com.project.mysell.infra.security.jwt.JwtTokenAuthenticationFilter;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;

@Configuration
public class SecurityConfiguration {
    
    @Bean
    CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(true);
        corsConfig.addAllowedOriginPattern("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.addAllowedMethod("*");
        corsConfig.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
    
    @Bean
    SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity http,
            JwtTokenProvider tokenProvider,
            CustomAuthenticationProvider authenticationProvider, 
            CustomAuthenticationSuccessHandler successHandler) {
        
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowCredentials(true);
                config.addAllowedOriginPattern("*");
                config.addAllowedHeader("*");
                config.addAllowedMethod("*");
                return config;
            }))
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
            .authenticationManager(authenticationProvider)
            .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
            .oauth2Login(oauth2 -> oauth2.authenticationSuccessHandler(successHandler))
            .authorizeExchange(it -> it
                .pathMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .pathMatchers(HttpMethod.GET, "/auth/login").permitAll()
                .pathMatchers(HttpMethod.OPTIONS, "/auth/login").permitAll() 
                .pathMatchers(HttpMethod.POST, "/auth/register").permitAll()
                .pathMatchers(HttpMethod.OPTIONS, "/auth/register").permitAll() 
                .pathMatchers(HttpMethod.POST, "/category").hasAuthority("ADMIN")
                .pathMatchers(HttpMethod.PUT, "/category").hasAuthority("ADMIN")
                .pathMatchers(HttpMethod.DELETE, "/category").hasAuthority("ADMIN")
                .pathMatchers(HttpMethod.POST, "/unity").hasAuthority("ADMIN")
                .pathMatchers(HttpMethod.PUT, "/unity").hasAuthority("ADMIN")
                .pathMatchers(HttpMethod.DELETE, "/unity").hasAuthority("ADMIN")
                .pathMatchers(HttpMethod.GET, "/product").hasAuthority("ADMIN")
                .pathMatchers(HttpMethod.GET, "/sell").hasAuthority("ADMIN")
                .pathMatchers(HttpMethod.GET, "/event").hasAuthority("ADMIN")
                .anyExchange().authenticated())
            .addFilterAt(new JwtTokenAuthenticationFilter(tokenProvider), SecurityWebFiltersOrder.HTTP_BASIC)
            .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}