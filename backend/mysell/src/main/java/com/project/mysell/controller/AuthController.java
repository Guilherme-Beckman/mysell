package com.project.mysell.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.LoginDTO;
import com.project.mysell.dto.ResponseDTO;
import com.project.mysell.dto.UserDTO;
import com.project.mysell.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
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
}