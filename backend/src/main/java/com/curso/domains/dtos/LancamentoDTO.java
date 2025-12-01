package com.curso.domains.dtos;

import com.curso.domains.CentroCusto;
import com.curso.domains.Conta;
import com.curso.domains.Lancamento;
import com.curso.domains.Terceiro;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LancamentoDTO {

    private Long id;

    @NotNull(message = "O campo descricao não pode ser nulo")
    @NotBlank(message = "O campo descricao não pode ser vazio")
    private String descricao;

    @NotNull(message = "O campo parcela não pode ser nulo")
    @NotBlank(message = "O campo parcela não pode ser vazio")
    private String parcela;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataLancamento;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataVencimento;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataBaixa;

    @NotNull(message = "O campo valor do documento não pode ser nulo")
    @Digits(integer = 15, fraction = 2)
    private BigDecimal valorDocumento;

    @NotNull(message = "O campo baixado não pode ser nulo")
    @Digits(integer = 15, fraction = 2)
    private BigDecimal valorBaixado;

    // enviados/recebidos como texto pelo front
    private String tipoLancamento;
    private String situacao;

    private Terceiro terceiro;
    private CentroCusto centroCusto;
    private Conta conta;

    public LancamentoDTO() {}

    public LancamentoDTO(Lancamento lancamento) {
        this.id = lancamento.getId();
        this.descricao = lancamento.getDescricao();
        this.parcela = lancamento.getParcela();
        this.dataLancamento = lancamento.getDataLancamento();
        this.dataVencimento = lancamento.getDataVencimento();
        this.dataBaixa = lancamento.getDataBaixa();
        this.valorDocumento = lancamento.getValorDocumento();
        this.valorBaixado = lancamento.getValorBaixado();

        this.tipoLancamento = lancamento.getTipoLancamento().name();
        this.situacao = lancamento.getSituacao().name();

        this.terceiro = lancamento.getTerceiro();
        this.centroCusto = lancamento.getCentroCusto();
        this.conta = lancamento.getConta();
    }

    // getters/setters …

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

    public String getTipoLancamento() { return tipoLancamento; }
    public void setTipoLancamento(String tipoLancamento) { this.tipoLancamento = tipoLancamento; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public Terceiro getTerceiro() { return terceiro; }
    public void setTerceiro(Terceiro terceiro) { this.terceiro = terceiro; }

    public CentroCusto getCentroCusto() { return centroCusto; }
    public void setCentroCusto(CentroCusto centroCusto) { this.centroCusto = centroCusto; }

    public Conta getConta() { return conta; }
    public void setConta(Conta conta) { this.conta = conta; }
}
