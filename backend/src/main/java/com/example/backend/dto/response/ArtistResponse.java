package com.example.backend.dto.response;

import lombok.Data;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
public class ArtistResponse {

    private UUID id;

    private String name;

    private List<UUID> albumIds;
}
