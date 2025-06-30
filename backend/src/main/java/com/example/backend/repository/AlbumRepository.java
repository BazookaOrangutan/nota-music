package com.example.backend.repository;

import com.example.backend.model.Album;
import com.example.backend.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface AlbumRepository extends JpaRepository<Album, UUID> {

    List<Album> findAllByArtists(Set<Artist> artists);
}
