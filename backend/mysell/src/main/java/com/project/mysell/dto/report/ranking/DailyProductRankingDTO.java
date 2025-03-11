package com.project.mysell.dto.report.ranking;

import reactor.core.publisher.Flux;

public record DailyProductRankingDTO (
		Flux<ProductPositionDTO> productPositionDTO
		){

}
