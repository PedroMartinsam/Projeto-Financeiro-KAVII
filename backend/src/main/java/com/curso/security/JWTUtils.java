package com.curso.security;

import com.curso.domains.Usuario;
import com.curso.domains.enums.PersonType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JWTUtils {

    @Value("${jwt.secret:change-me-please-256-bits-key}")
    private String secret;

    @Value("${jwt.expiration-ms:28800000}") // 8h
    private long expirationMs;

    private Key key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Usuario usuario) {
        final Date now = new Date();
        final Date exp = new Date(now.getTime() + expirationMs);

        final List<String> roles = usuario.getPersonType()
                .stream()
                .map(PersonType::name) // ou .map(PersonType::getPersonType)
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(usuario.getEmail()) // username
                .claim("uid", usuario.getId())
                .claim("roles", roles)          
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsername(String token) {
        try { return parse(token).getSubject(); }
        catch (Exception e) { return null; }
    }

    public Long getUid(String token) {
        try { return parse(token).get("uid", Long.class); }
        catch (Exception e) { return null; }
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        try { return (List<String>) parse(token).get("roles"); }
        catch (Exception e) { return java.util.Collections.emptyList(); }
    }

    public boolean isTokenValid(String token) {
        try { return parse(token).getExpiration().after(new Date()); }
        catch (Exception e) { return false; }
    }

    private Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
