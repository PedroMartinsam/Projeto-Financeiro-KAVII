package com.curso.repositories;

import com.curso.domains.Conta;
import com.curso.domains.MetaFinanceira;
import com.curso.domains.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {

    Optional<Conta> findByDescricaoAndUsuarioId(String descricao, Long usuarioId);

}
