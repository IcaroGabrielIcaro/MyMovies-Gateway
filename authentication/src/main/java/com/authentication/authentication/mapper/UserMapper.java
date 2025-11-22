package com.authentication.authentication.mapper;

import org.springframework.stereotype.Component;

import com.authentication.authentication.dto.UserResponse;
import com.authentication.authentication.model.User;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());

        return dto;
    }
}
