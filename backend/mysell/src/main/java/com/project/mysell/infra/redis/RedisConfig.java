package com.project.mysell.infra.redis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class RedisConfig {
	@Bean
	@Primary
	ReactiveRedisConnectionFactory customRedisConnectionFactory(){
		return new LettuceConnectionFactory("localhost", 6379);
	}
	
	   @Bean
	    ReactiveRedisTemplate<String, Object> reactiveRedisTemplate(
	            ReactiveRedisConnectionFactory factory, ObjectMapper objectMapper) {
	        
	        // Create a custom serializer configured with JavaTimeModule
	        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(objectMapper, Object.class);
	        
	        // Use the application's configured ObjectMapper
	        
	        RedisSerializationContext.RedisSerializationContextBuilder<String, Object> builder =
	                RedisSerializationContext.newSerializationContext(new StringRedisSerializer());
	        
	        RedisSerializationContext<String, Object> context = builder
	                .value(serializer)
	                .hashValue(serializer)
	                .build();
	        
	        return new ReactiveRedisTemplate<>(factory, context);
	    }
}
