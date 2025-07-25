package com.project.mysell.dto.product.unit;

import com.project.mysell.dto.unit.UnityOfMeasureDTO;

public record ProductUnitOfMeasureResponseDTO(
	    Double quantity,
	    UnityOfMeasureDTO unityOfMeasure
		) {

}
