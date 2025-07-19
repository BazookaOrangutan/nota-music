package com.example.backend.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerMapping;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads/albums";

    public String saveFile(MultipartFile file, UUID albumId) throws IOException {
        String uniqueFileName = file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + "/" + albumId).resolve(Objects.requireNonNull(uniqueFileName));

        if (!Files.exists(filePath.getParent())) {
            Files.createDirectories(filePath.getParent());
        }

        file.transferTo(filePath);

        return filePath.toString();
    }

    public void deleteAlbum(UUID albumId) throws IOException {

        Path albumDir = Paths.get(UPLOAD_DIR, albumId.toString());

        if (!Files.exists(albumDir)) {
            return;
        }

        try (Stream<Path> walk = Files.walk(albumDir)) {
            walk.sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            throw new RuntimeException("Ошибка при удалении файла: " + path, e);
                        }
                    });
        } catch (RuntimeException e) {
            Throwable cause = e.getCause();
            throw new RuntimeException("Не удалось удалить файлы альбома", cause != null ? cause : e);
        }
    }

    public Resource serveTrack(HttpServletRequest request) {

        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);

        String filename = path.replace("/api/v1/files/tracks/albums", "");

        String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8);

        Path filePath = Paths.get(UPLOAD_DIR, decodedFilename);

        try {
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new FileNotFoundException("Файл не найден: " + filePath);
            }

            return resource;

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Не удалось загрузить файл", e);
        }
    }
}