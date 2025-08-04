package com.example.backend.service;

import com.example.backend.dto.request.ArtistRequest;
import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.dto.response.ArtistResponse;
import com.example.backend.model.Artist;

import java.util.List;
import java.util.UUID;

public interface ArtistService {

    Artist createArtist(Artist artist);

    Artist getArtist(UUID id);

    List<AlbumResponse> getAlbumsByArtistId(UUID id);

    List<ArtistResponse> getArtists();

    List<Artist> getArtistsByIds(List<UUID> ids);

    ArtistResponse updateArtist(UUID id, ArtistRequest artistRequest);

    void deleteArtist(UUID id);
}
