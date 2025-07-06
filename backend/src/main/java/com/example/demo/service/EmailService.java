package com.example.demo.service;

import com.example.demo.model.User;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {
    
    @Autowired
    private TemplateEngine templateEngine;

    @Value("${app.url}")
    private String appUrl;
    
    @Value("${resend.api.key}")
    private String resendApiKey;
    
    @Value("${resend.from.email:noreply@mail.robenhod.com}")
    private String fromEmail;

    public void sendConfirmationEmail(User user) {
        try {
            System.out.println("Preparing to send email to: " + user.getEmail());
            System.out.println("Confirmation token: " + user.getConfirmationToken());
            System.out.println("App URL: " + appUrl);

            Context context = new Context();
            context.setVariable("user", user);
            context.setVariable("confirmationUrl", appUrl + "/api/auth/confirm?token=" + user.getConfirmationToken());

            String htmlContent = templateEngine.process("email/confirmation-email", context);
            System.out.println("Email content generated: " + (htmlContent != null));

            // Initialize Resend with API key
            Resend resend = new Resend(resendApiKey);
            
            CreateEmailOptions createEmailOptions = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(user.getEmail())
                    .subject("Confirm your email address")
                    .html(htmlContent)
                    .build();

            System.out.println("Sending email via Resend API...");
            CreateEmailResponse response = resend.emails().send(createEmailOptions);
            System.out.println("Email sent successfully. Email ID: " + response.getId());
            
        } catch (ResendException e) {
            System.err.println("Failed to send confirmation email via Resend: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}