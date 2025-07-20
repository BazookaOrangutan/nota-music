package com.example.backend.service.impl;

import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.dto.response.ArtistResponse;
import com.example.backend.exception.ArtistNotFoundException;
import com.example.backend.mapper.AlbumMapper;
import com.example.backend.mapper.ArtistMapper;
import com.example.backend.model.Artist;
import com.example.backend.repository.AlbumRepository;
import com.example.backend.repository.ArtistRepository;
import com.example.backend.service.ArtistService;
import com.example.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;
    private final AlbumMapper albumMapper;

    private final ArtistMapper artistMapper;

    private final FileStorageService fileStorageService;

    @Override
    public Artist createArtist(Artist artist) {
        return artistRepository.save(artist);
    }

    @Override
    public Artist getArtist(UUID id) {

        return artistRepository.findById(id)
                .orElseThrow(() -> new ArtistNotFoundException(id));
    }

    @Transactional(readOnly = true)
    @Override
    public List<AlbumResponse> getAlbumsByArtistId(UUID id) {

        Artist artist = getArtist(id);
        return artist.getAlbums().stream().map(albumMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    @Override
    public List<ArtistResponse> getArtists() {
        return artistRepository.findAll().stream().map(artistMapper::toResponse).toList();
    }

    @Override
    public List<Artist> getArtistsByIds(List<UUID> ids) {
        return artistRepository.findAllById(ids);
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

        Artist artist = getArtist(id);

        artist.getAlbums().forEach(album -> {
            album.getArtists().remove(artist);
            if (album.getArtists().isEmpty()){
                try {
                    fileStorageService.deleteAlbum(album.getId());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }

                albumRepository.delete(album);
            }
        });

        artistRepository.deleteById(id);
    }
}
