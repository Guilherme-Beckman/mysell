package com.project.mysell.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import reactor.core.publisher.Mono;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    /**
     * Envia um e-mail HTML genérico.
     */
    public Mono<Object> sendHtmlEmail(String to, String subject, String htmlBody) {
        return Mono.fromRunnable(() -> {
            try {
                logger.info("Preparando para enviar e-mail HTML para: {}", to);
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
                helper.setTo(to);
                helper.setSubject(subject);
                // Define o conteúdo como HTML
                message.setContent(htmlBody, "text/html; charset=utf-8");
                javaMailSender.send(message);
                logger.info("E-mail HTML enviado para: {}", to);
            } catch (MessagingException e) {
                logger.error("Erro ao enviar e-mail HTML para: {}", to, e);
                throw new RuntimeException(e);
            }
        });
    }

    /**
     * Envia um e-mail de boas-vindas utilizando um template HTML com CSS inline.
     */
    public Mono<Object> sendWelcomeEmail(String to) {
        String subject = "Bem-vindo à Mysell!";
        String htmlBody = "<html>" +
                "<head>" +
                "<style>" +
                "body { background: #f4f4f4; font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { background: #fff; padding: 20px; margin: 40px auto; border-radius: 5px; " +
                "box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 600px; }" +
                ".header { background: #4CAF50; color: #fff; padding: 20px; text-align: center; " +
                "border-radius: 5px 5px 0 0; }" +
                ".content { padding: 30px; text-align: center; }" +
                ".footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'><h1>Bem-vindo à Mysell!</h1></div>" +
                "<div class='content'>" +
                "<p>Olá, seja muito bem-vindo à nossa plataforma!</p>" +
                "<p>Agradecemos por se juntar a nós e estamos entusiasmados para proporcionar a melhor experiência possível.</p>" +
                "<p>Conte conosco para alcançar seus objetivos!</p>" +
                "</div>" +
                "<div class='footer'>&copy; 2025 Mysell. Todos os direitos reservados.</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        logger.info("Preparando e-mail de boas-vindas para: {}", to);
        return sendHtmlEmail(to, subject, htmlBody)
                .doOnSuccess(ignored -> logger.info("E-mail de boas-vindas enviado com sucesso para: {}", to))
                .doOnError(e -> logger.error("Erro ao enviar e-mail de boas-vindas para: {}", to, e));
    }
}
