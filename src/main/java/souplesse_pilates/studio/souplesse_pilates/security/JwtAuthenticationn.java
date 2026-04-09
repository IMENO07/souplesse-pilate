package souplesse_pilates.studio.souplesse_pilates.security;

import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class JwtAuthenticationn extends UsernamePasswordAuthenticationToken {

    public JwtAuthenticationn(String email, Collection<? extends GrantedAuthority> authorities) {
        super(email, null, authorities);
    }
}
