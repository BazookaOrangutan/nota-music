package com.example.backend.service;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.model.Album;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface AlbumService {

    Album createAlbumWithTracks(AlbumRequest request, MultipartFile[] files) throws IOException;

    AlbumResponse getAlbumById(UUID id);

    List<Album> getAllAlbums();

    AlbumResponse updateAlbum(UUID id, AlbumRequest album);

    void deleteAlbum(UUID id);

}
