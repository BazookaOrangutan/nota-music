package com.example.backend.service.impl;

import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.dto.response.ArtistResponse;
import com.example.backend.exception.ArtistNotFoundException;
import com.example.backend.mapper.AlbumMapper;
import com.example.backend.mapper.ArtistMapper;
import com.example.backend.model.Artist;
import com.example.backend.repository.ArtistRepository;
import com.example.backend.service.ArtistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;
    private final AlbumMapper albumMapper;

    private final ArtistMapper artistMapper;

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
    public List<AlbumResponse> getAlbumsByArtistId(UUID id) {

        Artist artist = getArtist(id);

        return artist.getAlbums().stream().map(albumMapper::toResponse).toList();
    }

    @Transactional
    @Override
    public List<ArtistResponse> getArtists() {
        return artistRepository.findAll().stream().map(artistMapper::toResponse).toList();
    }

    @Override
    public Artist updateArtist(UUID id, Artist artist) {

        if (!artistRepository.existsById(id)) {
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
