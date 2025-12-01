package com.curso.domains;

import com.curso.domains.dtos.UsuarioDTO;
import com.curso.domains.enums.PersonType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_usuario")
    private Long id;

    @NotNull @NotBlank
    private String nome;

    @NotNull @NotBlank
    private String email;

    @NotNull @NotBlank
    private String senha;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "perfis", joinColumns = @JoinColumn(name = "person_id"))
    @Column(name = "person_type")
    protected Set<Integer> personType = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<Conta> contas = new ArrayList<>();

    public List<Conta> getContas() {
        return contas;
    }

    public void setContas(List<Conta> contas) {
        this.contas = contas;
    }

    public void setPersonType(Set<Integer> personType) {
        this.personType = personType;
    }

    public Usuario() {addPersonType(PersonType.USER);
    }

    public Usuario(Long id, String nome, String email, String senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        addPersonType(PersonType.USER);
    }

    public Usuario(UsuarioDTO dto) {
        this.id = dto.getId();
        this.nome = dto.getNome();
        this.email = dto.getEmail();
        this.senha = dto.getSenha();
        if (dto.getPersonType() != null && !dto.getPersonType().isEmpty()) {
            for (String r : dto.getPersonType()) addPersonType(PersonType.fromRole(r));
        } else {
            addPersonType(PersonType.USER);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull @NotBlank String getNome() {
        return nome;
    }

    public void setNome(@NotNull @NotBlank String nome) {
        this.nome = nome;
    }

    public @NotNull @NotBlank String getEmail() {
        return email;
    }

    public void setEmail(@NotNull @NotBlank String email) {
        this.email = email;
    }

    public @NotNull @NotBlank String getSenha() {
        return senha;
    }

    public void setSenha(@NotNull @NotBlank String senha) {
        this.senha = senha;
    }

    public Set<PersonType> getPersonType() {
        return personType.stream().map(PersonType::toEnum).collect(Collectors.toSet());
    }
    public void addPersonType(PersonType personType) { this.personType.add(personType.getId()); }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return id == usuario.id && Objects.equals(nome, usuario.nome) && Objects.equals(email, usuario.email) && Objects.equals(senha, usuario.senha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, email, senha);
    }
}
