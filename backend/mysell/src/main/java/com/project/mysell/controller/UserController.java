package com.project.mysell.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.UserDTO;
import com.project.mysell.model.UserModel;
import com.project.mysell.service.UserService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userService;
	
	@PostMapping("/create")
	public ResponseEntity<Mono<UserModel>> createUser(@RequestBody UserDTO userDTO) {
		var user = this.userService.createUser(userDTO);
		return ResponseEntity.ok().body(user);
	}
	
}
