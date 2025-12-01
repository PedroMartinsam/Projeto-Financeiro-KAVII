package com.curso.security;

import com.curso.domains.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class UserSS implements UserDetails {
  private final String username;
  private final String password;
  private final Collection<? extends GrantedAuthority> authorities;

  public UserSS(Usuario user) {
    this.username = user.getEmail();
    this.password = user.getSenha();
    this.authorities = user.getPersonType().stream()
        .map(pt -> new SimpleGrantedAuthority("ROLE_" + pt.getPersonType())) // ROLE_USER / ROLE_ADMIN
        .collect(Collectors.toSet());
  }
  @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
  @Override public String getPassword() { return password; }
  @Override public String getUsername() { return username; }
  @Override public boolean isAccountNonExpired() { return true; }
  @Override public boolean isAccountNonLocked() { return true; }
  @Override public boolean isCredentialsNonExpired() { return true; }
  @Override public boolean isEnabled() { return true; }
}
