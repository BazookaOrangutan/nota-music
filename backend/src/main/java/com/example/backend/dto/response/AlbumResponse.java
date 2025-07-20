package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class AlbumResponse {

    private UUID id;

    private String title;

    private LocalDate releaseDate;

    private List<TrackResponse> tracks;

    private List<UUID> artistIds;
}
