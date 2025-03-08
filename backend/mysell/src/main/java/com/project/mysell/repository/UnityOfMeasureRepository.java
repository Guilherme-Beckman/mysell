package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.UnityOfMeasureModel;
@Repository
public interface UnityOfMeasureRepository extends ReactiveCrudRepository<UnityOfMeasureModel, Long>{

}
