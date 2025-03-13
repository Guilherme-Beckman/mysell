package com.project.mysell.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.sell.SellDTO;
import com.project.mysell.dto.sell.SellResponseDTO;
import com.project.mysell.dto.sell.SellUpdateDTO;
import com.project.mysell.service.SellService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/sell")
public class SellController {

    @Autowired
    private SellService sellService;

    @PostMapping()
    public ResponseEntity<Mono<SellResponseDTO>> createSell(@Valid @RequestBody SellDTO selltDTO, @RequestHeader("Authorization") String token) {
        Mono<SellResponseDTO> newSell = this.sellService.createSell(selltDTO, token);
        return ResponseEntity.ok().body(newSell);
    }
    @GetMapping("/my")
    public ResponseEntity<Flux<SellResponseDTO>> getSellsByUserId(@RequestHeader("Authorization") String token) {
    	Flux<SellResponseDTO> sells  = this.sellService.getSellsByUserId(token);
        return ResponseEntity.ok().body(sells);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Mono<SellResponseDTO>> getSellById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
    	Mono<SellResponseDTO> sell  = this.sellService.getSellResponseById(token, id);
        return ResponseEntity.ok().body(sell);
    }
    @GetMapping()
    public ResponseEntity<Flux<SellResponseDTO>> getAllSells() {
        Flux<SellResponseDTO> sells  = this.sellService.getAllSells();
        return ResponseEntity.ok().body(sells);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mono<SellResponseDTO>> updateSell(@PathVariable Long id, @RequestBody @Valid SellUpdateDTO sellDTO, @RequestHeader("Authorization") String token) {
        Mono<SellResponseDTO> updatedSell  = this.sellService.updateSell(id, sellDTO, token);
        return ResponseEntity.ok().body(updatedSell);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Mono<Void>> deleteSell (@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Mono<Void> deletedSell = this.sellService.deleteSell(id, token);
        return ResponseEntity.ok().body(deletedSell);
    }
}
