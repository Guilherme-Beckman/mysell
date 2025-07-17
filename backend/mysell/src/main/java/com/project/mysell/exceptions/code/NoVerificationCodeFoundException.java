package com.project.mysell.exceptions.code;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class NoVerificationCodeFoundException extends RestException {

    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        
        problemDetail.setTitle("No Verification Code Found");
        problemDetail.setDetail("The verification code for the provided email was not found.");

        return problemDetail;
    }
}
