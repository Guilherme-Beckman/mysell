package com.project.mysell.service;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.exceptions.unit.UnityOfMeasureNotFoundException;
import com.project.mysell.infra.redis.RedisService;
import com.project.mysell.model.UnityOfMeasureModel;
import com.project.mysell.repository.UnityOfMeasureRepository;

import jakarta.annotation.PostConstruct;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UnityOfMeasureService {
    @Autowired
    private UnityOfMeasureRepository unityOfMeasureRepository;
    
    @Autowired
    private RedisService redisService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private static final Duration CACHE_TTL = Duration.ofDays(1);
    private static final String ALL_UNITS_CACHE_KEY = "units:all";
    
    private String getUnitCacheKey(Long id) {
        return "unit:" + id;
    }
    
    private String getUnitByNameCacheKey(String name) {
        return "unit:name:" + name;
    }
    
    private Flux<UnityOfMeasureDTO> cachedFlux;
    
    @PostConstruct
    public void init() {
        this.cachedFlux = this.getAllUnitsOfMeasure()
            .map(unit -> new UnityOfMeasureDTO(unit.getName()))
            .cache();
            
        this.unityOfMeasureRepository.findAll()
            .collectList()
            .flatMap(units -> redisService.setValueWithExpiration(ALL_UNITS_CACHE_KEY, units, CACHE_TTL.getSeconds()))
            .subscribe();
    }
    
    public Mono<UnityOfMeasureModel> createUnityOfMeasure(UnityOfMeasureDTO unityOfMeasureDTO) {
        UnityOfMeasureModel newUnityOfMeasureModel = new UnityOfMeasureModel(unityOfMeasureDTO);
        return this.unityOfMeasureRepository.save(newUnityOfMeasureModel)
            .flatMap(savedUnit -> 
                // Armazena a nova unidade no cache
                cacheUnit(savedUnit)
                    // Invalida o cache de todas as unidades
                    .then(redisService.deleteKey(ALL_UNITS_CACHE_KEY))
                    .thenReturn(savedUnit)
            );
    }
    
    public Mono<UnityOfMeasureModel> getUnityOfMeasureById(Long id) {
        String cacheKey = getUnitCacheKey(id);
        return redisService.getValue(cacheKey)
            .flatMap(value -> {
                if (value instanceof UnityOfMeasureModel) {
                    return Mono.just((UnityOfMeasureModel) value);
                } else if (value instanceof Map) {
                    UnityOfMeasureModel unit = objectMapper.convertValue(value, UnityOfMeasureModel.class);
                    return Mono.just(unit);
                }
                return Mono.empty();
            })
            .switchIfEmpty(
                this.unityOfMeasureRepository.findById(id)
                    .switchIfEmpty(Mono.error(new UnityOfMeasureNotFoundException()))
                    .flatMap(unit -> 
                        redisService.setValueWithExpiration(cacheKey, unit, CACHE_TTL.getSeconds())
                            .thenReturn(unit)
                    )
            );
    }
    
    public Flux<UnityOfMeasureModel> getAllUnitsOfMeasure() {
        return redisService.getValue(ALL_UNITS_CACHE_KEY)
            .flatMapMany(value -> {
                if (value instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Object> list = (List<Object>) value;
                    return Flux.fromIterable(list)
                        .map(item -> {
                            if (item instanceof UnityOfMeasureModel) {
                                return (UnityOfMeasureModel) item;
                            } else if (item instanceof Map) {
                                return objectMapper.convertValue(item, UnityOfMeasureModel.class);
                            }
                            return null;
                        })
                        .filter(unit -> unit != null);
                }
                return Flux.empty();
            })
            .switchIfEmpty(
                this.unityOfMeasureRepository.findAll()
                    .collectList()
                    .flatMap(units -> 
                        redisService.setValueWithExpiration(ALL_UNITS_CACHE_KEY, units, CACHE_TTL.getSeconds())
                            .thenReturn(units)
                    )
                    .flatMapMany(Flux::fromIterable)
            );
    }
    
    public Mono<UnityOfMeasureModel> updateUnityOfMeasure(Long id, UnityOfMeasureDTO unityOfMeasureDTO) {
        return getUnityOfMeasureById(id)
            .flatMap(unityOfMeasure -> {
                unityOfMeasure.setName(unityOfMeasureDTO.name());
                return this.unityOfMeasureRepository.save(unityOfMeasure)
                    .flatMap(updatedUnit -> 
                        // Atualiza a unidade no cache
                        cacheUnit(updatedUnit)
                            // Invalida o cache por nome se o nome mudou
                            .then(redisService.deleteKey(getUnitByNameCacheKey(unityOfMeasureDTO.name())))
                            // Invalida o cache de todas as unidades
                            .then(redisService.deleteKey(ALL_UNITS_CACHE_KEY))
                            .thenReturn(updatedUnit)
                    );
            });
    }
    
    public Mono<Void> deleteUnityOfMeasure(Long id) {
        return getUnityOfMeasureById(id)
            .flatMap(unityOfMeasure -> {
                String nameKey = getUnitByNameCacheKey(unityOfMeasure.getName());
                return this.unityOfMeasureRepository.deleteById(id)
                    .then(redisService.deleteKey(getUnitCacheKey(id)))
                    .then(redisService.deleteKey(nameKey))
                    .then(redisService.deleteKey(ALL_UNITS_CACHE_KEY))
                    .then();
            });
    }
    
    public Mono<UnityOfMeasureModel> getUnityOfMeasureByName(String name) {
        String cacheKey = getUnitByNameCacheKey(name);
        return redisService.getValue(cacheKey)
            .flatMap(value -> {
                if (value instanceof UnityOfMeasureModel) {
                    return Mono.just((UnityOfMeasureModel) value);
                } else if (value instanceof Map) {
                    UnityOfMeasureModel unit = objectMapper.convertValue(value, UnityOfMeasureModel.class);
                    return Mono.just(unit);
                }
                return Mono.empty();
            })
            .switchIfEmpty(
                this.unityOfMeasureRepository.findUnityOfMeasureByName(name)
                    .flatMap(unit -> 
                        redisService.setValueWithExpiration(cacheKey, unit, CACHE_TTL.getSeconds())
                            .thenReturn(unit)
                    )
            );
    }
    
    public Mono<List<String>> getListUnitsName() {
        // Mantém o uso do cachedFlux atual para compatibilidade
        return cachedFlux.map(unit -> unit.name()).collectList();
    }
    
    // Armazena a unidade no cache com expiração
    private Mono<Boolean> cacheUnit(UnityOfMeasureModel unit) {
        String cacheKey = getUnitCacheKey(unit.getUnitsOfMeasureId());
        return redisService.setValueWithExpiration(cacheKey, unit, CACHE_TTL.getSeconds());
    }
}