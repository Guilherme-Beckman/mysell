package com.project.mysell.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SellResponseDTO (
		Long quantity,
		LocalDateTime createdAt,
		ProductResponseDTO productResponseDTO
		){

}
