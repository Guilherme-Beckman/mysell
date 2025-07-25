package com.project.mysell.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.sell.SellDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("sells")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellModel {
	@Id
	private Long sellsId;
	private Long quantity;
	private LocalDateTime createdAt;
	private UUID userId;
	private Long productId;
	public SellModel(SellDTO sellDTO) {
		this.quantity = sellDTO.quantity();
		this.createdAt = LocalDateTime.now();
		this.productId = sellDTO.productId();
	}	
}
