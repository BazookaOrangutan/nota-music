package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.*;

@Entity
@Data
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;

    private LocalDate releaseDate;

    @OneToMany(mappedBy = "album", cascade = CascadeType.REMOVE)
    private List<Track> tracks;

    @ManyToMany
    @JoinTable(
            name = "album_artist",
            joinColumns = @JoinColumn(name = "album_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "artist_id", referencedColumnName = "id")
    )
    private List<Artist> artists = new ArrayList<>();
}
