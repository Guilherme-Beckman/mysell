package com.project.mysell.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.LoginDTO;
import com.project.mysell.dto.ResponseDTO;
import com.project.mysell.dto.UserDTO;
import com.project.mysell.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SecureWebFluxTest(controllers = AuthController.class)
class AuthControllerTest{

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
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