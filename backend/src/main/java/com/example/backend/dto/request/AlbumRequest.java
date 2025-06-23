package com.example.backend.dto.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class AlbumRequest {

//    private UUID artistId;

    private String title;

    private List<TrackRequest> tracks;
}
