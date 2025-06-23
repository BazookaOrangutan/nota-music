package com.example.backend.service.impl;

import com.example.backend.dto.response.TrackResponse;
import com.example.backend.exception.TrackNotFoundException;
import com.example.backend.mapper.TrackMapper;
import com.example.backend.model.Track;
import com.example.backend.repository.TrackRepository;
import com.example.backend.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackServiceImpl implements TrackService {

    private final TrackRepository trackRepository;
    private final TrackMapper trackMapper;

    @Override
    public Track createTrack(Track track) {
        return trackRepository.save(track);
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
