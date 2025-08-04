package com.example.backend.mapper;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.model.Album;
import com.example.backend.model.Artist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring", uses = {TrackMapper.class})
public interface AlbumMapper {

    @Mapping(source = "artists", target = "artistIds", qualifiedByName = "mapArtistIds")
    AlbumResponse toResponse(Album album);

    Album fromRequest(AlbumRequest albumRequest);

//    Album fromUpdateRequest(AlbumUpdateRequest albumUpdateRequest);

    @Named("mapArtistIds")
    default List<UUID> mapArtistIds(List<Artist> artists) {
        return artists != null
                ? artists.stream().map(Artist::getId).toList()
                : Collections.emptyList();
    }
}
