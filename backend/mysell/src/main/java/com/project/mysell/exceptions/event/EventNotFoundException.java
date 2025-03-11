package com.project.mysell.exceptions.event;


import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;


public class EventNotFoundException extends RestException {
    private static final long serialVersionUID = 1L;
    private final Long id;
    public EventNotFoundException(Long id) {
        this.id = id;
    }
    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("Event Not Found");
        problemDetail.setDetail("The event with id '" + id + "' was not found.");

        return problemDetail;
    }

}
