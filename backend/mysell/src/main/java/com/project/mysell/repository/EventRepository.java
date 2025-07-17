package com.project.mysell.repository;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.project.mysell.model.EventModel;

import reactor.core.publisher.Flux;

public interface EventRepository extends ReactiveCrudRepository<EventModel, Long>{
	Flux<EventModel> findAllByUserId (UUID userId);
}
