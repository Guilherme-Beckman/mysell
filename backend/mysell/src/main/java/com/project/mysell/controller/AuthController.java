package com.project.mysell.controller;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.auth.LoginDTO;
import com.project.mysell.dto.auth.ResponseDTO;
import com.project.mysell.dto.auth.UserDTO;
import com.project.mysell.dto.auth.email.VerificationCodeDTO;
import com.project.mysell.service.auth.AuthService;

import jakarta.validation.Valid;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	private AuthService authService;
	@PostMapping("/login")
	public ResponseEntity<Mono<ResponseDTO>> login(@Valid @RequestBody LoginDTO loginDTO){
		Mono<ResponseDTO> responseDTO =this.authService.login(loginDTO);
		return ResponseEntity.ok().body(responseDTO);
	}
	@PostMapping("/register")
	public ResponseEntity<Mono<ResponseDTO>> register(@Valid  @RequestBody UserDTO userDTO){
		Mono<ResponseDTO> responseDTO =this.authService.register(userDTO);
		return ResponseEntity.ok().body(responseDTO);
	}	
	@GetMapping("/login")
	public String login(){
		return "Sucess";
	}
	@GetMapping("/sendCode")
	public ResponseEntity<Mono<String>> sendCode(@Valid @RequestHeader("Authorization") String token){
		Mono<String> sucessMessage = this.authService.sendVerificationCode(token);
		return ResponseEntity.ok().body(sucessMessage);
	}
	@PostMapping("/verify")
	public ResponseEntity<Mono<String>> verifyEmail(@Valid @RequestHeader("Authorization") String token, @RequestBody VerificationCodeDTO verificationCodeDTO){
		Mono<String> sucessMessage = this.authService.verifyEmailWithCode(token, verificationCodeDTO);
		return ResponseEntity.ok().body(sucessMessage);
	}
	
}