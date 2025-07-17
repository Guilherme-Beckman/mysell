package com.project.mysell.exceptions.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.project.mysell.exceptions.RestException;

public class UserAlreadyExistsException extends RestException {

    private static final long serialVersionUID = 1L;


    @Override
    public ProblemDetail toProblemDetail() {
        // Cria um ProblemDetail com status 409 (Conflict)
        var problemDetail = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        
        // Define o título e os detalhes do problema
        problemDetail.setTitle("User Already Exists");
        problemDetail.setDetail("A user with the provided email already exists in the system.");

        return problemDetail;
    }
}
