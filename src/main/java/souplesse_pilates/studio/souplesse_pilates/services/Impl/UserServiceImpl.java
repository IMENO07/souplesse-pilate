package souplesse_pilates.studio.souplesse_pilates.services.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateInstructorRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UserRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;
import souplesse_pilates.studio.souplesse_pilates.services.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User findUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Override
    public User createUser(UserRequestDto userRequestDto) {
        if (userRepository.existsByEmail(userRequestDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + userRequestDto.getEmail());
        }

        User user = User.builder()
            .firstName(userRequestDto.getFirstname())
            .lastName(userRequestDto.getLastname())
            .email(userRequestDto.getEmail())
            .role(UserRole.CLIENT)
            .build();

        return userRepository.save(user);
    }

    @Override
public User getAdminByEmail(String email) {
    return userRepository.findByEmail(email)
        .filter(u -> u.getRole() == UserRole.ADMIN)
        .orElseThrow(() -> new EntityNotFoundException("Admin not found: " + email));
}

    @Override
    public User createInstructor(UserRequestDto userRequestDto) {
        if (userRepository.existsByEmail(userRequestDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + userRequestDto.getEmail());
        }

        User instructor = User.builder()
            .firstName(userRequestDto.getFirstname())
            .lastName(userRequestDto.getLastname())
            .email(userRequestDto.getEmail())
            .role(UserRole.INSTRUCTOR)
            .build();

        return userRepository.save(instructor);
    }

    @Override
    public User updateInstructor(Long id, UpdateInstructorRequestDto dto) {
        User instructor = userRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Instructor not found"));

        if (instructor.getRole() != UserRole.INSTRUCTOR) {
            throw new IllegalArgumentException("User is not an instructor");
        }

        // Vérifier email unique
        if (!instructor.getEmail().equals(dto.getEmail())
                && userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        instructor.setFirstName(dto.getFirstName());
        instructor.setLastName(dto.getLastName());
        instructor.setEmail(dto.getEmail());

        return userRepository.save(instructor);
    }

    @Override
    public void deleteInstructor(Long id) {

        User instructor = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Instructor not found"));

        if (instructor.getRole() != UserRole.INSTRUCTOR) {
            throw new IllegalArgumentException("User is not an instructor");
        }

        userRepository.delete(instructor);
    }
}

