package com.project.mysell.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;


public class ProductNotFoundException extends RestException {
    private static final long serialVersionUID = 1L;
    private final Long id;
    public ProductNotFoundException(Long id) {
        this.id = id;
    }
    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Product Not Found");
        problemDetail.setDetail("The Product with id '" + id + "' was not found.");

        return problemDetail;
    }

}
