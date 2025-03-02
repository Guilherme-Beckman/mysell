package com.project.mysell.controller;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.webauthn.authentication.WebAuthnAuthenticationRequestToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.infra.security.JwtTokenProvider;

import jakarta.validation.Valid;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Valid
public class AuthController {
    private final JwtTokenProvider tokenProvider;
    private final ReactiveAuthenticationManager authenticationManager;

    @PostMapping("/login")
    public Mono<ResponseEntity> login(
            @Valid @RequestBody Mono<WebAuthnAuthenticationRequestToken> authRequest) {

        return authRequest
                .flatMap(login -> this.authenticationManager
                        .authenticate(new UsernamePasswordAuthenticationToken(
                                login.getName(), login.getCredentials()))
                        .map(this.tokenProvider::createToken))
                .map(jwt -> {
                    HttpHeaders httpHeaders = new HttpHeaders();
                    httpHeaders.add(HttpHeaders.AUTHORIZATION, "Bearer " + jwt);
                    var tokenBody = Map.of("access_token", jwt);
                    return new ResponseEntity<>(tokenBody, httpHeaders, HttpStatus.OK);
                });
    }
}