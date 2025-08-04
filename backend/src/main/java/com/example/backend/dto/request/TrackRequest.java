package com.example.backend.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class TrackRequest {

    private UUID id;

    private String title;

    private String filePath;
}
