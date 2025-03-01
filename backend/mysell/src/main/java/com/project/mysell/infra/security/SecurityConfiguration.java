package com.project.mysell.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfiguration {
	@Autowired
	private SecurityFilter securityFilter;

	@Bean
	SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity http) {
		http
			.cors(Customizer.withDefaults())
			.csrf(csrf -> csrf.disable())
			.authorizeExchange((authorize) -> authorize                          
				.pathMatchers("/resources/**", "/signup", "/about").permitAll()  
				.anyExchange().denyAll()                                         
			)
			.addFilterBefore(securityFilter, SecurityWebFiltersOrder.AUTHENTICATION);
		return http.build();
	}
	
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
