package com.project.mysell.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.auth.UserDTO;
import com.project.mysell.exceptions.user.UserNotFoundException;
import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;

import reactor.core.publisher.Mono;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;
	
	public Mono<UserModel> createUser(UserDTO userDTO) {
		UserModel newUser = new UserModel(userDTO);
		var addedUser = this.userRepository.save(newUser);
		return addedUser;
	}
	public Mono<UserModel> getUserById(UUID userId) {
		return this.userRepository.findById(userId)
				.switchIfEmpty(Mono.error(new UserNotFoundException()));
	}
}
