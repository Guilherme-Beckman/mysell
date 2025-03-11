package com.project.mysell.exceptions.code;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class InvalidCodeException extends RestException {

    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        problemDetail.setTitle("Invalid Code");
        problemDetail.setDetail("The code provided is invalid.");
        return problemDetail;
    }
}
