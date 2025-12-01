package com.curso.domains;

import com.curso.domains.dtos.MetaFinanceiraDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "metafinanceira")
public class MetaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_metafinanceira")
    private Long id;

    @NotNull @NotBlank
    private String descricaoMeta;

    @NotNull
    @Digits(integer = 6, fraction = 2)
    private BigDecimal valorMeta;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataAlvo;

    @JsonIgnore
    @OneToMany(mappedBy = "metaFinanceira")
    private List<Conta> contas = new ArrayList<>();

    public List<Conta> getContas() {
        return contas;
    }

    public void setContas(List<Conta> contas) {
        this.contas = contas;
    }


    /** JPA precisa deste construtor (pode ser protected). */
    protected MetaFinanceira() {
    }

    /** Construtor sem usuário (como você pediu). */
    public MetaFinanceira(Long id, String descricaoMeta, BigDecimal valorMeta, LocalDate dataAlvo) {
        this.id = id;
        this.descricaoMeta = descricaoMeta;
        this.valorMeta = valorMeta;
        this.dataAlvo = dataAlvo;
    }

    /** Construtor a partir do DTO. */
    public MetaFinanceira(@org.jetbrains.annotations.NotNull MetaFinanceiraDTO dto) {
        this.id = dto.getId();
        this.descricaoMeta = dto.getDescricaoMeta();
        this.valorMeta = dto.getValorMeta();
        this.dataAlvo = dto.getDataAlvo();
    }

    // getters e setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricaoMeta() { return descricaoMeta; }
    public void setDescricaoMeta(String descricaoMeta) { this.descricaoMeta = descricaoMeta; }

    public BigDecimal getValorMeta() { return valorMeta; }
    public void setValorMeta(BigDecimal valorMeta) { this.valorMeta = valorMeta; }

    public LocalDate getDataAlvo() { return dataAlvo; }
    public void setDataAlvo(LocalDate dataAlvo) { this.dataAlvo = dataAlvo; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetaFinanceira that = (MetaFinanceira) o;
        return Objects.equals(id, that.id) && Objects.equals(descricaoMeta, that.descricaoMeta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, descricaoMeta);
    }
}
