package com.example.backend.mapper;

import com.example.backend.dto.request.ArtistRequest;
import com.example.backend.dto.response.ArtistResponse;
import com.example.backend.model.Album;
import com.example.backend.model.Artist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.UUID;


@Mapper(componentModel = "spring", uses = {AlbumMapper.class})
public interface ArtistMapper {

    @Mapping(target = "albumIds", expression = "java(mapAlbumsToIds(artist.getAlbums()))")
    ArtistResponse toResponse(Artist artist);

    Artist toArtist(ArtistRequest artistRequest);

    default List<UUID> mapAlbumsToIds(List<Album> albums) {
        if (albums == null) return null;
        return albums.stream().map(Album::getId).toList();
    }
}
