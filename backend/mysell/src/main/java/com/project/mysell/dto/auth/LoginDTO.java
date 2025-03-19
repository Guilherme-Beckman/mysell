package com.project.mysell.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginDTO(
        @NotNull(message = "Email must not be null")
        @NotBlank(message = "Email must not be blank")
        String email,

        @NotNull(message = "Password must not be null")
        @NotBlank(message = "Password must not be blank")
        String password) {
}
