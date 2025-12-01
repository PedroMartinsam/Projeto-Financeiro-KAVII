package com.curso.services;

import com.curso.domains.Usuario;
import com.curso.repositories.UsuarioRepository;
import com.curso.security.UserSS;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    
    private final UsuarioRepository usuarioRepo;

    
    public UserDetailsServiceImpl(UsuarioRepository usuarioRepo) {
        
        this.usuarioRepo = usuarioRepo;
    }

    

@Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
  var usuario = usuarioRepo.findByEmail(email)
      .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
  return new UserSS(usuario); 
}
}
