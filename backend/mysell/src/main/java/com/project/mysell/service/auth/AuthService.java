package com.project.mysell.service.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.auth.LoginDTO;
import com.project.mysell.dto.auth.ResponseDTO;
import com.project.mysell.dto.auth.UserDTO;
import com.project.mysell.dto.auth.email.VerificationCodeDTO;
import com.project.mysell.exceptions.auth.ValidEmailException;
import com.project.mysell.exceptions.user.UserAlreadyExistsException;
import com.project.mysell.exceptions.user.UserNotFoundException;
import com.project.mysell.infra.security.CustomAuthenticationProvider;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;
import com.project.mysell.service.auth.code.EmailCodeService;

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
    public Mono<String> sendVerificationCode(String authorizationHeader) {
        final String jwtToken = jwtTokenProvider.extractJwtToken(authorizationHeader);
        final Authentication authentication = jwtTokenProvider.getAuthentication(jwtToken);

        return findUserByEmail(authentication.getName())
            .flatMap(user -> handleEmailVerificationRequest(user, authentication.getName()));
    }

    public Mono<String> verifyEmailWithCode(String authorizationHeader, VerificationCodeDTO verificationCode) {
        final String jwtToken = jwtTokenProvider.extractJwtToken(authorizationHeader);
        final Authentication authentication = jwtTokenProvider.getAuthentication(jwtToken);

        return findUserByEmail(authentication.getName())
            .flatMap(user -> processEmailVerification(user, authentication.getName(), verificationCode.code()));
    }

    private Mono<String> handleEmailVerificationRequest(UserModel user, String email) {
        if (user.isEmailValidated()) {
            return Mono.error(new ValidEmailException());
        }
        
        return emailCodeService.sendVerificationCode(email)
            .thenReturn("Verification code sent successfully");
    }

    private Mono<String> processEmailVerification(UserModel user, String email, String verificationCode) {
        if (user.isEmailValidated()) {
            return Mono.error(new ValidEmailException());
        }

        return emailCodeService.validateCode(email, verificationCode)
            .flatMap(isValid -> handleCodeValidationResult(user, isValid));
    }

    private Mono<String> handleCodeValidationResult(UserModel user, boolean isValid) {        
        return updateUserEmailValidationStatus(user)
            .thenReturn("Email verified successfully");
    }

    private Mono<UserModel> updateUserEmailValidationStatus(UserModel user) {
        user.setEmailValidated(true);
        return userRepository.save(user);
    }

}