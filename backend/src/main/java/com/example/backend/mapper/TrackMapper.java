package com.example.backend.mapper;

import com.example.backend.dto.request.TrackRequest;
import com.example.backend.dto.response.TrackResponse;
import com.example.backend.model.Track;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TrackMapper {

    TrackResponse toResponse(Track track);

    Track toTrack(TrackRequest trackRequest);
}
