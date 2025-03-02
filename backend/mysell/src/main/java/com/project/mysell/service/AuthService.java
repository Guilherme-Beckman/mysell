package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.LoginDTO;
import com.project.mysell.dto.ResponseDTO;
import com.project.mysell.dto.UserDTO;
import com.project.mysell.exceptions.InvalidCredentialsException;
import com.project.mysell.exceptions.user.UserAlreadyExistsException;
import com.project.mysell.exceptions.user.UserNotFoundException;
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
    private ReactiveAuthenticationManager reactiveAuthenticationManager;

    @Autowired 
    private JwtTokenProvider tokenProvider;

    // Método para gerar o token e responder com o ResponseDTO
    private Mono<ResponseDTO> generateTokenAndRespond(String email, String password) {
        return this.reactiveAuthenticationManager
            .authenticate(new UsernamePasswordAuthenticationToken(email, password))
            .flatMap(authentication -> {
                String token = this.tokenProvider.createToken(authentication);
                return Mono.just(new ResponseDTO(email, token));
            });
    }

    public Mono<ResponseDTO> login(LoginDTO loginDTO) {
        return this.userRepository.findByEmail(loginDTO.email())
            .flatMap(userModel -> {
                // Comparar senhas com o password encoder
                if (passwordEncoder.matches(loginDTO.password(), userModel.getPassword())) {
                    return this.generateTokenAndRespond(loginDTO.email(), loginDTO.password());
                } else {
                    return Mono.error(new InvalidCredentialsException());
                }
            })
            .switchIfEmpty(Mono.error(new UserNotFoundException(loginDTO.email())));
    }

    public Mono<ResponseDTO> register(UserDTO userDTO) {
        // Verifica se o usuário já existe
        return this.userRepository.findByEmail(userDTO.email())
            .<ResponseDTO>flatMap(existingUser -> Mono.error(new UserAlreadyExistsException()))
            .switchIfEmpty(Mono.defer(() -> {
                // Criação do novo usuário
                UserDTO newUser = new UserDTO(userDTO.email(), passwordEncoder.encode(userDTO.password()));
                UserModel newUserModel = new UserModel(newUser);
                return this.userRepository.save(newUserModel)
                    .flatMap(savedUser -> this.generateTokenAndRespond(userDTO.email(), userDTO.password()));
            }));
    }
}
