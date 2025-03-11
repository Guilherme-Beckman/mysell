package com.project.mysell.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.unit.UnityOfMeasureDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("units_of_measure")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnityOfMeasureModel {
	@Id
	private Long unitsOfMeasureId;
	private String name;
	public UnityOfMeasureModel(UnityOfMeasureDTO unityOfMeasureDTO) {
		this.name = unityOfMeasureDTO.name();
	}
	
	
}
