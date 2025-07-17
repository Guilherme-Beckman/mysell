package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public Mono<Void> sendVerificationEmail(String to, String verificationCode) {
        return Mono.fromRunnable(() -> {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setTo(to);
                helper.setSubject("Código de Verificação - MySell");
                String htmlContent = "<html>" +
                        "<head>" +
                        "  <meta charset='UTF-8'>" +
                        "  <style>" +
                        "    .header { background-color: #E86868; padding: 20px; text-align: center; color: white; }" +
                        "    .content { margin: 20px; font-family: Arial, sans-serif; }" +
                        "    .verification { font-size: 24px; font-weight: bold; color: #E86868; }" +
                        "    .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #E86868; color: white; text-decoration: none; border-radius: 5px; }" +
                        "    .footer { margin: 20px; font-family: Arial, sans-serif; font-size: 12px; text-align: center; color: #777; }" +
                        "  </style>" +
                        "</head>" +
                        "<body>" +
                        "  <div class='header'>" +
                        "    <h1>MySell</h1>" +
                        "    <p>Verificação de E-mail</p>" +
                        "  </div>" +
                        "  <div class='content'>" +
                        "    <p>Olá,</p>" +
                        "    <p>Seu código de verificação é:</p>" +
                        "    <p class='verification'>" + verificationCode + "</p>" +
                        "    <p>Se você não solicitou esta verificação, por favor, ignore este e-mail.</p>" +
                        "  </div>" +
                        "  <div class='footer'>" +
                        "    <p>&copy; 2025 MySell. Todos os direitos reservados.</p>" +
                        "  </div>" +
                        "</body>" +
                        "</html>";

                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
            } catch (Exception e) {
                throw new RuntimeException("Erro ao enviar e-mail", e);
            }
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }
    public Mono<Void> sendWelcomeEmail(String to) {
        return Mono.fromRunnable(() -> {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setTo(to);
                helper.setSubject("Bem-vindo à MySell!");

                String htmlContent = "<html>" +
                        "<head>" +
                        "  <meta charset='UTF-8'>" +
                        "  <style>" +
                        "    .header { background-color: #E86868; padding: 20px; text-align: center; color: white; }" +
                        "    .content { margin: 20px; font-family: Arial, sans-serif; }" +
                        "    .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #E86868; color: white; text-decoration: none; border-radius: 5px; }" +
                        "    .footer { margin: 20px; font-family: Arial, sans-serif; font-size: 12px; text-align: center; color: #777; }" +
                        "  </style>" +
                        "</head>" +
                        "<body>" +
                        "  <div class='header'>" +
                        "    <h1>MySell</h1>" +
                        "  </div>" +
                        "  <div class='content'>" +
                        "    <h2>Bem-vindo à MySell!</h2>" +
                        "    <p>Olá,</p>" +
                        "    <p>É com grande satisfação que o recebemos na MySell, a plataforma ideal para o registro de produtos e gestão de vendas destinada a mercearias e vendedores.</p>" +
                        "    <p>Seu e-mail foi verificado com sucesso, e agora você tem acesso a todas as funcionalidades que irão otimizar a administração do seu negócio.</p>" +
                        "    <p>Cadastre seus produtos, acompanhe suas vendas e gerencie seu estoque de forma simples e eficiente.</p>" +
                        "    <a class='button' href='#'>Acessar a Plataforma</a>" +
                        "  </div>" +
                        "  <div class='footer'>" +
                        "    <p>&copy; 2025 MySell. Todos os direitos reservados.</p>" +
                        "  </div>" +
                        "</body>" +
                        "</html>";

                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
            } catch (Exception e) {
                throw new RuntimeException("Erro ao enviar e-mail", e);
            }
        });
    }

}
