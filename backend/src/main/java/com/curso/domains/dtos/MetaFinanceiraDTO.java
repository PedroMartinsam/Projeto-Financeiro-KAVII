package com.curso.domains.dtos;

import com.curso.domains.MetaFinanceira;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MetaFinanceiraDTO {


    private Long id;

    @NotNull (message = "O campo valor do descrição não pode ser nulo")
    @NotBlank (message = "O campo valor do descrição não pode ser vazio")
    private String descricaoMeta;

    @NotNull (message = "O campo valor do valor da meta não pode ser nulo")
    @Digits(integer = 6, fraction = 2)
    private BigDecimal valorMeta;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataAlvo;

    public MetaFinanceiraDTO() {
    }

    public MetaFinanceiraDTO(MetaFinanceira metaFinanceira){
        this.id = metaFinanceira.getId();
        this.descricaoMeta = metaFinanceira.getDescricaoMeta();
        this.valorMeta = metaFinanceira.getValorMeta();
        this.dataAlvo = metaFinanceira.getDataAlvo();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull(message = "O campo valor do descrição não pode ser nulo") @NotBlank(message = "O campo valor do descrição não pode ser vazio") String getDescricaoMeta() {
        return descricaoMeta;
    }

    public void setDescricaoMeta(@NotNull(message = "O campo valor do descrição não pode ser nulo") @NotBlank(message = "O campo valor do descrição não pode ser vazio") String descricaoMeta) {
        this.descricaoMeta = descricaoMeta;
    }

    @NotNull(message = "O campo valor do valor da meta não pode ser nulo")
    @Digits(integer = 6, fraction = 2)
    public BigDecimal getValorMeta() {
        return valorMeta;
    }

    public void setValorMeta(@NotNull(message = "O campo valor do valor da meta não pode ser nulo") @Digits(integer = 6, fraction = 2) BigDecimal valorMeta) {
        this.valorMeta = valorMeta;
    }

    public LocalDate getDataAlvo() {
        return dataAlvo;
    }

    public void setDataAlvo(LocalDate dataAlvo) {
        this.dataAlvo = dataAlvo;
    }
}