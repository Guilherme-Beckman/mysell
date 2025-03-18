package com.project.mysell.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.exceptions.unit.UnityOfMeasureNotFoundException;
import com.project.mysell.model.UnityOfMeasureModel;
import com.project.mysell.repository.UnityOfMeasureRepository;

import jakarta.annotation.PostConstruct;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UnityOfMeasureService {
	@Autowired
	private UnityOfMeasureRepository unityOfMeasureRepository;
	   private Flux<UnityOfMeasureDTO> cachedFlux;

	@PostConstruct
	public void init () {
		this.cachedFlux = 
			    this.getAllUnitsOfMeasure()
			        .map(unit -> new UnityOfMeasureDTO(unit.getName()))
			        .cache();
	}
	public Mono<UnityOfMeasureModel> createUnityOfMeasure(UnityOfMeasureDTO unityOfMeasureDTO) {
		UnityOfMeasureModel newUnityOfMeasureModel = new UnityOfMeasureModel(unityOfMeasureDTO);
		return this.unityOfMeasureRepository.save(newUnityOfMeasureModel);
	}
	public Mono<UnityOfMeasureModel> getUnityOfMeasureById(Long id) {
		return this.unityOfMeasureRepository.findById(id).
				switchIfEmpty(Mono.error(new UnityOfMeasureNotFoundException()));
	}
	public Flux<UnityOfMeasureModel> getAllUnitsOfMeasure() {
		return this.unityOfMeasureRepository.findAll();
	}

	public Mono<UnityOfMeasureModel> updateUnityOfMeasure(Long id, UnityOfMeasureDTO unityOfMeasureDTO) {
		return getUnityOfMeasureById(id)
				.flatMap(unityOfMeasure ->{
					unityOfMeasure.setName(unityOfMeasureDTO.name());
					return this.unityOfMeasureRepository.save(unityOfMeasure);
				});
	}

	public Mono<Void> deleteUnityOfMeasure(Long id) {
		return getUnityOfMeasureById(id)
				.flatMap(unityOfMeasure ->{
					return this.unityOfMeasureRepository.deleteById(id);
				});
				
	}
	public Mono<UnityOfMeasureModel> getUnityOfMeasureByName(String name){
		return this.unityOfMeasureRepository.findUnityOfMeasureByName(name);
	}

	
	public Mono<List<String>> getListUnitsName() {
	    return cachedFlux.map(unit -> unit.name()).collectList();
	}
	

}
