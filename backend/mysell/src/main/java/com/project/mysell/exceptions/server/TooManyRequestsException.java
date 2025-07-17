package com.project.mysell.exceptions.server;

import com.project.mysell.exceptions.RestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class TooManyRequestsException extends RestException {
    
    private static final long serialVersionUID = 1L;

    @Override
    public ProblemDetail toProblemDetail() {
        var pb = ProblemDetail.forStatus(HttpStatus.TOO_MANY_REQUESTS);
        pb.setTitle("Too Many Requests");
        return pb;
    }
}
