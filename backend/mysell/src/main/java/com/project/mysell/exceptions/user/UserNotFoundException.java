package com.project.mysell.exceptions.user;


import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class UserNotFoundException extends RestException {
    private static final long serialVersionUID = 1L;
    private final String email;
    public UserNotFoundException(String email) {
        this.email = email;
    }
    @Override
    public ProblemDetail toProblemDetail() {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("User Not Found");
        problemDetail.setDetail("The user with email '" + email + "' was not found.");
        problemDetail.setProperty("error_code", "USER_NOT_FOUND_001");

        return problemDetail;
    }

}
