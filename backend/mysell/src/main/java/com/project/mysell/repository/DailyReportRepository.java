package com.project.mysell.repository;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.dto.report.DailyReportResponseDTO;
import com.project.mysell.model.report.DailyReportModel;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
@Repository
public interface DailyReportRepository extends ReactiveCrudRepository<DailyReportModel, Long> {

	    @Query("SELECT * FROM daily_reports WHERE user_id = :userId AND date = :date LIMIT 1")
	    Mono<DailyReportModel> findDailyReportByDate(UUID userId, LocalDate date);
		@Query("SELECT * FROM daily_reports WHERE user_id = :userId " +
			       "AND date >= date_trunc('week', CURRENT_DATE) " +
			       "AND date < date_trunc('week', CURRENT_DATE) + interval '1 week'")
		Flux<DailyReportModel> getThisWeekDailyReportByUserId(UUID userId);
		Flux<DailyReportModel> findAllByUserId(UUID userId);
	}



