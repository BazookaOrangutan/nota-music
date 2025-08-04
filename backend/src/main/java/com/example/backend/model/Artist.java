package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.*;

@Entity
@Data
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @ManyToMany(mappedBy = "artists")
    private List<Album> albums = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "feat_track_artist",
            joinColumns = @JoinColumn(name = "artist_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "track_id", referencedColumnName = "id"))
    private Set<Track> featTracks = new HashSet<>();
}
