package com.project.mysell.service.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.auth.LoginDTO;
import com.project.mysell.dto.auth.ResponseDTO;
import com.project.mysell.dto.auth.UserDTO;
import com.project.mysell.dto.auth.email.SucessSendEmailDTO;
import com.project.mysell.dto.auth.email.VerificationCodeDTO;
import com.project.mysell.exceptions.user.UserAlreadyExistsException;
import com.project.mysell.exceptions.user.UserNotFoundException;
import com.project.mysell.infra.security.CustomAuthenticationProvider;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.UserModel;
import com.project.mysell.model.role.UserRole;
import com.project.mysell.repository.UserRepository;
import com.project.mysell.service.auth.code.EmailCodeService;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
            .map(userModel ->{
            	userModel.setRole(UserRole.EMAIL_VALID_USER);
            	userModel.setEmailValidated(true);
            	return userModel;
            })
            .flatMap(userRepository::save);
    }

    private UserDTO encodeUserPassword(UserDTO userDTO) {
        return new UserDTO(userDTO.email(), passwordEncoder.encode(userDTO.password()));
    }
    public Mono<SucessSendEmailDTO> sendVerificationCode(String email) {
            return handleEmailVerificationRequest(email);
    }

    public Mono<ResponseDTO> verifyEmailWithCode(VerificationCodeDTO verificationCode) {
           return processEmailVerification(verificationCode);
    }

    private Mono<SucessSendEmailDTO> handleEmailVerificationRequest(String email) {        
        return emailCodeService.sendVerificationCode(email);
    }

    private Mono<ResponseDTO> processEmailVerification(VerificationCodeDTO verificationCode) {
        return emailCodeService.validateCode(verificationCode.userDTO().email(), verificationCode.code())
            .flatMap(isValid -> handleCodeValidationResult(verificationCode.userDTO(), isValid));
    }

    private Mono<ResponseDTO> handleCodeValidationResult(UserDTO user, boolean isValid) {        
        return register(user);
    }



	public Mono<String> verifyIfUserAlreadyExists(@NotBlank @Email String email) {
		return this.verifyUserDoesNotExist(email).thenReturn("Tá ok! pode continuar a verificação");
	}

}