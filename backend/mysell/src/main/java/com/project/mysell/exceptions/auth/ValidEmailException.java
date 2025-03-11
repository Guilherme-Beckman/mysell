package com.project.mysell.exceptions.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class ValidEmailException extends RestException {

    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

        problemDetail.setTitle("Email Already Validated");
        problemDetail.setDetail("The email address has already been validated.");

        return problemDetail;
    }
}
