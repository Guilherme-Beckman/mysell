package com.project.mysell.exceptions.unit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class UnityOfMeasureNotFoundException extends RestException {

    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Unity of measure Not Found");
        problemDetail.setDetail("The requested unity of measure could not be found.");
        return problemDetail;
    }
}
