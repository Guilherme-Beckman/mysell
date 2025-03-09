package com.project.mysell.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class DoesNotOwnProductException extends RestException {

    private static final long serialVersionUID = 1L;
    private final String productId;

    public DoesNotOwnProductException(String productId) {
        this.productId = productId;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problemDetail.setTitle("Product Ownership Error");
        problemDetail.setDetail("You do not own the product with ID: " + productId);
        return problemDetail;
    }
}
