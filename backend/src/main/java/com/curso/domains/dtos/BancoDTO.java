package com.curso.domains.dtos;

import com.curso.domains.Banco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

public class BancoDTO {


    private Long id;

    @NotNull(message = "O campo razaoSocial não pode ser nulo")
    @NotBlank(message = "O campo razaoSocial não pode estar vazio")
    private String razaoSocial;

    public BancoDTO() {
    }

    public BancoDTO(Banco banco) {
        this.id = banco.getId();
        this.razaoSocial = banco.getRazaoSocial();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long IdBanco) {
        this.id = IdBanco;
    }

    public @NotNull(message = "O campo razaoSocial não pode ser nulo") @NotBlank(message = "O campo razaoSocial não pode estar vazio") String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(@NotNull(message = "O campo razaoSocial não pode ser nulo") @NotBlank(message = "O campo razaoSocial não pode estar vazio") String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BancoDTO bancoDTO = (BancoDTO) o;
        return Objects.equals(id, bancoDTO.id) && Objects.equals(razaoSocial, bancoDTO.razaoSocial);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, razaoSocial);
    }
}