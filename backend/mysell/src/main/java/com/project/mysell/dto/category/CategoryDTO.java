package com.project.mysell.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoryDTO(
        @NotNull(message = "Name must not be null")
        @NotBlank(message = "Name must not be blank")
		String name,
		Long gpcCode
		) {

}
