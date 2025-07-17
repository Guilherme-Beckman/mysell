package com.project.mysell.exceptions.report;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class DailyReportNotFoundException extends RestException {
    private static final long serialVersionUID = 1L;
    private final LocalDate date;

    public DailyReportNotFoundException(LocalDate date) {
        this.date = date;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Daily Report Not Found");
        problemDetail.setDetail("The Daily Report with date'" + date + "' was not found.");

        return problemDetail;
    }
}
