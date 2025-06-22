package com.example.back_end.configuration;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    //Xác thực yêu cầu
    private final String[] PUBLIC_ENDPOINTS_POST_PERMITALL = {"users/createUser",
            "auth/login","auth/introspect","/verifyRegister/**","users/existUser","/seller/{sellerId}/courses"};
    private final String[] PUBLIC_ENDPOINTS_GET_PERMITALL = {"/auth/verifyAccount","users/id/**","/courses/**","/seller/{sellerId}/courses","/seller/debug/**","/order/add/**","/seller/{courseId}"};
    private final String[] PUBLIC_ENDPOINTS_GET = {"/sendEmail","/users/**","/favorites/idUser/**","/payment/vnpay/**","/reports/**"};
    private final String[] PUBLIC_ENDPOINTS_LOGIN = {"/auth/logout","/favorites/add","/order/**"};
    private final String[] SELLER_MANAGEMENT_ENDPOINTS = {"/seller/{sellerId}/courses/managed","/seller/{sellerId}/stats","/seller/{sellerId}/revenue"};
    private final String[] PUBLIC_ENDPOINTS_DELETE = {"/favorites/remove"};
    private final String[] SELLER_CRUD_ENDPOINTS = {"/seller/{sellerId}/courses/{courseId}"};
    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;
    @Autowired
    private ObjectMapper objectMapper;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(cors -> cors
                        .configurationSource(request -> {
                            var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                            corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));
                            corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                            corsConfiguration.setAllowedHeaders(List.of("*"));
                            corsConfiguration.setAllowCredentials(true);
                            return corsConfiguration;
                        })
                )
                .authorizeHttpRequests(request -> request
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_POST_PERMITALL).permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GET_PERMITALL).permitAll()
                        .requestMatchers(HttpMethod.GET, "/seller/{sellerId}/courses/managed").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/seller/{sellerId}/courses/{courseId}").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/seller/{sellerId}/courses/{courseId}").permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GET).authenticated()
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_LOGIN).authenticated()
                        .requestMatchers(HttpMethod.DELETE, PUBLIC_ENDPOINTS_DELETE).authenticated()
                        .requestMatchers(SELLER_MANAGEMENT_ENDPOINTS).authenticated()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            System.out.println("🚫 Authentication failed for: " + request.getRequestURI());
                            System.out.println("🚫 Auth exception: " + authException.getMessage());
                            System.out.println("🚫 Authorization header: " + request.getHeader("Authorization"));
                            
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write(objectMapper.writeValueAsString(
                                    ApiResponse.builder()
                                            .code(ErrorCode.UNAUTHENTICATED.getCode())
                                            .message(ErrorCode.UNAUTHENTICATED.getMessage())
                                            .build()
                            ));
                        })
                )
                .csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    JwtDecoder jwtDecoder(){
        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(),"HS512");
        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }


}
