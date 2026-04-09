package souplesse_pilates.studio.souplesse_pilates.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.CourseResponseDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    @Mapping(source = "instructor.id", target = "instructorId")
    CourseResponseDto toDto(Course course);

}