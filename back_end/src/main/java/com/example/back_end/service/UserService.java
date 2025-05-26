package com.example.back_end.service;

import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.UserMapper;
import com.example.back_end.repositories.RoleRepository;
import com.example.back_end.repositories.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    @Autowired
    private UserMapper userMapper;
    @NonFinal
    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;
    public User createRequest(UserCreationRequest request) {
        if(userRepository.existsByUsername(request.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        System.out.println("Email before mapping: " + request.getEmail());
        String encryptedPS= passwordEncoder.encode(request.getPassword());
        request.setPassword(encryptedPS);
        User user = userMapper.toUser(request);
        System.out.println("Email after mapping: " + user.getEmail());
        HashSet<Role> roles = new HashSet<>();
        Role userRole = roleRepository.save(Role.builder()
                .name(PredefinedRole.USER_ROLE)
                .description("User role")
                .build());
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<User> getUsers() {
        log.info("In method at User");
        return userRepository.findAll();
    }
    public User getUserById(Integer id) {
        return userRepository.findUserById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id))
                ;
    }

}
