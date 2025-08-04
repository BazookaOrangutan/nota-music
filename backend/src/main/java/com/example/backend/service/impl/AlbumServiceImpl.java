package com.example.backend.service.impl;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.mapper.AlbumMapper;
import com.example.backend.model.Album;
import com.example.backend.model.Artist;
import com.example.backend.model.Track;
import com.example.backend.model.User;
import com.example.backend.repository.AlbumRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AlbumService;
import com.example.backend.service.ArtistService;
import com.example.backend.service.FileStorageService;
import com.example.backend.service.TrackService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final AlbumMapper albumMapper;

    private final ArtistService artistService;
    private final TrackService trackService;

    private final FileStorageService fileStorageService;

    private final UserRepository userRepository;

    @Override
    @Transactional
    public Album createAlbumWithTracks(AlbumRequest request, MultipartFile[] files) throws IOException {

        Album album = albumMapper.fromRequest(request);

        List<Artist> artists = artistService.getArtistsByIds(request.getArtistIds());
        album.getArtists().addAll(artists);

        Album createdAlbum = albumRepository.save(album);

        List<Track> tracks = trackService.saveTracks(request.getTracks(), files, createdAlbum);

        createdAlbum.setTracks(tracks);

        return albumRepository.save(createdAlbum);
    }

    @Override
    public AlbumResponse getAlbumById(UUID id) {

        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id));

        return albumMapper.toResponse(album);
    }

    @Override
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    @Override
    public AlbumResponse updateAlbum(UUID id, AlbumRequest albumRequest) {

        if (!albumRepository.existsById(id)) {
            throw new AlbumNotFoundException(id);
        }

        Album album = albumMapper.fromRequest(albumRequest);

        album.setId(id);

        albumRequest.getArtistIds().forEach(artistId -> album.getArtists().add(artistService.getArtist(artistId)));

        album.getTracks().forEach(track -> trackService.updateTrack(track, album));

        return albumMapper.toResponse(albumRepository.save(album));
    }

    @Override
    public void deleteAlbum(UUID id) {

        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id));

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

        try {
            fileStorageService.deleteAlbum(id);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        albumRepository.deleteById(id);
    }
}
