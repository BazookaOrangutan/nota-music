package com.example.backend.controller;

import com.example.backend.dto.response.TrackResponse;
import com.example.backend.model.Track;
import com.example.backend.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

import static com.example.backend.constant.EndpointConstants.URL_TRACK_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(URL_TRACK_API)
public class TrackController {
    
    private final TrackService trackService;

    @GetMapping("/album/{albumId}")
    public List<TrackResponse> getAllTracksByAlbumId(@PathVariable UUID albumId) {
        return trackService.getAllTracksByAlbumId(albumId);
    }

    @GetMapping("/{id}")
    public Track getTrackById(@PathVariable UUID id) {
        return trackService.getTrackById(id);
    }

    @PostMapping
    public Track createTrack(@RequestBody Track track) {
        return trackService.saveTrack(track);
    }


    @PutMapping("/{id}/file")
    public void updateTrackFile(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        trackService.updateTrackFile(id, file);
    }

    @DeleteMapping("/{id}")
    public void deleteTrack(@PathVariable UUID id) {
        trackService.deleteTrackById(id);
    }
}
