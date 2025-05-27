package com.example.back_end.service;

import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.dto.UserDto;
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
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;
    public User createRequest(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        // Map fields from request to entity
        User user = modelMapper.map(request, User.class);
        // Encrypt password after mapping
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Assign default USER role
        var role = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .name(PredefinedRole.USER_ROLE)
                                .description("User role")
                                .build()
                ));
        user.setRoles(new HashSet<>(List.of(role)));

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

    private String generateToken(User user) {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("CDWED.com")
                .issueTime(new Date())
                .expirationTime(Date.from(
                        Instant.now().plus(1, ChronoUnit.HOURS)
                ))
                .claim("scope", buildScope(user))
                .build();
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWSObject jws = new JWSObject(header, new Payload(claims.toJSONObject()));
        try {
            jws.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jws.serialize();
        } catch (JOSEException e) {
            log.error("Token signing error", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> joiner.add(role.getName()));
        }
        return joiner.toString();
    }
    public List<UserDto> getConvertedUsers(List<User> users) {
        return users.stream().map(this::convertToDto).toList();
    }

    public UserDto convertToDto(User user) {
        UserDto userDto = modelMapper.map(user, UserDto.class);
//        Optional<Image> avatar = imageRepository.findByUserId(user.getId());
//        if (avatar != null) {
//            // Map Image → ImageDto
//            ImageDto avatarDto = modelMapper.map(avatar, ImageDto.class);
//
//            userDto.setAvatar(avatarDto);
//        }
        return userDto;
    }

}
