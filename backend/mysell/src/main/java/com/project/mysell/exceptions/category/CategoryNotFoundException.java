package com.project.mysell.exceptions.category;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class CategoryNotFoundException extends RestException {

    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Category Not Found");
        problemDetail.setDetail("The requested category could not be found.");
        return problemDetail;
    }
}
