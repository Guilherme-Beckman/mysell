package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.LoginDTO;
import com.project.mysell.dto.ResponseDTO;
import com.project.mysell.exceptions.InvalidCredentialsException;
import com.project.mysell.exceptions.user.UserNotFoundException;
import com.project.mysell.infra.security.JwtTokenProvider;
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

    public Mono<ResponseDTO> login(LoginDTO loginDTO) {
        return this.userRepository.findByEmail(loginDTO.email())
        	/*Usar flatmap para poder aplicar operações*/
            .flatMap(userModel -> {
            	//pegar o userModel que ta dendro do mono sem interromper fluxo 
            	//comparar senhas com password encoder
                if (passwordEncoder.matches(loginDTO.password(), userModel.getPassword())) {
                    return this.reactiveAuthenticationManager
                    	//vai criar um objeto de autenticação para poder passar como parametro no createToken	
                        .authenticate(new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.password()))
                        //novamente aplicar flatmap para aplicar operações no objeto "dentro" do mono
                        .flatMap(authentication -> {
                            String token = this.tokenProvider.createToken(authentication);
                            //retorna o token por meio de um responseDto
                            return Mono.just(new ResponseDTO(userModel.getEmail(), token));
                        });
                } else {
                    return Mono.error(new InvalidCredentialsException());
                }
            })
            .switchIfEmpty(Mono.error(new UserNotFoundException(loginDTO.email())));
    }
}
