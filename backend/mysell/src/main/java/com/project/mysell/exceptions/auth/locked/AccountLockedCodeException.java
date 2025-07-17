package com.project.mysell.exceptions.auth.locked;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class AccountLockedCodeException extends RestException {

    private static final long serialVersionUID = 1L;
    private long time;
    public AccountLockedCodeException(long time) {
    	this.time = time;
    }
    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.LOCKED);
        problemDetail.setTitle("Account Locked");
        problemDetail.setDetail("Your account has been locked due to multiple failed verify code attempts. Please try again in: " + time + " seconds");
        return problemDetail;
    }
}
