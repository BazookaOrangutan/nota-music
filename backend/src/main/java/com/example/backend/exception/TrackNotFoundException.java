package com.example.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class TrackNotFoundException extends RuntimeException {

  public TrackNotFoundException(UUID id) {
    super("Track not found with ID: " + id);
  }
}