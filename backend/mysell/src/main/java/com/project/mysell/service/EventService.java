package com.project.mysell.service;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.event.EventDTO;
import com.project.mysell.dto.event.EventResponseDTO;
import com.project.mysell.dto.event.EventUpdateDTO;
import com.project.mysell.exceptions.event.DoesNotOwnEventException;
import com.project.mysell.exceptions.event.EventNotFoundException;
import com.project.mysell.infra.redis.RedisService;
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
    
    @Autowired
    private RedisService redisService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Tempo de expiração para os itens em cache (10 minutos)
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);
    
    // Gera a chave de cache para um evento
    private String getEventCacheKey(Long id) {
        return "event:" + id;
    }
    
    public Mono<EventResponseDTO> createEvent(EventDTO eventDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);
        EventModel newEvent = createNewEvent(eventDTO, userId);
        
        return saveEventAndConvertToResponse(newEvent)
            .flatMap(eventResponse -> 
                cacheEvent(newEvent)
                    .thenReturn(eventResponse)
            );
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
    
    public Mono<EventResponseDTO> getEventResponseById(String token, Long id) {
        final UUID userId = extractUserIdFromToken(token);
        
        return getEventById(id)
            .flatMap(existingEvent -> 
                validateOwnership(existingEvent.getUserId(), userId)
                    .then(Mono.just(convertToEventResponseDTO(existingEvent)))
            );
    }
    
    private Mono<EventModel> getEventById(Long id) {
        String cacheKey = getEventCacheKey(id);
        return redisService.getValue(cacheKey)
            .flatMap(value -> {
                if (value instanceof EventModel) {
                    return Mono.just((EventModel) value);
                } else if (value instanceof Map) {
                    EventModel event = objectMapper.convertValue(value, EventModel.class);
                    return Mono.just(event);
                }
                return Mono.empty();
            })
            .switchIfEmpty(
                eventRepository.findById(id)
                    .switchIfEmpty(Mono.error(new EventNotFoundException(id)))
                    .flatMap(event -> 
                        redisService.setValueWithExpiration(cacheKey, event, CACHE_TTL.getSeconds())
                            .thenReturn(event)
                    )
            );
    }
    
    public Mono<EventResponseDTO> updateEvent(Long id, EventUpdateDTO eventDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);
        
        return getEventById(id)
            .flatMap(existingEvent -> 
                validateOwnership(existingEvent.getUserId(), userId)
                    .then(update(existingEvent, eventDTO))
                    .flatMap(updatedEvent -> 
                        cacheEvent(updatedEvent)
                            .thenReturn(convertToEventResponseDTO(updatedEvent))
                    )
            );
    }
    
    public Mono<Void> deleteEvent(Long id, String token) {
        final UUID userId = extractUserIdFromToken(token);
        
        return getEventById(id)
            .flatMap(existingEvent ->
                validateOwnership(existingEvent.getUserId(), userId)
                    .then(eventRepository.deleteById(existingEvent.getEventsId()))
                    .then(redisService.deleteKey(getEventCacheKey(id)))
                    .then()
            );
    }
    
    private Mono<EventModel> update(EventModel existingEvent, EventUpdateDTO eventDTO) {
        updateEventFields(existingEvent, eventDTO);
        return eventRepository.save(existingEvent);
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
            if (newValue instanceof String s && !s.isBlank()) {
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
    
    // Armazena o evento no cache com expiração
    private Mono<Boolean> cacheEvent(EventModel event) {
        String cacheKey = getEventCacheKey(event.getEventsId());
        return redisService.setValueWithExpiration(cacheKey, event, CACHE_TTL.getSeconds());
    }
}
