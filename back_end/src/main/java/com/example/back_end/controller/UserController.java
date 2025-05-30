package com.example.back_end.controller;

import com.example.back_end.dto.UserDto;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.User;
import com.example.back_end.repositories.UserRepository;
import com.example.back_end.service.UserService;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @PostMapping("/createUser")
    ApiResponse<User> createUser(@RequestBody @Valid UserCreationRequest request){
        ApiResponse<User> response = new ApiResponse<>();
        response.setResult(userService.createRequest(request));
        return response;
    }
    @GetMapping("/all")
    List<User> getUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}",authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return userService.getUsers(); }
    @GetMapping("/id/{userId}")
    ApiResponse<UserDto>getUserById(@PathVariable int userId){
        UserDto userDto = modelMapper.map( userService.getUserById(userId),UserDto.class);
        return ApiResponse.<UserDto>builder().result(userDto).build();
    }
    @PostMapping("/existUser")
    ApiResponse<Boolean> existUser(@RequestParam ("email") String email) {
        boolean rs = true;
        if (userRepository.findByEmail(email).isEmpty()) {
            rs = false;
        }
        return ApiResponse.<Boolean>builder().result(rs).build();
    }
}
