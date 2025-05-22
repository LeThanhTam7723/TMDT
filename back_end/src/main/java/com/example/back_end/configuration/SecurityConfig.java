package com.example.back_end.configuration;

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

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    //Xác thực yêu cầu
    private final String[] PUBLIC_ENDPOINTS_POST = {"users/createUser",
            "auth/login","auth/introspect",};
    private final String[] PUBLIC_ENDPOINTS_GET = {"/sendEmail","/users"};
    private final String[] PUBLIC_ENDPOINTS_LOGIN = {"/logout"};
    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_POST).permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GET).hasAuthority("SCOPE_ADMIN")
                        .requestMatchers(HttpMethod.POST,PUBLIC_ENDPOINTS_LOGIN).authenticated()
                        .anyRequest().authenticated());
        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder()))
        );
        httpSecurity.exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.getWriter().write("You have not login yet");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.getWriter().write("You do not have a permission");

                })
        );
        httpSecurity.csrf(AbstractHttpConfigurer::disable);// tắt CSRF
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
