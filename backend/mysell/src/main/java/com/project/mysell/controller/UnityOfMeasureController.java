package com.project.mysell.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.model.UnityOfMeasureModel;
import com.project.mysell.service.UnityOfMeasureService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/unity")
public class UnityOfMeasureController {

    @Autowired
    private UnityOfMeasureService unityOfMeasureService;

    @PostMapping()
    public ResponseEntity<Mono<UnityOfMeasureModel>> createUnityOfMeasure(@Valid @RequestBody UnityOfMeasureDTO UnityOfMeasureDTO) {
        Mono<UnityOfMeasureModel> newUnityOfMeasure = this.unityOfMeasureService.createUnityOfMeasure(UnityOfMeasureDTO);
        return ResponseEntity.ok().body(newUnityOfMeasure);
    }

    @GetMapping()
    public ResponseEntity<Flux<UnityOfMeasureModel>> getAllUnitsOfMeasure() {
        Flux<UnityOfMeasureModel> unitsOfMeasure  = this.unityOfMeasureService.getAllUnitsOfMeasure();
        return ResponseEntity.ok().body(unitsOfMeasure);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mono<UnityOfMeasureModel>> updateUnityOfMeasure (@PathVariable Long id, @RequestBody @Valid UnityOfMeasureDTO UnityOfMeasureDTO) {
        Mono<UnityOfMeasureModel> updatedUnityOfMeasure  = this.unityOfMeasureService.updateUnityOfMeasure(id, UnityOfMeasureDTO);
        return ResponseEntity.ok().body(updatedUnityOfMeasure);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Mono<Void>> deleteUnityOfMeasure (@PathVariable Long id) {
        Mono<Void> deletedUnityOfMeasure = this.unityOfMeasureService.deleteUnityOfMeasure(id);
        return ResponseEntity.ok().body(deletedUnityOfMeasure);
    }
}
