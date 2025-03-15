package com.project.mysell.repository;

import java.util.UUID;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import com.project.mysell.model.SellModel;
import reactor.core.publisher.Flux;

public interface SellRepository extends ReactiveCrudRepository<SellModel, Long>{
	Flux<SellModel> findAllByUserId (UUID userId);
	@Query("SELECT * FROM sells WHERE user_id = :userId AND DATE(created_at) = CURRENT_DATE")
	Flux<SellModel> getTodaySellById(UUID userId);
	@Query("SELECT * FROM sells WHERE user_id = :userId " +
		       "AND created_at >= date_trunc('week', CURRENT_DATE) " +
		       "AND created_at < date_trunc('week', CURRENT_DATE) + interval '1 week'")
	Flux<SellModel> getThisWeekSellByUserId(UUID userId);
}
