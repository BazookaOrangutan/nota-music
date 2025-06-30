package com.example.backend.service;

import com.example.backend.dto.request.TrackRequest;
import com.example.backend.dto.response.TrackResponse;
import com.example.backend.model.Album;
import com.example.backend.model.Track;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Сервис управления треками
 */
public interface TrackService {

    /**
     * Создание трека
     *
     * @param track трек
     * @return созданный трек
     */
    Track saveTrack(Track track);

    /**
     * Сохранение треков
     *
     * @param data  данные треков
     * @param files файлы треков
     * @param album
     * @return список созданных треков
     */
    List<Track> saveTracks(List<TrackRequest> data, MultipartFile[] files, Album album) throws IOException;

    /**
     * Получение трека по его уникальному идентификатору
     *
     * @param id уникальный идентификатор трека
     * @return найденный трек
     */
    Track getTrackById(UUID id);

    /**
     * Обновление трека
     *
     * @param id уникальный идентификатор трека
     * @param track трек
     * @return обновленный трек
     */
    Track updateTrack(UUID id, Track track);

    /**
     * Удаление трека
     *
     * @param id уникальный идентификатор трека
     */
    void deleteTrackById(UUID id);

    /**
     * Получение списка всех треков
     *
     * @return список треков
     */
    List<TrackResponse> getAllTracksByAlbumId(UUID albumId);
}