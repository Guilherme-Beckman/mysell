package com.project.mysell.service;
import reactor.core.publisher.Mono;

public interface EmailService {
    Mono<Void> sendEmail (String to, String subject, String htmlBody);

    /*public Mono<Object> sendEmailCode(String to, String subject, String htmlBody) {
        return Mono.fromRunnable(() -> {
            try {
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
                helper.setTo(to);
                helper.setSubject(subject);
                message.setContent(htmlBody, "text/html; charset=utf-8");
                javaMailSender.send(message);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        });
    }*/

   /* public Mono<Object> sendWelcomeEmail(String to) {
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

        return sendHtmlEmail(to, subject, htmlBody);    }*/
}
