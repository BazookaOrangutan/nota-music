package com.example.backend.service;

import com.example.backend.model.Artist;

import java.util.List;
import java.util.UUID;

public interface ArtistService {

    Artist createArtist(Artist artist);

    Artist getArtist(UUID id);

    List<Artist> getArtists();

    Artist updateArtist(UUID id, Artist artist);

    void deleteArtist(UUID id);
}
