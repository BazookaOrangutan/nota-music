package com.example.backend.exception;

import java.util.UUID;

public class ArtistNotFoundException extends RuntimeException {

    public ArtistNotFoundException(UUID id) {
        super("Artist not found with ID: " + id);
    }
}
