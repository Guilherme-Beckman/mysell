package com.project.mysell.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project.mysell.dto.auth.ResponseDTO;
import com.project.mysell.dto.auth.UserDTO;
import com.project.mysell.dto.category.LoginDTO;
import com.project.mysell.exceptions.auth.credential.InvalidCredentialsException;
import com.project.mysell.exceptions.user.UserAlreadyExistsException;
import com.project.mysell.infra.security.CustomAuthenticationProvider;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;
import com.project.mysell.service.auth.AuthService;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CustomAuthenticationProvider reactiveAuthenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // --- Login Tests ---

    @Test
    public void testLoginSuccessful() {
        String email = "test@example.com";
        String password = "password";
        String encodedPassword = "encodedPassword";
        LoginDTO loginDTO = new LoginDTO(email, password);
        
        UserModel userModel = new UserModel();
        userModel.setEmail(email);
        userModel.setPassword(encodedPassword);
        
        when(userRepository.findByEmail(email)).thenReturn(Mono.just(userModel));
        when(passwordEncoder.matches(password, encodedPassword)).thenReturn(true);
        
        Authentication auth = new UsernamePasswordAuthenticationToken(email, password);
        when(reactiveAuthenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(Mono.just(auth));
        String token = "jwtToken";
        when(tokenProvider.createToken(auth)).thenReturn(token);
        
        Mono<ResponseDTO> responseMono = authService.login(loginDTO);
        
        StepVerifier.create(responseMono)
            .expectNextMatches(responseDTO -> 
                responseDTO.name().equals(email) && responseDTO.token().equals(token))
            .verifyComplete();
    }

    @Test
    public void testLoginInvalidPassword() {
        String email = "test@example.com";
        String password = "wrongPassword";
        String encodedPassword = "encodedPassword";
        LoginDTO loginDTO = new LoginDTO(email, password);
        
        UserModel userModel = new UserModel();
        userModel.setEmail(email);
        userModel.setPassword(encodedPassword);
        
        when(userRepository.findByEmail(email)).thenReturn(Mono.just(userModel));
        when(passwordEncoder.matches(password, encodedPassword)).thenReturn(false);
        
        Mono<ResponseDTO> responseMono = authService.login(loginDTO);
        
        StepVerifier.create(responseMono)
            .expectError(InvalidCredentialsException.class)
            .verify();
    }

    @Test
    public void testRegisterUserAlreadyExists() {
        String email = "existing@example.com";
        String password = "password";
        UserDTO userDTO = new UserDTO(email, password);
        
        UserModel existingUser = new UserModel();
        existingUser.setEmail(email);
        
        when(userRepository.findByEmail(email)).thenReturn(Mono.just(existingUser));
        
        Mono<ResponseDTO> responseMono = authService.register(userDTO);
        
        StepVerifier.create(responseMono)
            .expectError(UserAlreadyExistsException.class)
            .verify();
    }

    @Test
    public void testRegisterSuccessful() {
        String email = "newuser@example.com";
        String password = "password";
        String encodedPassword = "encodedPassword";
        UserDTO userDTO = new UserDTO(email, password);
        
        when(userRepository.findByEmail(email)).thenReturn(Mono.empty());
        when(passwordEncoder.encode(password)).thenReturn(encodedPassword);
        
        // Simulate saving the new user
        UserModel newUserModel = new UserModel();
        newUserModel.setEmail(email);
        newUserModel.setPassword(encodedPassword);
        when(userRepository.save(any(UserModel.class))).thenReturn(Mono.just(newUserModel));
        
        // Simulate the reactive authentication flow after registration
        Authentication auth = new UsernamePasswordAuthenticationToken(email, password);
        when(reactiveAuthenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(Mono.just(auth));
        String token = "jwtToken";
        when(tokenProvider.createToken(auth)).thenReturn(token);
        
        Mono<ResponseDTO> responseMono = authService.register(userDTO);
        
        StepVerifier.create(responseMono)
            .expectNextMatches(responseDTO -> 
                responseDTO.name().equals(email) && responseDTO.token().equals(token))
            .verifyComplete();
    }
}
