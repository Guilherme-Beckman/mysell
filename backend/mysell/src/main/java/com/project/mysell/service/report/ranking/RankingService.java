package com.project.mysell.service.report.ranking;

import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.ranking.DailyProductRankingDTO;
import com.project.mysell.dto.sell.SellResponseDTO;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class RankingService {

	public Mono<DailyProductRankingDTO> calculateDailyProductRanking(Flux<SellResponseDTO> sales) {
		// TODO Auto-generated method stub
		return null;
	}

}
