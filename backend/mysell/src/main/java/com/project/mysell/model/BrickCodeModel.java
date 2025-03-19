package com.project.mysell.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("brick_codes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrickCodeModel {
	@Id
	private Long brickCodesId;
	private Long gpcCode;
	
}
