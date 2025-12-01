package com.curso.repositories;

import com.curso.domains.Terceiro;
import com.curso.domains.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TerceiroRepository extends JpaRepository<Terceiro, Long> {
    Optional<Terceiro> findByRazaoSocial(String razaoSocial);

}
