package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.report.WeeklyReportModel;
@Repository
public interface WeeklyReportRepository extends ReactiveCrudRepository<WeeklyReportModel, Long>{

}
