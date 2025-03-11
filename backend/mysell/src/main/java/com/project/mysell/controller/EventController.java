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

import com.project.mysell.dto.event.EventDTO;
import com.project.mysell.dto.event.EventResponseDTO;
import com.project.mysell.dto.event.EventUpdateDTO;
import com.project.mysell.service.EventService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping()
    public ResponseEntity<Mono<EventResponseDTO>> createEvent(@Valid @RequestBody EventDTO eventDTO, @RequestHeader("Authorization") String token) {
        Mono<EventResponseDTO> newEvent = this.eventService.createEvent(eventDTO, token);
        return ResponseEntity.ok().body(newEvent);
    }
    @GetMapping("/my")
    public ResponseEntity<Flux<EventResponseDTO>> getEventByUserId(@RequestHeader("Authorization") String token) {
    	Flux<EventResponseDTO> events  = this.eventService.getEventByUserId(token);
        return ResponseEntity.ok().body(events);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Mono<EventResponseDTO>> getEventById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
    	Mono<EventResponseDTO> event= this.eventService.getEventById(token, id);
        return ResponseEntity.ok().body(event);
    }
    @GetMapping()
    public ResponseEntity<Flux<EventResponseDTO>> getAllEvents() {
        Flux<EventResponseDTO> events = this.eventService.getAllEvent();
        return ResponseEntity.ok().body(events);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mono<EventResponseDTO>> updateEvent (@PathVariable Long id, @RequestBody @Valid EventUpdateDTO eventDTO, @RequestHeader("Authorization") String token) {
        Mono<EventResponseDTO> updatedEvent = this.eventService.updateEvent(id, eventDTO, token);
        return ResponseEntity.ok().body(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Mono<Void>> deleteEvent(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Mono<Void> deletedEvent= this.eventService.deleteEvent(id, token);
        return ResponseEntity.ok().body(deletedEvent);
    }
}
