package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.UserDTO;
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
}
