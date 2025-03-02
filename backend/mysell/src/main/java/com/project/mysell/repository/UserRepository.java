package com.project.mysell.repository;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.project.mysell.model.UserModel;

import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<UserModel, UUID>{

	Mono<UserModel> findByEmail(String login);

}
