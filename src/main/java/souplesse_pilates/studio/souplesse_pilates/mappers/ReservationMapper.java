package souplesse_pilates.studio.souplesse_pilates.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.ReservationResponseDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(source = "course.id",           target = "courseId")
    @Mapping(source = "course.type",         target = "courseType")
    @Mapping(source = "course.date",         target = "courseDate")
    @Mapping(source = "course.time",         target = "courseTime")
    ReservationResponseDto toDto(Reservation reservation);
}