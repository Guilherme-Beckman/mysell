package com.project.mysell.exceptions.auth.locked;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import com.project.mysell.exceptions.RestException;

public class ExcessiveEmailsExceptions extends RestException {

    private static final long serialVersionUID = 1L;
    private final long retryAfterSeconds;

    public ExcessiveEmailsExceptions(long retryAfterSeconds) {
        this.retryAfterSeconds = retryAfterSeconds;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.LOCKED);
        problemDetail.setTitle("Excesso de solicitações de e-mail");
        problemDetail.setDetail("Você solicitou muitos códigos de verificação em um curto período de tempo. Tente novamente em: " + retryAfterSeconds + " segundos.");
        return problemDetail;
    }
}
