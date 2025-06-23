package com.example.backend.exception;

import java.util.UUID;

public class AlbumNotFoundException extends RuntimeException {

    public AlbumNotFoundException(UUID id) {
        super("Album not found with ID: " + id);
    }
}
