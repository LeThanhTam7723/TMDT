package com.example.back_end.controller;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.AuthService;
import com.example.back_end.service.SendEmailService;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
public class SendMailController {
    @Autowired
    SendEmailService sendEmailService;
    @Autowired
    AuthService authService;


    @PostMapping("/verifyRegister")
    ApiResponse<Void> verifyRegister(@RequestParam("email") String email) throws ParseException, JOSEException, MessagingException {
        String token = authService.createVerifyToken(email);
        String subject = "Xác thực đăng ký";
        String result = "http://localhost:8080/api/auth/verifyAccount?token="+token;
        sendEmailService.sendMail(email,subject,result);
        return ApiResponse.<Void>builder().build();
    }
}
