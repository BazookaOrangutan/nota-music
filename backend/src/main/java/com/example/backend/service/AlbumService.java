package com.example.backend.service;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.model.Album;

import java.util.List;
import java.util.UUID;

public interface AlbumService {

    Album createAlbum(AlbumRequest request);

    Album getAlbumById(UUID id);

    List<Album> getAllAlbums();

    Album updateAlbum(UUID id, Album album);

    void deleteAlbum(UUID id);

}
