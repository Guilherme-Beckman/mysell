package com.project.mysell.service;

import java.util.UUID;
import java.util.function.Consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.event.EventDTO;
import com.project.mysell.dto.event.EventResponseDTO;
import com.project.mysell.dto.event.EventUpdateDTO;
import com.project.mysell.exceptions.event.DoesNotOwnEventException;
import com.project.mysell.exceptions.event.EventNotFoundException;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.EventModel;
import com.project.mysell.repository.EventRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class EventService {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private EventRepository eventRepository;

    public Mono<EventResponseDTO> createEvent(EventDTO eventDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);
        EventModel newEvent = createNewEvent(eventDTO, userId);
        
        return saveEventAndConvertToResponse(newEvent);
    }

    public Flux<EventResponseDTO> getAllEvent() {
        return eventRepository.findAll()
            .map(this::convertToEventResponseDTO);
    }

    public Flux<EventResponseDTO> getEventByUserId(String token) {
        final UUID userId = extractUserIdFromToken(token);
        return eventRepository.findAllByUserId(userId)
            .map(this::convertToEventResponseDTO);
    }
    
    public Mono<EventResponseDTO> getEventById(String token, Long id) {
        final UUID userId = extractUserIdFromToken(token);
        
        return eventRepository.findById(id)
            .switchIfEmpty(Mono.error(new EventNotFoundException(id)))
            .flatMap(existingEvent -> {
                return validateOwnership(existingEvent.getUserId(), userId)
                .then(Mono.just(convertToEventResponseDTO(existingEvent)));
            });
    }

    public Mono<EventResponseDTO> updateEvent(Long id, EventUpdateDTO eventDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);

        return eventRepository.findById(id)
            .switchIfEmpty(Mono.error(new EventNotFoundException(id)))
            .flatMap(existingEvent -> {
                return validateOwnership(existingEvent.getUserId(), userId)
                .then(update(existingEvent, eventDTO));
            });
    }

    public Mono<Void> deleteEvent(Long id, String token) {
        final UUID userId = extractUserIdFromToken(token);

        return eventRepository.findById(id)
            .switchIfEmpty(Mono.error(new EventNotFoundException(id)))
            .flatMap(existingEvent -> {
                return validateOwnership(existingEvent.getUserId(), userId)
                    .then(eventRepository.deleteById(existingEvent.getEventsId()));
            });
    }

    private Mono<EventResponseDTO> update(
        EventModel existingEvent,
        EventUpdateDTO eventDTO
    ) {
        updateEventFields(existingEvent, eventDTO);
        return eventRepository.save(existingEvent)
            .map(this::convertToEventResponseDTO);
    }
    
    private Mono<Void> validateOwnership(UUID existingEventUserId, UUID userId) {
        if (!existingEventUserId.equals(userId)) {
            return Mono.error(new DoesNotOwnEventException());
        }
        return Mono.empty();
    }
    
    private void updateEventFields(EventModel event, EventUpdateDTO updateDTO) {
        updateFieldIfValid(event::setName, event.getName(), updateDTO.name());
        updateFieldIfValid(event::setDate, event.getDate(), updateDTO.date());
        updateFieldIfValid(event::setTime, event.getTime(), updateDTO.time());
        updateFieldIfValid(event::setColor, event.getColor(), updateDTO.color());
        updateFieldIfValid(event::setFavorite, event.isFavorite(), updateDTO.favorite());
    }

    private <T> void updateFieldIfValid(Consumer<T> setter, T currentValue, T newValue) {
        if (newValue != null && !newValue.equals(currentValue)) {
            if (newValue instanceof String str && !str.isBlank()) {
                setter.accept(newValue);
            } else if (!(newValue instanceof String)) {
                setter.accept(newValue);
            }
        }
    }

    private UUID extractUserIdFromToken(String token) {
        return jwtTokenProvider.getUserIdFromToken(jwtTokenProvider.extractJwtToken(token));
    }

    private EventModel createNewEvent(EventDTO eventDTO, UUID userId) {
        EventModel event = new EventModel(eventDTO);
        event.setUserId(userId);
        return event;
    }

    private Mono<EventResponseDTO> saveEventAndConvertToResponse(EventModel event) {
        return eventRepository.save(event)
            .map(this::convertToEventResponseDTO);
    }

    private EventResponseDTO convertToEventResponseDTO(EventModel event) {
        return new EventResponseDTO(
            event.getName(),
            event.getDate(),
            event.getTime(),
            event.getColor(),
            event.isFavorite()
        );
    }
}