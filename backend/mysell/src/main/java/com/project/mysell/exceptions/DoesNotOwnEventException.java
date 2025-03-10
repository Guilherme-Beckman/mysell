package com.project.mysell.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class DoesNotOwnEventException extends RestException {

    private static final long serialVersionUID = 1L;
    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problemDetail.setTitle("Event Ownership Error");
        problemDetail.setDetail("You do not own the event");
        return problemDetail;
    }
}
