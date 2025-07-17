package com.project.mysell.exceptions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;

import com.project.mysell.exceptions.validation.ValidationException;


@RestControllerAdvice
public class RestExceptionHandler {
	@Autowired	
	private ValidationException validationException;
	
	@ExceptionHandler(RestException.class)
	public ProblemDetail handleAuthException(RestException e) {
		return e.toProblemDetail();
	}
	@ExceptionHandler(WebExchangeBindException.class)
	public ProblemDetail handleMethodArgumentNotValidException(WebExchangeBindException e) {
		return this.validationException.toProblemDetail(e);
	}
}