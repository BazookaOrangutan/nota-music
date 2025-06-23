package com.example.backend.dto.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class AlbumResponse {

    private UUID id;

    private String title;

//    private String artist;

    private List<TrackResponse> tracks;
}
