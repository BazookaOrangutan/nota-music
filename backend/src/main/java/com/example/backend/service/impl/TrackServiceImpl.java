package com.example.backend.service.impl;

import com.example.backend.dto.request.TrackRequest;
import com.example.backend.dto.response.TrackResponse;
import com.example.backend.exception.TrackNotFoundException;
import com.example.backend.mapper.TrackMapper;
import com.example.backend.model.Album;
import com.example.backend.model.Track;
import com.example.backend.model.User;
import com.example.backend.repository.TrackRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.FileStorageService;
import com.example.backend.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackServiceImpl implements TrackService {

    private final TrackRepository trackRepository;
    private final TrackMapper trackMapper;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

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
    public Track updateTrack(Track track, Album album) {

        track.setAlbum(album);

        return trackRepository.save(track);
    }

    @Override
    public void updateTrackFile(UUID trackId, MultipartFile file) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new TrackNotFoundException(trackId));

        try {
            String filePath = fileStorageService.updateTrackFile(track, file);

            track.setFilePath(filePath);
            trackRepository.save(track);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteTrackById(UUID id) {

        Track track = trackRepository.findById(id).orElseThrow(
                () -> new TrackNotFoundException(id));

        for (User user : track.getUsersWhoLikesTrack()) {
            user.getFavouritesTracks().remove(track);
        }
        track.getUsersWhoLikesTrack().clear();

        userRepository.saveAll(track.getUsersWhoLikesTrack());

        try {
            fileStorageService.deleteTrack(track);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        trackRepository.deleteById(id);
    }

    @Override
    public List<TrackResponse> getAllTracksByAlbumId(UUID albumId) {

        List<Track> tracks = trackRepository.findAll();

        return tracks.stream().map(trackMapper::toResponse).toList();
    }
}
