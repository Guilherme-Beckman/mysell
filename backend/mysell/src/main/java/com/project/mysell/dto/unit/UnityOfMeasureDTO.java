package com.project.mysell.dto.unit;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UnityOfMeasureDTO(
		@NotNull(message = "Name must not be null")
        @NotBlank(message = "Name must not be blank")
		String name
		){

}
