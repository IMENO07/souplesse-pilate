package souplesse_pilates.studio.souplesse_pilates.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.CourseResponseDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(source = "instructor.id",        target = "instructorId")
    @Mapping(source = "course",               target = "coachFirstName", qualifiedByName = "resolveFirstName")
    @Mapping(source = "course",               target = "coachLastName",  qualifiedByName = "resolveLastName")
    @Mapping(source = "course",               target = "coachEmail",     qualifiedByName = "resolveEmail")
    CourseResponseDto toDto(Course course);

    /** Use explicit coach fields if set, otherwise fall back to the linked instructor entity. */
    @Named("resolveFirstName")
    default String resolveFirstName(Course c) {
        if (c.getCoachFirstName() != null && !c.getCoachFirstName().isBlank()) return c.getCoachFirstName();
        User ins = c.getInstructor();
        return ins != null ? ins.getFirstName() : null;
    }

    @Named("resolveLastName")
    default String resolveLastName(Course c) {
        if (c.getCoachLastName() != null && !c.getCoachLastName().isBlank()) return c.getCoachLastName();
        User ins = c.getInstructor();
        return ins != null ? ins.getLastName() : null;
    }

    @Named("resolveEmail")
    default String resolveEmail(Course c) {
        if (c.getCoachEmail() != null && !c.getCoachEmail().isBlank()) return c.getCoachEmail();
        User ins = c.getInstructor();
        return ins != null ? ins.getEmail() : null;
    }
}