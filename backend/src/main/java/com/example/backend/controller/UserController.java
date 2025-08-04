package com.example.backend.controller;

import com.example.backend.dto.response.UserResponse;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.example.backend.constant.EndpointConstants.URL_USERS_API;

@RestController
@RequestMapping(URL_USERS_API)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("{id}")
    public UserResponse getUser(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @PostMapping("{userId}/favorites/{trackId}")
    public void addFavorite(@PathVariable UUID userId, @PathVariable UUID trackId) {
        userService.addTrackToFavorites(userId, trackId);
    }

    @DeleteMapping("{userId}/favorites/{trackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(@PathVariable UUID userId, @PathVariable UUID trackId) {
        userService.removeTrackFromFavorites(userId, trackId);
    }
}
