package com.project.mysell.exceptions.sell;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class UserHasNoSalesTodayException extends RestException {
    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("No Sales Found Today");
        problemDetail.setDetail("The user has no sales today.");

        return problemDetail;
    }
}
