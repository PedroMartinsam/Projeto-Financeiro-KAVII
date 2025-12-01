package com.curso.domains.dtos;

import com.curso.domains.Usuario;
import com.curso.domains.dtos.validation.OnCreate;
import com.curso.domains.enums.PersonType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class UsuarioDTO {

    private Long id;

    @NotBlank(message = "O campo nome não pode ser vazio")
    @NotNull(message = "O campo nome não pode ser nulo")
    private String nome;

    @NotBlank(message = "O campo e-mail não pode ser vazio")
    @NotNull(message = "O campo e-mail não pode ser nulo")
    private String email;

    private String senha;
    protected Set<String> personType = new HashSet<>();

    public UsuarioDTO() {
    }

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.senha = usuario.getSenha();
        this.personType = usuario.getPersonType().stream()
                .map(PersonType::getPersonType) // "ROLE_ADMIN", "ROLE_USER"
                .collect(Collectors.toSet());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "O campo nome não pode ser vazio") @NotNull(message = "O campo nome não pode ser nulo") String getNome() {
        return nome;
    }

    public void setNome(@NotBlank(message = "O campo nome não pode ser vazio") @NotNull(message = "O campo nome não pode ser nulo") String nome) {
        this.nome = nome;
    }

    public @NotBlank(message = "O campo e-mail não pode ser vazio") @NotNull(message = "O campo e-mail não pode ser nulo") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "O campo e-mail não pode ser vazio") @NotNull(message = "O campo e-mail não pode ser nulo") String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Set<String> getPersonType() { return personType; }


    public void setPersonType(Set<String> personType) { this.personType = personType; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioDTO that = (UsuarioDTO) o;
        return id == that.id && Objects.equals(senha, that.senha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, senha);
    }
}