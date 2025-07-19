package com.example.backend.service.impl;

import com.example.backend.dto.request.TrackRequest;
import com.example.backend.dto.response.TrackResponse;
import com.example.backend.exception.TrackNotFoundException;
import com.example.backend.mapper.TrackMapper;
import com.example.backend.model.Album;
import com.example.backend.model.Track;
import com.example.backend.repository.TrackRepository;
import com.example.backend.service.FileStorageService;
import com.example.backend.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TrackServiceImpl implements TrackService {

    private final TrackRepository trackRepository;
    private final TrackMapper trackMapper;
    private final FileStorageService fileStorageService;

    @Override
    public Track saveTrack(Track track) {
        return trackRepository.save(track);
    }

    @Override
    public List<Track> saveTracks(List<TrackRequest> data, MultipartFile[] files, Album album) throws IOException {

        List<Track> tracks = new ArrayList<>();
        for (int i = 0; i < files.length; i++) {

            Track track = trackMapper.toTrack(data.get(i));
            track.setAlbum(album);

            String filePath = fileStorageService.saveFile(files[i], album.getId());
            track.setFilePath(filePath);

            tracks.add(track);
        }

        return trackRepository.saveAll(tracks);
    }

    @Override
    public Track getTrackById(UUID id) {

        return trackRepository.findById(id)
                .orElseThrow(() -> new TrackNotFoundException(id));
    }

    @Override
    public Track updateTrack(UUID id, Track track) {

        if(!trackRepository.existsById(id)) {
            throw new TrackNotFoundException(id);
        }

        track.setId(id);

        return trackRepository.save(track);
    }

    @Override
    public void deleteTrackById(UUID id) {
        trackRepository.deleteById(id);
    }

    @Override
    public List<TrackResponse> getAllTracksByAlbumId(UUID albumId) {

        List<Track> tracks = trackRepository.findAll();

        return tracks.stream().map(trackMapper::toResponse).toList();
    }
}
