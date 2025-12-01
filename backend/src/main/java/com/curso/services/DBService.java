package com.curso.services;

import com.curso.domains.*;
import com.curso.domains.enums.Situacao;
import com.curso.domains.enums.TipoConta;
import com.curso.domains.enums.TipoLancamento;
import com.curso.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

import static com.curso.domains.enums.PersonType.ADMIN;
import static com.curso.domains.enums.PersonType.USER;

/**
 * DBService
 * ----------------------------------------------------------------------------
 * Serviço de carga/seed de dados para ambiente de desenvolvimento.
 * Ordem de persistência (respeitando dependências):
 * 1) Bancos
 * 2) Usuário
 * 3) Metas Financeiras
 * 4) Centros de Custo
 * 5) Terceiros
 * 6) Contas (1 conta por meta)
 * 7) Lançamentos (exemplos por conta)
 *
 * Observação: rodar várias vezes sem limpar base gerará duplicidades.
 */
@Service
public class DBService {

    // =========================================================================
    // Repositórios
    // =========================================================================
    @Autowired private BancoRepository bancoRepo;
    @Autowired private CentroCustoRepository centroCustoRepo;
    @Autowired private ContaRepository contaRepo;
    @Autowired private LancamentoRepository lancamentoRepo;
    @Autowired private MetaFinanceiraRepository metaFinanceiraRepo;
    @Autowired private TerceiroRepository terceiroRepo;
    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private PasswordEncoder encoder;

    /**
     * Popula a base com dados mínimos.
     */
    public void initDB() {

        // =====================================================================
        // 1) Bancos
        // =====================================================================
        Banco banco01 = new Banco(null, "Santander");
        bancoRepo.save(banco01);

        Banco banco02 = new Banco(null, "XP Investimentos");
        bancoRepo.save(banco02);

        Banco banco03 = new Banco(null, "Nubank");
        bancoRepo.save(banco03);

        Banco banco04 = new Banco(null, "Alelo");
        bancoRepo.save(banco04);

        Banco banco05 = new Banco(null, "Caixa Econômica Federal");
        bancoRepo.save(banco05);

        // =====================================================================
        // 2) Usuário
        // =====================================================================
        Usuario usuario01 = new Usuario(null, "Pedro Martins", "pedromartinsstr@gmail.com", encoder.encode("4215"));
        usuario01.addPersonType(USER);
        usuario01.addPersonType(ADMIN);
        usuarioRepo.save(usuario01);

        // =====================================================================
        // 3) Metas Financeiras (sem vínculo obrigatório com usuário)
        // =====================================================================
        MetaFinanceira metaFinanceira01 = new MetaFinanceira(
                null,
                "Montar uma reserva para emergências",
                new BigDecimal("4000.00"),
                LocalDate.of(2026, 3, 1)
        );
        MetaFinanceira metaFinanceira02 = new MetaFinanceira(
                null,
                "Investir para juntar entrada de um carro",
                new BigDecimal("25000.00"),
                LocalDate.of(2027, 12, 15)
        );
        MetaFinanceira metaFinanceira03 = new MetaFinanceira(
                null,
                "Fazer uma viagem internacional",
                new BigDecimal("15000.00"),
                LocalDate.of(2028, 7, 20)
        );
        MetaFinanceira metaFinanceira04 = new MetaFinanceira(
                null,
                "Criar fundo de estudos para especialização",
                new BigDecimal("8000.00"),
                LocalDate.of(2026, 10, 5)
        );
        MetaFinanceira metaFinanceira05 = new MetaFinanceira(
                null,
                "Reserva para alimentação e mercado (Alelo)",
                new BigDecimal("1200.00"),
                LocalDate.of(2026, 1, 31)
        );

        metaFinanceiraRepo.save(metaFinanceira01);
        metaFinanceiraRepo.save(metaFinanceira02);
        metaFinanceiraRepo.save(metaFinanceira03);
        metaFinanceiraRepo.save(metaFinanceira04);
        metaFinanceiraRepo.save(metaFinanceira05);

        // =====================================================================
        // 4) Centros de Custo (comentários apenas informativos)
        // =====================================================================
        CentroCusto centroCusto01 = new CentroCusto(null, "Emergências e Imprevistos"); // meta 01
        centroCustoRepo.save(centroCusto01);

        CentroCusto centroCusto02 = new CentroCusto(null, "Transporte e Veículos"); // meta 02
        centroCustoRepo.save(centroCusto02);

        CentroCusto centroCusto03 = new CentroCusto(null, "Viagens e Lazer"); // meta 03
        centroCustoRepo.save(centroCusto03);

        CentroCusto centroCusto04 = new CentroCusto(null, "Educação e Cursos"); // meta 04
        centroCustoRepo.save(centroCusto04);

        CentroCusto centroCusto05 = new CentroCusto(null, "Alimentação e Mercado"); // meta 05 (Alelo)
        centroCustoRepo.save(centroCusto05);

        // =====================================================================
        // 5) Terceiros
        // =====================================================================
        Terceiro terceiro01 = new Terceiro(null, "Fundo de Assistência Financeira Pessoal"); // meta 01
        terceiroRepo.save(terceiro01);

        Terceiro terceiro02 = new Terceiro(null, "AutoCar Veículos e Financiamentos Ltda"); // meta 02
        terceiroRepo.save(terceiro02);

        Terceiro terceiro03 = new Terceiro(null, "Travel World Agência de Turismo Internacional"); // meta 03
        terceiroRepo.save(terceiro03);

        Terceiro terceiro04 = new Terceiro(null, "EduPro Cursos e Especializações"); // meta 04
        terceiroRepo.save(terceiro04);

        Terceiro terceiro05 = new Terceiro(null, "Alelo Benefícios – Cartão Alimentação"); // meta 05 (Alelo)
        terceiroRepo.save(terceiro05);

        // =====================================================================
        // 6) Contas — 1 conta para cada meta
        //     Associa cada conta a: (usuario01, bancoX, metaFinanceiraX)
        //     Limite/saldo iniciais meramente ilustrativos.
        // =====================================================================

        // Meta 01 (Emergências) -> Conta Corrente Santander
        Conta conta01 = new Conta(
                null,
                "Conta Corrente Santander – Despesas Emergenciais",
                new BigDecimal("1000.00"),   // limite (ex.: cheque especial)
                new BigDecimal("12000.00"),  // saldo inicial
                TipoConta.CONTA_CORRENTE,
                usuario01,
                banco01,
                metaFinanceira01
        );
        contaRepo.save(conta01);

        // Meta 02 (Entrada do Carro) -> Conta de Investimento XP
        Conta conta02 = new Conta(
                null,
                "Conta Investimento XP – Entrada do Carro",
                new BigDecimal("0.00"),
                new BigDecimal("5000.00"),
                TipoConta.CONTA_INVESTIMENTO,
                usuario01,
                banco02,
                metaFinanceira02
        );
        contaRepo.save(conta02);

        // Meta 03 (Viagem Internacional) -> Cartão de Crédito Nubank
        Conta conta03 = new Conta(
                null,
                "Cartão de Crédito Nubank – Viagem Internacional",
                new BigDecimal("7000.00"),   // limite do cartão
                new BigDecimal("0.00"),      // saldo não se aplica; manter 0.00
                TipoConta.CARTAO_CREDITO,
                usuario01,
                banco03,
                metaFinanceira03
        );
        contaRepo.save(conta03);

        // Meta 04 (Estudos) -> Poupança Caixa
        Conta conta04 = new Conta(
                null,
                "Poupança Caixa – Fundo de Estudos",
                new BigDecimal("0.00"),
                new BigDecimal("2000.00"),
                TipoConta.POUPANCA,
                usuario01,
                banco05,
                metaFinanceira04
        );
        contaRepo.save(conta04);

        // Meta 05 (Alimentação Alelo) -> Cartão Alimentação Alelo
        Conta conta05 = new Conta(
                null,
                "Cartão Alimentação Alelo – Mercado",
                new BigDecimal("1200.00"),   // limite mensal do benefício
                new BigDecimal("0.00"),
                TipoConta.CARTAO_ALIMENTACAO,
                usuario01,
                banco04,
                metaFinanceira05
        );
        contaRepo.save(conta05);

        // =====================================================================
        // 7) Lançamentos (exemplos por conta)
        // =====================================================================

        // Conta 01 (Emergências)
        Lancamento lancamento01 = new Lancamento(
                null,
                "Compra de remédios",
                "1",
                LocalDate.of(2025, 9, 2),   // emissão
                LocalDate.of(2025, 9, 2),   // competência
                LocalDate.of(2025, 9, 3),   // pagamento
                new BigDecimal("180.00"),
                new BigDecimal("180.00"),
                TipoLancamento.DEBITO,
                Situacao.BAIXADO,
                terceiro01,
                centroCusto01,
                conta01
        );
        lancamentoRepo.save(lancamento01);

        // Conta 02 (Entrada do Carro)
        Lancamento lancamento02 = new Lancamento(
                null,
                "Aporte para entrada de veículo",
                "INV-CAR-2025-001",
                LocalDate.of(2025, 10, 10),
                LocalDate.of(2025, 10, 10),
                LocalDate.of(2025, 10, 10),
                new BigDecimal("1000.00"),
                new BigDecimal("1000.00"),
                TipoLancamento.CREDITO,
                Situacao.BAIXADO,
                terceiro02,
                centroCusto02,
                conta02
        );
        lancamentoRepo.save(lancamento02);

        // Conta 03 (Viagem Internacional)
        Lancamento lancamento03 = new Lancamento(
                null,
                "Compra de passagens",
                "TRAVEL-INT-001",
                LocalDate.of(2025, 11, 5),
                LocalDate.of(2025, 11, 5),
                LocalDate.of(2025, 11, 5),
                new BigDecimal("3200.00"),
                new BigDecimal("3200.00"),
                TipoLancamento.DEBITO,
                Situacao.BAIXADO,
                terceiro03,
                centroCusto03,
                conta03
        );
        lancamentoRepo.save(lancamento03);

        // Conta 04 (Estudos)
        Lancamento lancamento04 = new Lancamento(
                null,
                "Matrícula curso de especialização",
                "1",
                LocalDate.of(2025, 9, 20),
                LocalDate.of(2025, 9, 20),
                LocalDate.of(2025, 9, 20),
                new BigDecimal("850.00"),
                new BigDecimal("850.00"),
                TipoLancamento.DEBITO,
                Situacao.BAIXADO,
                terceiro04,
                centroCusto04,
                conta04
        );
        lancamentoRepo.save(lancamento04);

        // Conta 05 (Alimentação Alelo)
        Lancamento lancamento05 = new Lancamento(
                null,
                "Compras no mercado",
                "1",
                LocalDate.of(2025, 11, 1),
                LocalDate.of(2025, 11, 1),
                LocalDate.of(2025, 11, 1),
                new BigDecimal("240.00"),
                new BigDecimal("240.00"),
                TipoLancamento.DEBITO,
                Situacao.BAIXADO,
                terceiro05,
                centroCusto05,
                conta05
        );
        lancamentoRepo.save(lancamento05);
    }
}
