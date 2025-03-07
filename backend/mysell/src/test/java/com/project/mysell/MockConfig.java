package com.project.mysell;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import com.project.mysell.exceptions.ValidationException;
import com.project.mysell.infra.security.CustomAuthenticationProvider;
import com.project.mysell.infra.security.CustomAuthenticationSuccessHandler;
import com.project.mysell.infra.security.CustomReactiveUserDetailsService;
import com.project.mysell.repository.UserRepository;
import com.project.mysell.service.AuthService;
import com.project.mysell.service.LoginAttemptService;

@TestConfiguration
    public class MockConfig {
        @Bean
        public AuthService authService() {
            return Mockito.mock(AuthService.class);
        }
        @Bean
        public UserRepository userRepository() {
        	return Mockito.mock(UserRepository.class);
        }
        @Bean
        public ValidationException validationException() {
        	return Mockito.mock(ValidationException.class);
        }
        @Bean
        public CustomAuthenticationSuccessHandler authenticationSuccessHandler() {
        	return Mockito.mock(CustomAuthenticationSuccessHandler.class);
        }
        @Bean
        public CustomAuthenticationProvider authenticationProvider() {
        	return Mockito.mock(CustomAuthenticationProvider.class);
        }
        @Bean
        public LoginAttemptService loginAttemptService() {
        	return Mockito.mock(LoginAttemptService.class);
        }
}

        
        
        