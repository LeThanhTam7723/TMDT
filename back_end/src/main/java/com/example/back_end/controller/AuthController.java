package com.example.back_end.controller;

import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.LoginRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.service.AuthService;
import com.example.back_end.service.SendEmailService;
import com.example.back_end.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;

@RestController
@CrossOrigin(origins = {"http://localhost:5173"})
@RequestMapping("/auth")

public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    SendEmailService sendEmailService;
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login (@RequestBody LoginRequest request) {
        var res = authService.login(request);
        return ApiResponse.<AuthenticationResponse>builder().result(res).build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> autResponse(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        authService.logout(request);
        return ApiResponse.<Void>builder().build();
    }
    @GetMapping("/verifyAccount")
    ApiResponse<Void> verifyAccount(@RequestParam("token") String token, HttpServletResponse response) throws ParseException, JOSEException, IOException {
        IntrospectRequest request = new IntrospectRequest(token);
        var result = authService.introspect(request);
        String email = result.getEmail();
        if (result.isValid()) {
            response.sendRedirect("http://localhost:5173/auth/register?email=" + email);
        } else {
            System.out.println("invalid-verification");
        }
        return ApiResponse.<Void>builder().build();
    }
}
