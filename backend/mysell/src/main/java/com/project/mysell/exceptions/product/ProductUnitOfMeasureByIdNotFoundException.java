package com.project.mysell.exceptions.product;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class ProductUnitOfMeasureByIdNotFoundException extends RestException {
    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Product Unit of Measure Not Found");
        problemDetail.setDetail("The Product Unit of Measure was not found.");

        return problemDetail;
    }
}
