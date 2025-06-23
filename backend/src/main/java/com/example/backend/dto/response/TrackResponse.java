package com.example.backend.dto.response;

import lombok.Data;

import java.util.UUID;

@Data
public class TrackResponse {

    private UUID trackId;

    private String title;

}
