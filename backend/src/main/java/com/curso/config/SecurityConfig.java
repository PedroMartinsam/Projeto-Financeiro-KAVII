package com.curso.config;

import com.curso.security.JWTAuthenticationFilter;
import com.curso.security.JWTUtils;
import com.curso.services.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private static final String[] PUBLIC_URLS = {
            "/h2-console/**",
            "/auth/**",
            "/api/auth/**",
            "/swagger-ui/**", "/v3/api-docs/**", "/v3/api-docs.yaml",
            "/api/swagger-ui/**", "/api/v3/api-docs/**",
            "/error",
            "/actuator/**",
    };

    private final Environment env;
    private final JWTUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(Environment env, JWTUtils jwtUtils, UserDetailsServiceImpl uds) {
        this.env = env;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = uds;
    }



@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http.csrf(csrf -> csrf.disable());
  http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
  http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

  http.authorizeHttpRequests(auth -> auth
      .requestMatchers(PUBLIC_URLS).permitAll()
      .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
      .requestMatchers("/api/admin/**").hasAnyRole("ADMIN")         // sem ROLE_
      .requestMatchers("/api/**").hasAnyRole("USER","ADMIN")        // sem ROLE_
      .anyRequest().authenticated()
  );

  http.headers(h -> h.frameOptions(f -> f.disable())); // H2
  http.addFilterBefore(new JWTAuthenticationFilter(jwtUtils, userDetailsService),
      UsernamePasswordAuthenticationFilter.class);

  return http.build();
}


@Bean
public CorsConfigurationSource corsConfigurationSource() {
  CorsConfiguration cfg = new CorsConfiguration();
  cfg.setAllowedOriginPatterns(List.of("*"));
  cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
  cfg.setAllowedHeaders(List.of("Authorization","Content-Type","Accept"));
  cfg.setExposedHeaders(List.of("Authorization"));
  cfg.setAllowCredentials(false);
  UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/**", cfg);
  return source;
}

    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}
