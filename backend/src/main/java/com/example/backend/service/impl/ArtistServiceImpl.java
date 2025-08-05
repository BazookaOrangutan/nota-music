package com.example.backend.service.impl;

import com.example.backend.dto.request.ArtistRequest;
import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.dto.response.ArtistResponse;
import com.example.backend.exception.ArtistNotFoundException;
import com.example.backend.mapper.AlbumMapper;
import com.example.backend.mapper.ArtistMapper;
import com.example.backend.model.Artist;
import com.example.backend.model.Track;
import com.example.backend.model.User;
import com.example.backend.repository.AlbumRepository;
import com.example.backend.repository.ArtistRepository;
import com.example.backend.repository.UserRepository;
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
    private final UserRepository userRepository;

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
    public ArtistResponse updateArtist(UUID id, ArtistRequest artistRequest) {

        if (!artistRepository.existsById(id)) {
            throw new ArtistNotFoundException(id);
        }

        Artist artist = artistMapper.toArtist(artistRequest);

        artist.setId(id);

        return artistMapper.toResponse(artistRepository.save(artist));
    }

    @Override
    @Transactional
    public void deleteArtist(UUID id) {

        Artist artist = getArtist(id);

        artist.getAlbums().forEach(album -> {
            album.getArtists().remove(artist);
            if (album.getArtists().isEmpty()) {
                try {
                    for (Track track : album.getTracks()) {
                        for (User user : track.getUsersWhoLikesTrack()) {
                            user.getFavouritesTracks().remove(track);
                        }
                        track.getUsersWhoLikesTrack().clear();
                    }

                    userRepository.saveAll(
                            album.getTracks().stream()
                                    .flatMap(t -> t.getUsersWhoLikesTrack().stream())
                                    .distinct()
                                    .toList()
                    );

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
