package com.example.backend.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class AlbumRequest {

    private UUID artistId;

    private String title;

    private LocalDate releaseDate;

    private List<TrackRequest> tracks;
}
