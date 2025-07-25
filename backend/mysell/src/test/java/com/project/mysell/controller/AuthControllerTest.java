package com.project.mysell.controller;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import com.project.mysell.dto.auth.LoginDTO;
import com.project.mysell.dto.auth.ResponseDTO;
import com.project.mysell.dto.auth.UserDTO;
import com.project.mysell.service.auth.AuthService;

import reactor.core.publisher.Mono;

@SecureWebFluxTest(controllers = AuthController.class)
class AuthControllerTest{

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private AuthService authService;
    
    @Test
    void login_WithValidCredentials_ReturnsResponseDTO() {
        // Arrange
        LoginDTO loginDTO = new LoginDTO("user@example.com", "password");
        ResponseDTO expectedResponse = new ResponseDTO("user", "token123");
        when(authService.login(any(LoginDTO.class))).thenReturn(Mono.just(expectedResponse));

        // Act & Assert
        webTestClient.post()
                .uri("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(loginDTO)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ResponseDTO.class)
                .isEqualTo(expectedResponse);
    }

    @Test
    void register_WithValidUser_ReturnsResponseDTO() {
        // Arrange
        UserDTO userDTO = new UserDTO("newuser@example.com", "password");
        ResponseDTO expectedResponse = new ResponseDTO("newuser", "token456");
        when(authService.register(any(UserDTO.class))).thenReturn(Mono.just(expectedResponse));

        // Act & Assert
        webTestClient.post()
                .uri("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(userDTO)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ResponseDTO.class)
                .isEqualTo(expectedResponse);
    }
}