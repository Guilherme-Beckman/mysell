package com.project.mysell.exceptions.sell;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class DoesNotOwnSellException extends RestException {

    private static final long serialVersionUID = 1L;
    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problemDetail.setTitle("Sell Ownership Error");
        problemDetail.setDetail("You do not own the sell");
        return problemDetail;
    }
}
