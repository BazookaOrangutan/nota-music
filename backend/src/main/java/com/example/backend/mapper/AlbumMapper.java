package com.example.backend.mapper;

import com.example.backend.dto.request.AlbumRequest;
import com.example.backend.dto.response.AlbumResponse;
import com.example.backend.model.Album;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {TrackMapper.class})
public interface AlbumMapper {

    AlbumResponse toResponse(Album album);

    Album fromRequest(AlbumRequest albumRequest);
}
