package com.project.mysell.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VerificationCodeDTO(
	    @NotNull(message = "Code must not be null")
        @NotBlank(message = "Code must not be blank")
		String code
		) {

}
