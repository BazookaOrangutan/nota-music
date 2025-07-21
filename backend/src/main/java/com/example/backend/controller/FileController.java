package com.example.backend.controller;

import com.example.backend.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.backend.constant.EndpointConstants.URL_FILES_API;

@RestController
@RequestMapping(URL_FILES_API)
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @GetMapping("/tracks/**")
    public ResponseEntity<?> serveTrack(HttpServletRequest request) {
        return fileStorageService.serveTrack(request);
    }
}
