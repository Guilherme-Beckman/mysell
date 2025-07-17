package com.project.mysell.repository;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.report.WeeklyReportModel;

import reactor.core.publisher.Flux;
@Repository
public interface WeeklyReportRepository extends ReactiveCrudRepository<WeeklyReportModel, Long>{

	Flux<WeeklyReportModel> findAllByUserId(UUID userId);

}
