package com.curso.security;

import com.curso.domains.Usuario;
import com.curso.repositories.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Long currentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;

        Object principal = auth.getPrincipal();
        String username = null;

        if (principal instanceof org.springframework.security.core.userdetails.UserDetails uds) {
            username = uds.getUsername();
        } else if (principal instanceof String s) { 
            username = s;
        }

        if (username == null) return null;

        return usuarioRepository.findByEmail(username)
                .map(Usuario::getId)
                .orElse(null);
    }

    public boolean isAdmin() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equalsIgnoreCase(a.getAuthority()) || "ADMIN".equalsIgnoreCase(a.getAuthority()));
    }
}
