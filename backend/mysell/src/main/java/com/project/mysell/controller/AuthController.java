package com.project.mysell.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.LoginDTO;
import com.project.mysell.service.AuthService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	@Autowired
	private AuthService authService;
	
	public ResponseEntity<Mono<String>> login(LoginDTO loginDTO){
		String token =this.authService.login(loginDTO);
		return ResponseEntity.ok().body(Mono<>);
	}
}