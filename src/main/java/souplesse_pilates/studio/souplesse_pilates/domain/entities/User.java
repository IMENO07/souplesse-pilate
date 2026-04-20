package souplesse_pilates.studio.souplesse_pilates.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = "email")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name",nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    private String password;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}