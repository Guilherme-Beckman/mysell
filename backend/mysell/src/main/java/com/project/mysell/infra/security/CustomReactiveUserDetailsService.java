package com.project.mysell.infra.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
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
	    return this.userRepository.findByEmail(username)
	        .map(u -> (UserDetails) new CustomUserDetails(
	            u.getUsersId(), 
	            u.getEmail(),
	            u.getPassword(),
	            u.getRole()))
	        .switchIfEmpty(Mono.error(new UserNotFoundException(username)));
	}

}
