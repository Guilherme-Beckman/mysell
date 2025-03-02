package com.project.mysell.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
public class InvalidCredentialsException extends RestException {

	private static final long serialVersionUID = 1L;

	@Override
	public ProblemDetail toProblemDetail() {
		var problemDetail = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
		
		problemDetail.setTitle("Invalid Credentials");
		problemDetail.setDetail("The email or password you entered is incorrect.");

		return problemDetail;
	}
}
