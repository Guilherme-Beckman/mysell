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
import com.project.mysell.infra.security.JwtTokenProvider;
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

    public Mono<ResponseDTO> register(UserDTO userDTO) {
    	//chama o repo pra poder verificar se existe um usuario
        return this.userRepository.findByEmail(userDTO.email())
            //se existir, ele joga um erro, mas garante que o erro segue um padrãp
        		.<ResponseDTO>flatMap(existingUser -> {
                return Mono.error(new UserAlreadyExistsException());
            })
        		//caso esteja vazio, usa um defer, que só usado caso o user esteja vazio
            .switchIfEmpty(Mono.defer(() -> {
            	//encode de senha
                UserDTO newUser = new UserDTO(userDTO.email(), passwordEncoder.encode(userDTO.password()));
                UserModel newUserModel = new UserModel(newUser);
                //salva o novo usuario
                return this.userRepository.save(newUserModel)
                		//inicia um flatmap pra lidar com o usuario novo e comecar a gerar o UsernamePasswordAuthenticationToken
                    .flatMap(savedUser -> 
                        this.reactiveAuthenticationManager
                            .authenticate(new UsernamePasswordAuthenticationToken(
                                userDTO.email(), 
                                userDTO.password()
                            ))
                            .flatMap(authentication -> {
                                String token = this.tokenProvider.createToken(authentication);
                                return Mono.just(new ResponseDTO(newUserModel.getEmail(), token));
                                })
                    );
            }));
    }
}
