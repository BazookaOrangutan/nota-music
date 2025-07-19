package com.example.backend.controller;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.model.Album;
import com.example.backend.service.AlbumService;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public AlbumResponse getAlbumById(@PathVariable UUID id) {
        return albumService.getAlbumById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Album createAlbum(
            @RequestPart("album") AlbumRequest albumRequest,
            @RequestParam("files") MultipartFile[] files) throws IOException {
        return albumService.createAlbumWithTracks(albumRequest, files);
    }

    @PutMapping("/{id}")
    public Album updateAlbum(@PathVariable UUID id, @RequestBody Album updatedAlbum) {
        return albumService.updateAlbum(id, updatedAlbum);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAlbum(@PathVariable UUID id) {
        albumService.deleteAlbum(id);
    }


}
