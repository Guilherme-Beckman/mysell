package com.project.mysell.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.auth.LoginDTO;
import com.project.mysell.dto.auth.ResponseDTO;
import com.project.mysell.dto.auth.UserDTO;
import com.project.mysell.dto.auth.email.SucessSendEmailDTO;
import com.project.mysell.dto.auth.email.VerificationCodeDTO;
import com.project.mysell.service.auth.AuthService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

	@GetMapping("/sendCode/{email}")
	public ResponseEntity<Mono<SucessSendEmailDTO>> sendCode(@Email @NotBlank @PathVariable String email){
		Mono<SucessSendEmailDTO> sucessSendEmailDTO = this.authService.sendVerificationCode(email);
		return ResponseEntity.ok().body(sucessSendEmailDTO);
	}
	@PostMapping("/verify")
	public ResponseEntity<Mono<ResponseDTO>> verifyEmail(@RequestBody VerificationCodeDTO verificationCodeDTO){
		Mono<ResponseDTO> sucessMessage = this.authService.verifyEmailWithCode(verificationCodeDTO);
		return ResponseEntity.ok().body(sucessMessage);
	}
	@GetMapping("/userExists/{email}")
	public ResponseEntity<Mono<String>> verifyIfUserAlreadyExists(@NotBlank @Email @PathVariable String email){
		Mono<String> sucessMessage = this.authService.verifyIfUserAlreadyExists(email);
		return ResponseEntity.ok().body(sucessMessage);
	}
}