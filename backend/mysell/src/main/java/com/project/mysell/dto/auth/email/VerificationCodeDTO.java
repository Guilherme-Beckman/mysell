package com.project.mysell.dto.auth.email;


import com.project.mysell.dto.auth.UserDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VerificationCodeDTO(
		UserDTO userDTO,
	    @NotNull(message = "Code must not be null")
        @NotBlank(message = "Code must not be blank")
		String code
		) {

}
