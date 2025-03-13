package com.project.mysell.exceptions.sell;


import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;


public class SellNotFoundException extends RestException {
    private static final long serialVersionUID = 1L;
    private final Long id;
    public SellNotFoundException(Long id) {
        this.id = id;
    }
    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Sell Not Found");
        problemDetail.setDetail("The Sell with id '" + id + "' was not found.");

        return problemDetail;
    }

}