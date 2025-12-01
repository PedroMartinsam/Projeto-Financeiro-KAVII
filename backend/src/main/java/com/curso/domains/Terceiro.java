package com.curso.domains;

import com.curso.domains.dtos.TerceiroDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import com.curso.domains.Usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "terceiro")
public class Terceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_terceiro")
    private Long id;

    @NotNull @NotBlank
    private String razaoSocial;

    @JsonIgnore
    @OneToMany(mappedBy = "terceiro")
    private List<Lancamento> lancamentos = new ArrayList<>();

    public List<Lancamento> getLancamentos() {
        return lancamentos;
    }

    public void setLancamentos(List<Lancamento> lancamentos) {
        this.lancamentos = lancamentos;
    }

    public Terceiro() {
    }

    public Terceiro(Long id, String razaoSocial) {
        this.id = id;
        this.razaoSocial = razaoSocial;
    }

    public Terceiro(TerceiroDTO dto) {
        this.id = dto.getId();
        this.razaoSocial = dto.getRazaoSocial();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull @NotBlank String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(@NotNull @NotBlank String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Terceiro terceiro = (Terceiro) o;
        return Objects.equals(id, terceiro.id) && Objects.equals(razaoSocial, terceiro.razaoSocial);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, razaoSocial);
    }
}
