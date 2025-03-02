package com.project.mysell.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.project.mysell.model.UserModel;

public interface UserRepository extends ReactiveCrudRepository<UserModel, UUID>{

	Optional<UserModel> findByEmail(String login);

}
