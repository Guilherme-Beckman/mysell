package com.project.mysell.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class AccountLockedException extends RestException {

    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.LOCKED);
        problemDetail.setTitle("Account Locked");
        problemDetail.setDetail("Your account has been locked due to multiple failed login attempts. Please try again later.");
        return problemDetail;
    }
}
