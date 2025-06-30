package com.example.backend.service.impl;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.mapper.AlbumMapper;
import com.example.backend.model.Album;
import com.example.backend.model.Artist;
import com.example.backend.model.Track;
import com.example.backend.repository.AlbumRepository;
import com.example.backend.service.AlbumService;
import com.example.backend.service.ArtistService;
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


    @Override
    @Transactional
    public Album createAlbumWithTracks(AlbumRequest request, MultipartFile[] files) throws IOException {

        Album album = albumMapper.fromRequest(request);

        Artist artist = artistService.getArtist(request.getArtistId());
        album.getArtists().add(artist);

        List<Track> tracks = trackService.saveTracks(request.getTracks(), files, album);

        album.setTracks(tracks);

        return albumRepository.save(album);
    }

    @Override
    public Album getAlbumById(UUID id) {

        return albumRepository.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id));
    }

    @Override
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    @Override
    public Album updateAlbum(UUID id, Album album) {

        if(!albumRepository.existsById(id)) {
            throw new AlbumNotFoundException(id);
        }

        album.setId(id);

        return albumRepository.save(album);
    }

    @Override
    public void deleteAlbum(UUID id) {
        albumRepository.deleteById(id);
    }
}
