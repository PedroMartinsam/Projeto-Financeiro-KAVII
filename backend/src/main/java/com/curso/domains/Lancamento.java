package com.curso.domains;

import com.curso.domains.dtos.LancamentoDTO;
import com.curso.domains.enums.Situacao;
import com.curso.domains.enums.TipoLancamento;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "lancamento")
public class Lancamento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_lancamento")
    private Long id;

    @NotNull @NotBlank
    private String descricao;

    @NotNull @NotBlank
    private String parcela;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataLancamento;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataVencimento;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataBaixa;

    @NotNull
    @Digits(integer = 15, fraction = 2)
    private BigDecimal valorDocumento;

    @NotNull
    @Digits(integer = 15, fraction = 2)
    private BigDecimal valorBaixado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_lancamento", nullable = false)
    private TipoLancamento tipoLancamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao", nullable = false)
    private Situacao situacao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idterceiro")
    private Terceiro terceiro;

    @ManyToOne
    @JoinColumn(name = "idcentrocusto")
    private CentroCusto centroCusto;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idconta")
    private Conta conta;

    public Lancamento() {}

    public Lancamento(Long id, String descricao, String parcela, LocalDate dataLancamento, LocalDate dataVencimento,
                      LocalDate dataBaixa, BigDecimal valorDocumento, BigDecimal valorBaixado,
                      TipoLancamento tipoLancamento, Situacao situacao,
                      Terceiro terceiro, CentroCusto centroCusto, Conta conta) {
        this.id = id;
        this.descricao = descricao;
        this.parcela = parcela;
        this.dataLancamento = dataLancamento;
        this.dataVencimento = dataVencimento;
        this.dataBaixa = dataBaixa;
        this.valorDocumento = valorDocumento;
        this.valorBaixado = valorBaixado;
        this.tipoLancamento = tipoLancamento;
        this.situacao = situacao;
        this.terceiro = terceiro;
        this.centroCusto = centroCusto;
        this.conta = conta;
        }

    public Lancamento(LancamentoDTO dto) {
        this.id = dto.getId();
        this.descricao = dto.getDescricao();
        this.parcela = dto.getParcela();
        this.dataLancamento = dto.getDataLancamento();
        this.dataVencimento = dto.getDataVencimento();
        this.dataBaixa = dto.getDataBaixa();
        this.valorDocumento = dto.getValorDocumento();
        this.valorBaixado = dto.getValorBaixado();
        this.tipoLancamento = TipoLancamento.fromString(dto.getTipoLancamento());
        this.situacao = Situacao.fromString(dto.getSituacao());
        this.terceiro = dto.getTerceiro();
        this.centroCusto = dto.getCentroCusto();
        this.conta = dto.getConta();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getParcela() { return parcela; }
    public void setParcela(String parcela) { this.parcela = parcela; }

    public LocalDate getDataLancamento() { return dataLancamento; }
    public void setDataLancamento(LocalDate dataLancamento) { this.dataLancamento = dataLancamento; }

    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }

    public LocalDate getDataBaixa() { return dataBaixa; }
    public void setDataBaixa(LocalDate dataBaixa) { this.dataBaixa = dataBaixa; }

    public BigDecimal getValorDocumento() { return valorDocumento; }
    public void setValorDocumento(BigDecimal valorDocumento) { this.valorDocumento = valorDocumento; }

    public BigDecimal getValorBaixado() { return valorBaixado; }
    public void setValorBaixado(BigDecimal valorBaixado) { this.valorBaixado = valorBaixado; }

    public TipoLancamento getTipoLancamento() { return tipoLancamento; }
    public void setTipoLancamento(TipoLancamento tipoLancamento) { this.tipoLancamento = tipoLancamento; }

    public Situacao getSituacao() { return situacao; }
    public void setSituacao(Situacao situacao) { this.situacao = situacao; }

    public Terceiro getTerceiro() { return terceiro; }
    public void setTerceiro(Terceiro terceiro) { this.terceiro = terceiro; }

    public CentroCusto getCentroCusto() { return centroCusto; }
    public void setCentroCusto(CentroCusto centroCusto) { this.centroCusto = centroCusto; }

    public Conta getConta() { return conta; }
    public void setConta(Conta conta) { this.conta = conta; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Lancamento that = (Lancamento) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
