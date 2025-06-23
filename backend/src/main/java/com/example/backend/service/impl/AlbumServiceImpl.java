package com.example.backend.service.impl;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.dto.request.TrackRequest;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.mapper.AlbumMapper;
import com.example.backend.mapper.TrackMapper;
import com.example.backend.model.Album;
import com.example.backend.model.Track;
import com.example.backend.repository.AlbumRepository;
import com.example.backend.service.AlbumService;
import com.example.backend.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final TrackService trackService;
    private final AlbumMapper albumMapper;
    private final TrackMapper trackMapper;

    @Override
    public Album createAlbum(AlbumRequest request) {

        List<Track> tracks = request.getTracks().stream().map(trackMapper::toTrack).toList();
        Album album = albumMapper.fromRequest(request);
        albumRepository.save(album);


        tracks.forEach(el -> {
            el.setAlbum(album);
            trackService.createTrack(el);
        });

        return album;
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
