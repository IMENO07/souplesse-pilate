package souplesse_pilates.studio.souplesse_pilates.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.AdminLoginRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.services.JwtService;
import souplesse_pilates.studio.souplesse_pilates.services.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AdminLoginRequestDto loginRequest) {

        User admin = userService.getAdminByEmail(loginRequest.getEmail());

        if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(admin.getEmail(), admin.getRole().name());
        return ResponseEntity.ok(Map.of("token", token));
    }
}