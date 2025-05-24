package com.example.back_end.dto;

import com.example.back_end.entity.Role;
import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String fullname;
    private String email;
    private String phone;
    private Boolean active = false;
    private Set<Role> roles;
}
