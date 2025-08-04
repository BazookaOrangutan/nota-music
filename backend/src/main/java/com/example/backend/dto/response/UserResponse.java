package com.example.backend.dto.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserResponse {

    private UUID id;

    private List<TrackResponse> favouritesTracks;
}
