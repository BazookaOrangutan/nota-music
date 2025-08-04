package com.example.backend.service;

import com.example.backend.model.Track;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerMapping;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads/albums";

    private final JwtService jwtService;
    private final UserService userDetailsService;

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

    public String updateTrackFile(Track track, MultipartFile file) throws IOException {

        String oldPath = track.getFilePath();

        String newFileName = file.getOriginalFilename();
        Path path = Paths.get(oldPath);
        String directoryPath = path.getParent().toString();

        try {
            Path newPath = Paths.get(directoryPath, newFileName);
            Files.copy(file.getInputStream(), newPath, StandardCopyOption.REPLACE_EXISTING);

            if (!newPath.getFileName().toString().equals(path.getFileName().toString())) {
                Files.deleteIfExists(path);
            }

            return newPath.toString();

        } catch (IOException e) {
            throw new RuntimeException("Не удалось заменить файл трека", e);
        }
    }

    public void deleteTrack(Track track) throws IOException {

        Path trackPath = Paths.get(track.getFilePath());

        if (!Files.exists(trackPath)) {
            return;
        }

        Files.delete(trackPath);
    }

    public ResponseEntity<?> serveTrack(HttpServletRequest request) {

        try {

            String token = request.getParameter("token");

            if (token == null || token.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is missing");
            }

            String username = jwtService.extractUserName(token);
            UserDetails userDetails = userDetailsService.getByUsername(username);
            if (username == null || !jwtService.isTokenValid(token, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);


            String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
            String filename = path.replace("/api/v1/files/tracks/albums", "");

            String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8);

            Path filePath = Paths.get(UPLOAD_DIR, decodedFilename);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            long fileLength = Files.size(filePath);


            String rangeHeader = request.getHeader("Range");
            if (rangeHeader == null || !rangeHeader.startsWith("bytes=")) {

                Resource resource = new UrlResource(filePath.toUri());
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("audio/mpeg"))
                        .contentLength(fileLength)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(resource);
            }


            long[] range = parseRange(rangeHeader, fileLength);
            long start = range[0];
            long end = range[1];
            long length = end - start + 1;

            InputStreamResource inputStreamResource = new InputStreamResource(
                    new BufferedInputStream(new FileInputStream(filePath.toFile())) {
                        {
                            skip(start);
                        }
                    });

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(MediaType.parseMediaType("audio/mpeg"))
                    .contentLength(length)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileLength)
                    .body(inputStreamResource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Файл не найден");
        }

    }

    private long[] parseRange(String rangeHeader, long fileLength) {
        String[] ranges = rangeHeader.substring(6).split("-");
        long start = Long.parseLong(ranges[0]);
        long end = Math.min(fileLength - 1, ranges.length > 1 ? Long.parseLong(ranges[1]) : fileLength - 1);
        return new long[]{start, end};
    }
}