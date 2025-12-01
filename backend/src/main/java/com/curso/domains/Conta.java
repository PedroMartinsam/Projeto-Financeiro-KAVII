package com.curso.domains;

import com.curso.domains.dtos.ContaDTO;
import com.curso.domains.enums.TipoConta;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "conta")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_conta")
    private Long id;

    @NotNull @NotBlank
    private String descricao;

    @NotNull
    @Column(precision = 11, scale = 2)
    @Digits(integer = 9,fraction = 2)
    private BigDecimal saldo;

    @NotNull
    @Column(precision = 11, scale = 2)
    @Digits(integer = 9,fraction = 2)
    private BigDecimal limite;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipoConta", nullable = false)
    private TipoConta tipoConta;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "idbanco")
    private Banco banco;

    @ManyToOne
    @JoinColumn(name = "idmetafinanceira")
    private MetaFinanceira metaFinanceira;


    @JsonIgnore
    @OneToMany(mappedBy = "conta")
    private List<Lancamento> lancamentos = new ArrayList<>();

    public List<Lancamento> getLancamentos() {
        return lancamentos;
    }

    public void setLancamentos(List<Lancamento> lancamentos) {
        this.lancamentos = lancamentos;
    }

    public Conta() {
    }

    public Conta(Long id, String descricao, BigDecimal saldo, BigDecimal limite, TipoConta tipoConta, Usuario usuario, Banco banco, MetaFinanceira metaFinanceira) {
        this.id = id;
        this.descricao = descricao;
        this.saldo = saldo;
        this.limite = limite;
        this.tipoConta = tipoConta;
        this.usuario = usuario;
        this.banco = banco;
        this.metaFinanceira = metaFinanceira;    }

    public Conta(ContaDTO dto) {
        this.id = dto.getId();
        this.descricao = dto.getDescricao();
        this.saldo = dto.getSaldo();
        this.limite = dto.getLimite();
        this.tipoConta = TipoConta.fromString(dto.getTipoConta());
        this.usuario = dto.getUsuario();
        this.banco = dto.getBanco();
        this.metaFinanceira = dto.getMetaFinanceira();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull @NotBlank String getDescricao() {
        return descricao;
    }

    public void setDescricao(@NotNull @NotBlank String descricao) {
        this.descricao = descricao;
    }

    public @NotNull @Digits(integer = 9, fraction = 2) BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(@NotNull @Digits(integer = 9, fraction = 2) BigDecimal saldo) {
        this.saldo = saldo;
    }

    public @NotNull @Digits(integer = 9, fraction = 2) BigDecimal getLimite() {
        return limite;
    }

    public void setLimite(@NotNull @Digits(integer = 9, fraction = 2) BigDecimal limite) {
        this.limite = limite;
    }

    public TipoConta getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(TipoConta tipoConta) {
        this.tipoConta = tipoConta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Banco getBanco() {
        return banco;
    }

    public void setBanco(Banco banco) {
        this.banco = banco;
    }

    public MetaFinanceira getMetaFinanceira() {
        return metaFinanceira;
    }

    public void setMetaFinanceira(MetaFinanceira metaFinanceira) {
        this.metaFinanceira = metaFinanceira;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Conta conta = (Conta) o;
        return Objects.equals(id, conta.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
