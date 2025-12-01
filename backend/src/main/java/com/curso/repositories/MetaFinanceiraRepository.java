package com.curso.repositories;

import com.curso.domains.MetaFinanceira;
import com.curso.domains.Terceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MetaFinanceiraRepository extends JpaRepository<MetaFinanceira, Long> {
    Optional<MetaFinanceira> findByDescricaoMeta(String email);
}
