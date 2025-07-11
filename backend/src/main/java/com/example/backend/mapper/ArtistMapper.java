package com.example.backend.mapper;

import com.example.backend.dto.request.ArtistRequest;
import com.example.backend.dto.response.ArtistResponse;
import com.example.backend.model.Artist;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ArtistMapper {

    ArtistResponse toResponse(Artist artist);

    Artist toArtist(ArtistRequest artistRequest);
}
