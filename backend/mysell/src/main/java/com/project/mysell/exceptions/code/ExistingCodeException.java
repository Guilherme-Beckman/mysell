package com.project.mysell.exceptions.code;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class ExistingCodeException extends RestException {

    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        problemDetail.setTitle("Existing Code");
        problemDetail.setDetail("The code already exists.");
        return problemDetail;
    }
}
