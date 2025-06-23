package com.example.backend.controller;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.model.Album;
import com.example.backend.service.AlbumService;
import lombok.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.example.backend.constant.EndpointConstants.URL_ALBUM_API;

@RestController
@RequestMapping(URL_ALBUM_API)
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @GetMapping
    public List<Album> getAllAlbums() {
        return albumService.getAllAlbums();
    }

    @GetMapping("/{id}")
    public Album getAlbumById(@PathVariable UUID id) {
        return albumService.getAlbumById(id);
    }

    @PostMapping
    public Album createAlbum(@RequestBody AlbumRequest albumRequest) {
        return albumService.createAlbum(albumRequest);
    }

    @PutMapping("/{id}")
    public Album updateAlbum(@PathVariable UUID id, @RequestBody Album updatedAlbum) {
        return albumService.updateAlbum(id, updatedAlbum);
    }

    @DeleteMapping("/{id}")
    public void deleteAlbum(@PathVariable UUID id) {
        albumService.deleteAlbum(id);
    }


}
