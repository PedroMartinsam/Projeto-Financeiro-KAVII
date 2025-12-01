import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { LancamentosService, Lancamento, LancamentoPayload, IdNome } from './lancamentos.service';

@Component({
  selector: 'app-lancamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lancamentos.component.html',
 
 styles: [`
:host {
  display: block;
  background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  font-family: 'Inter', system-ui, sans-serif;
  color: #f8f9fa;
}

/* =========================
   BOTÃO RECARREGAR BRANCO
========================= */
.k-btn-reload {
  background: #ffffff !important;
  color: #000000 !important;
  border: 1px solid #d1d5db !important;
  font-weight: 700;
  transition: background .15s ease, transform .1s ease;
}
.k-btn-reload:hover {
  background: #f3f4f6 !important;
  transform: translateY(-1px);
}
.k-btn-reload:disabled {
  background: #ffffff !important;
  color: #999999 !important;
  opacity: 0.6;
  transform: none;
}

/* =========================
   HELPERS
========================= */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.6);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
  margin-right: 6px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.container { max-width: 1200px; margin: 0 auto; }

/* =========================
   TÍTULOS
========================= */
.kavii-title {
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.2px;
}

/* =========================
   INPUTS ESCUROS UNIFICADOS
========================= */
.kavii-input,
.kavii-input-sm,
.kavii-select,
.kavii-select-sm,
.kavii-filter input {
  background: linear-gradient(145deg, #2b0066, #140033);
  color: #f1ecff;
  border: 1px solid #7f42ff55;
  border-radius: 10px;
  padding: .5rem .75rem;
  box-shadow: none !important;
}

.kavii-input:focus,
.kavii-select:focus,
.kavii-filter input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(127,66,255,0.25);
  border-color: #b17fff;
  background: rgba(255,255,255,0.08);
}

.kavii-input-sm { padding: .25rem .4rem; border-radius: 6px; }
.kavii-select-sm { padding: .15rem .4rem; border-radius: 6px; }

.kavii-input::placeholder,
.kavii-filter input::placeholder {
  color: #cbbcff;
  opacity: 0.85;
}

/* =========================
   FILTRO
========================= */
.kavii-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #7f42ff55;
  padding: .35rem;
  background: linear-gradient(145deg, #2b0066, #140033);
}

.kavii-filter-icon {
  font-size: 1rem;
  padding: .25rem .5rem;
  color: #f1ecff;
  background: transparent;
  border: 0;
}

/* =========================
   BOTÃO PRINCIPAL
========================= */
.kavii-btn-primary {
  background: linear-gradient(90deg,#7f42ff,#9b7bff);
  color: #fff;
  border: none;
  padding: .55rem .9rem;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(127,66,255,0.35);
}

/* =========================
   ÁREA DE CRIAÇÃO
========================= */
.kavii-form,
.kavii-create,
.kavii-section-create,
.kavii-launch-create {
  background: linear-gradient(145deg, #2b0066, #140033);
  border-radius: 14px;
  padding: 1rem;
  border: 1px solid #7f42ff55;
  color: #f1ecff;
}

.kavii-form .kavii-label,
.kavii-create .kavii-label,
.kavii-section-create .kavii-label,
.kavii-launch-create .kavii-label {
  color: #fff;
}

/* =========================
   GRID
========================= */
.kavii-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 12px;
}

/* =========================
   CARD PADRÃO ROXO
========================= */
.kavii-launch-card {
  display: flex;
  flex-direction: column;
  min-height: 360px;
  max-height: 420px;
  height: 100%;
  background: linear-gradient(145deg, #2b0066, #140033);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 20px #25201722, inset 0 0 0 1px #fffc6322;
  border: 1px solid #7f42ff55;
  color: #f1ecff;
  transition: transform .25s ease, box-shadow .25s ease;
}
.kavii-launch-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px #7f42ff88;
}

/* =========================
   HEADER DO CARD
========================= */
.card-header {
  background: linear-gradient(90deg, #3a0c7a, #1a043f);
  padding: 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #7f42ff44;
}
.kavii-id { color: #d1b7ff; font-weight: 700; min-width: 48px; }
.kavii-desc { margin: 0; font-size: 1rem; color: #ffffff; font-weight: 700; }
.kavii-sub { display: flex; align-items: center; gap: 8px; margin-top: 4px; }

/* =========================
   CHIPS
========================= */
.kavii-chip {
  background: #7f42ff33;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #7f42ff66;
}
.kavii-chip.secondary {
  background: #2b0066;
  color: #cbbcff;
  border: 1px solid #7f42ff33;
}
.kavii-value {
  font-weight: 700;
  color: #ffffff;
  font-size: 1rem;
}

/* =========================
   BODY DO CARD
========================= */
.card-body {
  padding: 12px 14px;
  background: transparent;
}
.kavii-divider {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, #7f42ff22, #ffffff22);
  margin: 12px 0;
}

/* =========================
   RESPONSIVO
========================= */
@media (max-width: 1100px) {
  .kavii-grid { grid-template-columns: 1fr; }
  .kavii-launch-card { margin-bottom: 10px; }
}

/* =========================
   UTILIDADES
========================= */
.text-muted { color: #cbbcff !important; }
.me-2 { margin-right: .5rem !important; }
.mb-0 { margin-bottom: 0 !important; }
.mb-3 { margin-bottom: 1rem !important; }
`]


})
export class LancamentosComponent {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(LancamentosService);

  // state signals
  lancamentos = signal<Lancamento[]>([]);
  filtro = signal('');
  carregando = signal(false);
  erro = signal<string | null>(null);

  contas = signal<IdNome[]>([]);
  terceiros = signal<IdNome[]>([]);
  centros = signal<IdNome[]>([]);

  tipos = ['Debito', 'Credito'] as const;
  situacoes = ['Aberto', 'Baixado'] as const;

  // reactive form
  form = this.fb.group({
    descricao: ['', Validators.required],
    parcela: ['1/1', Validators.required],
    dataLancamentoISO: [this.hojeISO(), Validators.required],
    dataVencimentoISO: [this.hojeISO()],
    dataBaixaISO: [null as string | null],
    valorDocumento: [0 as number, [Validators.required]],
    valorBaixado: [0 as number, [Validators.required]],
    tipoLancamento: [this.tipos[0], Validators.required],
    situacao: [this.situacoes[0], Validators.required],
    contaId: [null as number | null],
    terceiroId: [null as number | null],
    centroCustoId: [null as number | null],
  });

  // computed filtered list
  listaFiltrada = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    const arr = this.lancamentos();
    if (!f) return arr;
    return arr.filter(l =>
      (l.descricao ?? '').toLowerCase().includes(f) ||
      (l.tipoLancamento ?? '').toLowerCase().includes(f) ||
      (l.situacao ?? '').toLowerCase().includes(f) ||
      String(l.valorDocumento ?? '').toLowerCase().includes(f) ||
      (l.conta?.descricao ?? '').toLowerCase().includes(f) ||
      (l.centroCusto?.descricao ?? '').toLowerCase().includes(f) ||
      (l.terceiro?.nome ?? l.terceiro?.razaoSocial ?? '').toLowerCase().includes(f)
    );
  });

  // KPIs (optional for header)
  totalPeriodo = computed(() => this.lancamentos().reduce((s, l) => s + (Number(l.valorDocumento) || 0), 0));
  totalBaixado = computed(() => this.lancamentos().reduce((s, l) => s + (Number(l.valorBaixado) || 0), 0));

  ngOnInit() { this.carregarTudo(); }

  carregarTudo() {
    this.carregando.set(true);
    this.erro.set(null);

    this.api.listar().subscribe({
      next: (ls) => { this.lancamentos.set(ls ?? []); this.carregando.set(false); },
      error: () => { this.erro.set('Falha ao carregar lançamentos'); this.carregando.set(false); }
    });

    this.api.listarContas().subscribe({ next: (v) => this.contas.set(v ?? []) });
    this.api.listarTerceiros().subscribe({ next: (v) => this.terceiros.set(v ?? []) });
    this.api.listarCentrosCusto().subscribe({ next: (v) => this.centros.set(v ?? []) });
  }

  criar() {
    if (this.form.invalid) return;
    const payload: LancamentoPayload = this.form.getRawValue();
    this.carregando.set(true);
    this.erro.set(null);

    this.api.criar(payload).subscribe({
      next: () => {
        this.form.reset({
          descricao: '',
          parcela: '1/1',
          dataLancamentoISO: this.hojeISO(),
          dataVencimentoISO: this.hojeISO(),
          dataBaixaISO: null,
          valorDocumento: 0,
          valorBaixado: 0,
          tipoLancamento: this.tipos[0],
          situacao: this.situacoes[0],
          contaId: null,
          terceiroId: null,
          centroCustoId: null
        });
        this.carregarTudo();
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || err?.message || 'Falha ao criar lançamento';
        this.erro.set(msg);
        this.carregando.set(false);
      }
    });
  }

  atualizar(id: number, dto: Partial<LancamentoPayload>) {
    this.carregando.set(true);
    this.erro.set(null);
    this.api.atualizar(id, dto).subscribe({
      next: () => { this.carregarTudo(); },
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || err?.message || 'Falha ao atualizar';
        this.erro.set(msg);
        this.carregando.set(false);
      }
    });
  }

  remover(id: number) {
    this.carregando.set(true);
    this.erro.set(null);

    this.api.remover(id).subscribe({
      next: () => this.carregarTudo(),
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || err?.message || 'Falha ao excluir';
        this.erro.set(msg);
        this.carregando.set(false);
      },
    });
  }

  // -----------------------
  // Helpers to safely read account data (use this.contas() which contains full account objects)
  // -----------------------

  // retorna a conta completa a partir do id referenciado no lançamento
  getContaFullFromLancamento(l: Lancamento): any | undefined {
    const contaId = l.conta?.id ?? null;
    if (!contaId) return undefined;
    return this.contas().find(c => c.id === contaId) as any | undefined;
  }

  // retorna saldo (fallbacks: saldo, balance, 0)
  getContaSaldoFromLancamento(l: Lancamento): number {
    const contaFull = this.getContaFullFromLancamento(l);
    return Number(contaFull?.saldo ?? contaFull?.balance ?? 0);
  }

  // retorna limite (fallbacks: limite, limit, 0)
  getContaLimiteFromLancamento(l: Lancamento): number {
    const contaFull = this.getContaFullFromLancamento(l);
    return Number(contaFull?.limite ?? contaFull?.limit ?? 0);
  }

  // calculo percentual seguro (0..100)
  getContaUsoPercent(l: Lancamento): number {
    const lim = this.getContaLimiteFromLancamento(l);
    const sal = this.getContaSaldoFromLancamento(l);
    if (!lim || lim <= 0) return 0;
    const percent = Math.round((sal / lim) * 100);
    return Math.max(0, Math.min(100, percent));
  }

  // label amigável da conta (descrição ou fallback)
  getContaLabel(l: Lancamento): string {
    const contaFull = this.getContaFullFromLancamento(l);
    return contaFull?.descricao ?? `Conta #${l.conta?.id ?? '—'}`;
  }

  // salvar lançamento: cria dto parcial e chama atualizar
  onSalvarLancamento(l: Lancamento) {
    const dto: Partial<LancamentoPayload> = {
      descricao: l.descricao,
      parcela: l.parcela,
      dataLancamentoISO: l.dataLancamentoISO,
      dataVencimentoISO: l.dataVencimentoISO,
      dataBaixaISO: l.dataBaixaISO,
      valorDocumento: l.valorDocumento,
      valorBaixado: l.valorBaixado,
      tipoLancamento: l.tipoLancamento,
      situacao: l.situacao,
      contaId: l.conta?.id ?? null,
      terceiroId: l.terceiro?.id ?? null,
      centroCustoId: l.centroCusto?.id ?? null
    };
    this.atualizar(l.id, dto);
  }

  // util
  toNumber(n: any): number {
    const v = Number(n);
    return Number.isNaN(v) ? 0 : v;
  }

  getTipoColors(tipo?: string) {
    const t = (tipo ?? '').toString().toUpperCase();
    switch (t) {
      case 'CARTAO_CREDITO':
        return { saldoColor: '#ffb500', limiteColor: '#7bd0ff', saldoGradient: 'linear-gradient(90deg,#ffd76b,#ff9f1a)' };
      case 'CONTA_CORRENTE':
        return { saldoColor: '#7affb2', limiteColor: '#7bd0ff', saldoGradient: 'linear-gradient(90deg,#7affb2,#37e08a)' };
      case 'CONTA_INVESTIMENTO':
        return { saldoColor: '#b8ff7a', limiteColor: '#c0a6ff', saldoGradient: 'linear-gradient(90deg,#c8ff9e,#9be46b)' };
      case 'CARTAO_ALIMENTACAO':
        return { saldoColor: '#ff9ecd', limiteColor: '#7bd0ff', saldoGradient: 'linear-gradient(90deg,#ffc0df,#ff82bc)' };
      case 'POUPANCA':
        return { saldoColor: '#ffe27a', limiteColor: '#a7e0ff', saldoGradient: 'linear-gradient(90deg,#ffe27a,#ffc44d)' };
      default:
        return { saldoColor: '#ffd76b', limiteColor: '#7bd0ff', saldoGradient: 'linear-gradient(90deg,#ffd76b,#ff9f1a)' };
    }
  }

  hojeISO(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
}
