package com.example.backend.mapper;

import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {TrackMapper.class})
public interface UserMapper {

    UserResponse toResponse(User user);
}
