package com.project.mysell.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.project.mysell.dto.LoginDTO;
import com.project.mysell.dto.ResponseDTO;
import com.project.mysell.dto.UserDTO;
import com.project.mysell.dto.VerificationCodeDTO;
import com.project.mysell.exceptions.InvalidCredentialsException;
import com.project.mysell.exceptions.user.UserAlreadyExistsException;
import com.project.mysell.exceptions.user.UserNotFoundException;
import com.project.mysell.infra.security.CustomAuthenticationProvider;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;

import reactor.core.publisher.Mono;

@Service
public class AuthService {

	@Autowired
    private UserRepository userRepository;
	@Autowired
    private PasswordEncoder passwordEncoder;
	@Autowired
    private CustomAuthenticationProvider authenticationManager;
	@Autowired
    private JwtTokenProvider jwtTokenProvider;
	@Autowired
	private EmailCodeService emailCodeService;


    public Mono<ResponseDTO> login(LoginDTO loginDTO) {
        return findUserByEmail(loginDTO.email())
            .flatMap(user -> authenticateUser(loginDTO))
            .switchIfEmpty(Mono.error(new UserNotFoundException(loginDTO.email())));
    }

    public Mono<ResponseDTO> register(UserDTO userDTO) {
        return verifyUserDoesNotExist(userDTO.email())
            .then(createAndSaveUser(userDTO))
            .flatMap(savedUser -> authenticateUser(userDTO));
    }

    private Mono<ResponseDTO> authenticateUser(UserDTO userDTO) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password()))
            .flatMap(authentication -> generateAuthenticationResponse(authentication, userDTO.email()));
    }
    private Mono<ResponseDTO> authenticateUser(LoginDTO userDTO) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password()))
            .flatMap(authentication -> generateAuthenticationResponse(authentication, userDTO.email()));
    }

    private Mono<UserModel> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    private Mono<ResponseDTO> generateAuthenticationResponse(Authentication authentication, String email) {
        return Mono.fromCallable(() -> jwtTokenProvider.createToken(authentication))
            .map(token -> new ResponseDTO(email, token));
    }

    private Mono<Void> verifyUserDoesNotExist(String email) {
        return userRepository.findByEmail(email)
            .flatMap(existingUser -> Mono.error(new UserAlreadyExistsException()))
            .then();
    }

    private Mono<UserModel> createAndSaveUser(UserDTO userDTO) {
        return Mono.just(userDTO)
            .map(this::encodeUserPassword)
            .map(UserModel::new)
            .flatMap(userRepository::save);
    }

    private UserDTO encodeUserPassword(UserDTO userDTO) {
        return new UserDTO(userDTO.email(), passwordEncoder.encode(userDTO.password()));
    }
    public Mono<String> sendCode(String token) {
        String extractedToken = extractToken(token);
        var authentication = this.jwtTokenProvider.getAuthentication(extractedToken);
        return this.emailCodeService.sendVerificationCode(authentication.getName())
            .thenReturn("Code sent successfully");
    }

    public Mono<String> verifyEmail(String token, VerificationCodeDTO verificationCodeDTO) {
        String extractedToken = extractToken(token);
        var authentication = this.jwtTokenProvider.getAuthentication(extractedToken);
        return this.emailCodeService.validateCode(authentication.getName(), verificationCodeDTO.code())
            .thenReturn("Email verified successfully");
    }

    private String extractToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        throw new IllegalArgumentException("Invalid token format");
    }


}