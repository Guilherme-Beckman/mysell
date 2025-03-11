package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.exceptions.unit.UnityOfMeasureNotFoundException;
import com.project.mysell.model.UnityOfMeasureModel;
import com.project.mysell.repository.UnityOfMeasureRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UnityOfMeasureService {
	@Autowired
	private UnityOfMeasureRepository unityOfMeasureRepository;

	public Mono<UnityOfMeasureModel> createUnityOfMeasure(UnityOfMeasureDTO unityOfMeasureDTO) {
		UnityOfMeasureModel newUnityOfMeasureModel = new UnityOfMeasureModel(unityOfMeasureDTO);
		return this.unityOfMeasureRepository.save(newUnityOfMeasureModel);
	}
	public Mono<UnityOfMeasureModel> getUnityOfMeasureById(Long id) {
		return this.unityOfMeasureRepository.findById(id);
	}
	public Flux<UnityOfMeasureModel> getAllUnitsOfMeasure() {
		return this.unityOfMeasureRepository.findAll();
	}

	public Mono<UnityOfMeasureModel> updateUnityOfMeasure(Long id, UnityOfMeasureDTO unityOfMeasureDTO) {
		return this.unityOfMeasureRepository.findById(id)
				.flatMap(unityOfMeasure ->{
					unityOfMeasure.setName(unityOfMeasureDTO.name());
					return this.unityOfMeasureRepository.save(unityOfMeasure);
				})
				.switchIfEmpty(Mono.error(new UnityOfMeasureNotFoundException()));
	}

	public Mono<Void> deleteUnityOfMeasure(Long id) {
		return this.unityOfMeasureRepository.findById(id)
				.switchIfEmpty(Mono.error(new UnityOfMeasureNotFoundException()))
				.flatMap(unityOfMeasure ->{
					return this.unityOfMeasureRepository.deleteById(id);
				});
				
	}

}
