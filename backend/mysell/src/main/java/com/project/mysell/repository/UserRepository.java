package com.project.mysell.repository;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.UserModel;

import reactor.core.publisher.Mono;
@Repository
public interface UserRepository extends ReactiveCrudRepository<UserModel, UUID>{

	Mono<UserModel> findByEmail(String login);

}
