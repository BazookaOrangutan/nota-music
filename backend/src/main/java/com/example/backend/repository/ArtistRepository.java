package com.example.backend.repository;

import com.example.backend.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface ArtistRepository extends JpaRepository<Artist, UUID> {

    @Query("SELECT a FROM Artist a LEFT JOIN FETCH a.albums WHERE a.id = :id")
    Artist findWithAlbumsById(UUID id);
}
