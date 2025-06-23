package com.example.backend.service.impl;

import com.example.backend.exception.ArtistNotFoundException;
import com.example.backend.exception.TrackNotFoundException;
import com.example.backend.model.Artist;
import com.example.backend.repository.ArtistRepository;
import com.example.backend.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;

    @Override
    public Artist createArtist(Artist artist) {
        return artistRepository.save(artist);
    }

    @Override
    public Artist getArtist(UUID id) {

        return artistRepository.findById(id)
                .orElseThrow(() -> new ArtistNotFoundException(id));
    }

    @Override
    public List<Artist> getArtists() {
        return artistRepository.findAll();
    }

    @Override
    public Artist updateArtist(UUID id, Artist artist) {

        if(!artistRepository.existsById(id)) {
            throw new ArtistNotFoundException(id);
        }

        artist.setId(id);

        return artistRepository.save(artist);
    }

    @Override
    public void deleteArtist(UUID id) {
        artistRepository.deleteById(id);
    }
}
