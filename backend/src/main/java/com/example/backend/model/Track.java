package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.*;

@Entity
@Data
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;

    private String filePath;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;

    @ManyToMany
    @JoinTable(name = "feat_track_artist",
            joinColumns = @JoinColumn(name = "track_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "artist_id", referencedColumnName = "id"))
    private Set<Artist> featArtists = new HashSet<>();

    @ManyToMany(mappedBy = "favouritesTracks")
    private List<User> usersWhoLikesTrack = new ArrayList<>();

}
