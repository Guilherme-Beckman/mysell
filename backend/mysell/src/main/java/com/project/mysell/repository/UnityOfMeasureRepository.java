package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.UnityOfMeasureModel;

import reactor.core.publisher.Mono;
@Repository
public interface UnityOfMeasureRepository extends ReactiveCrudRepository<UnityOfMeasureModel, Long>{

	Mono<UnityOfMeasureModel> findUnityOfMeasureByName(String name);

}
