package com.project.mysell.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.r2dbc.DataR2dbcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.project.mysell.dto.UserDTO;
import com.project.mysell.exceptions.user.UserNotFoundException;
import com.project.mysell.model.UserModel;
import com.project.mysell.repository.UserRepository;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@DataR2dbcTest
@ActiveProfiles("test")
@Import(UserService.class)
public class UserServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceTest.class);

    @Autowired
    private UserService userService;

    @Test
    public void testCreateUser() {
        // Given
        String email = "test@example.com";
        String password = "password123";
        UserDTO userDTO = new UserDTO(email, password);
        
        logger.info("Starting testCreateUser with email: {}", email);

        // When
        Mono<UserModel> result = userService.createUser(userDTO);

        // Then
        StepVerifier.create(result)
            .assertNext(createdUser -> {
                logger.info("User created with ID: {}", createdUser.getId());
                assertNotNull(createdUser.getId());
                assertEquals(email, createdUser.getEmail());
                assertEquals(password, createdUser.getPassword());
                assertNotNull(createdUser.getCreated_at());
                logger.info("User created successfully with timestamp: {}", createdUser.getCreated_at());
            })
            .verifyComplete();
        
        logger.info("testCreateUser completed successfully");
    }

   
}