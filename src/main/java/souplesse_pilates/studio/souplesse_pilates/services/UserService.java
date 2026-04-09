package souplesse_pilates.studio.souplesse_pilates.services;

import java.util.List;

import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateInstructorRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UserRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;

public interface UserService {
    List<User> findAllUsers();
    User findUserById(Long id);
    User createUser(UserRequestDto userRequestDto);
    User getAdminByEmail(String email);
    User createInstructor(UserRequestDto userRequestDto);
    User updateInstructor(Long id, UpdateInstructorRequestDto dto);
    void deleteInstructor(Long id);
}
