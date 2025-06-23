package com.example.backend.controller;

import com.example.backend.model.Artist;
import com.example.backend.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.example.backend.constant.EndpointConstants.URL_ARTIST_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(URL_ARTIST_API)
public class ArtistController {

    private final ArtistService artistService;

    @GetMapping
    public List<Artist> getAllArtists() {
        return artistService.getArtists();
    }

    @GetMapping("/{id}")
    public Artist getArtistById(@PathVariable UUID id) {
        return artistService.getArtist(id);
    }

    @PostMapping
    public Artist createArtist(@RequestBody Artist artist) {
        return artistService.createArtist(artist);
    }


    @PutMapping("/{id}")
    public Artist updateArtist(@PathVariable UUID id, @RequestBody Artist updatedArtist) {
        return artistService.updateArtist(id, updatedArtist);
    }

    @DeleteMapping("/{id}")
    public void deleteArtist(@PathVariable UUID id) {
        artistService.deleteArtist(id);
    }
}
