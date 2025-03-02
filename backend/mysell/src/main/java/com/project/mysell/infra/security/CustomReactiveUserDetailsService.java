package com.project.mysell.infra.security;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.project.mysell.exceptions.user.UserNotFoundException;
import com.project.mysell.repository.UserRepository;

import reactor.core.publisher.Mono;
@Service
public class CustomReactiveUserDetailsService implements ReactiveUserDetailsService{
	@Autowired
	private UserRepository userRepository;
	@Override
	public Mono<UserDetails> findByUsername(String username) {
		return this.userRepository.findByEmail(username).
				map(u -> User 
						.withUsername(u.getEmail())
						.password(u.getPassword())
						.authorities(new ArrayList<>())
						.build())
				.switchIfEmpty(Mono.error(new UserNotFoundException(username)))
				;
	}

}
