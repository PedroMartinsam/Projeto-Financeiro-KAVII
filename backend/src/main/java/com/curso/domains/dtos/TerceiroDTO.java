package com.curso.domains.dtos;

import com.curso.domains.Terceiro;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TerceiroDTO {


    private Long id;

    @NotNull (message = "O campo valor do razao social não pode ser nulo")
    @NotBlank (message = "O campo valor do razao social não pode ser vazio")
    private String razaoSocial;

    public TerceiroDTO() {
    }

    public TerceiroDTO(Terceiro terceiro) {
        this.id = terceiro.getId();
        this.razaoSocial = terceiro.getRazaoSocial();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull(message = "O campo valor do razao social não pode ser nulo") @NotBlank(message = "O campo valor do razao social não pode ser vazio") String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(@NotNull(message = "O campo valor do razao social não pode ser nulo") @NotBlank(message = "O campo valor do razao social não pode ser vazio") String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }
}