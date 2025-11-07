package com.ems.service;

import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmployeeRepository employeeRepo;

    private static final String COMPANY_DOMAIN = "company.com";
    private static final String CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

    public void generateAndSendCredentials(Employee employee) {
        // Generate email + password
        String workEmail = generateWorkEmail(employee.getFirstName(), employee.getLastName());
        String password = generatePassword(10);

        // Update employee record
        employee.setWorkMail(workEmail);
        employee.setPassword(password);
        employeeRepo.save(employee);

        // Send the email
        String subject = "Your Work Email & Login Credentials";
        String body = String.format(
                "Hello %s %s,\n\nWelcome to the company!\n\nHere are your credentials:\n" +
                        "Work Email: %s\nTemporary Password: %s\n\nPlease change your password after your first login.\n\nBest Regards,\nHR Team",
                employee.getFirstName(), employee.getLastName(), workEmail, password
        );

        sendEmail(employee.getPersonalEmail(), subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    private String generateWorkEmail(String firstName, String lastName) {
        // Combine full name and split into parts
        String fullName = (firstName + " " + lastName).trim();
        String[] nameParts = fullName.split("\\s+");

        // Take only first two parts, or all if less than 2
        String emailPrefix = "";
        if (nameParts.length >= 2) {
            emailPrefix = nameParts[0].toLowerCase() + "." + nameParts[1].toLowerCase();
        } else if (nameParts.length == 1) {
            emailPrefix = nameParts[0].toLowerCase();
        } else {
            emailPrefix = "user"; // fallback
        }

        return emailPrefix + "@" + COMPANY_DOMAIN;
    }

    private String generatePassword(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHAR_SET.charAt(random.nextInt(CHAR_SET.length())));
        }
        return sb.toString();
    }
}
 