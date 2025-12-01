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
      /* page background (kept from original, slightly tuned) */
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


    /* small helpers used by template (kept) */
    .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.6); border-top-color:transparent; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; margin-right:6px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* =========================
       KAVII UI - Cards & Forms (
       ========================= */

    /* Page container adjustmentsfor templates using .container) */
    .container { max-width: 1200px; margin: 0 auto; }

    /* Title */
    .kavii-title { color: #fff; font-weight:700; letter-spacing:0.2px; }

    /* Card base: modern glass/white cards */
    .kavii-card {
      border-radius:12px;
      overflow:hidden;
      box-shadow: 0 10px 30px rgba(8,10,30,0.35);
      border: none;
      background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95));
      color: #0f1724; /* inner text dark for readability */
    }

    /* Inputs / selects */
    .kavii-input, .kavii-input-sm, .kavii-select, .kavii-select-sm, .kavii-filter input {
      border-radius:8px;
      border:1px solid #e6e9ef;
      background: #ffffff;
      padding: .5rem .6rem;
      box-shadow: inset 0 1px 0 rgba(16,24,40,0.02);
      color: #0f1724;
    }
    .kavii-input:focus, .kavii-select:focus, .kavii-filter input:focus {
      outline: none;
      box-shadow: 0 6px 18px rgba(79,93,255,0.12);
      border-color: rgba(79,93,255,0.45);
    }

    /* smaller variants */
    .kavii-input-sm { padding: .25rem .4rem; border-radius:6px; }
    .kavii-select-sm { padding: .15rem .4rem; border-radius:6px; }

    /* labels */
    .kavii-label { color:#4b5563; font-size:0.85rem; margin-bottom: .25rem; display:block; }
    .kavii-label-sm { color:#6b7280; font-size:0.78rem; }

    /* buttons */
    .kavii-btn-primary {
      background: linear-gradient(90deg,#5566ff,#7b9bff);
      color: #fff;
      border: none;
      padding: .55rem .9rem;
      border-radius:10px;
      font-weight:600;
      box-shadow: 0 6px 18px rgba(86,99,255,0.18);
    }
    .kavii-btn-primary:disabled { opacity: .6; cursor: not-allowed; }

    /* filter input block */
    .kavii-filter {
      display:flex;
      align-items:center;
      gap:8px;
      border-radius:10px;
      overflow:hidden;
      border:1px solid #e6e9ef;
      padding: .35rem;
      background: #fff;
    }
    .kavii-filter-icon { font-size:1rem; padding: .25rem .5rem; color:#6b7280; background:transparent; border:0; }

    /* Grid & cards */
    .kavii-grid {
      display:grid;
      grid-template-columns: repeat(2, 1fr);
      gap:16px;
      margin-top: 12px;
    }

    .kavii-launch-card {
      background: #fff;
      border-radius:12px;
      overflow:hidden;
      box-shadow: 0 8px 28px rgba(6,8,25,0.06);
      transition: transform .18s ease, box-shadow .18s ease;
      border:1px solid rgba(14,20,30,0.03);
      color: #0f1724;
    }
    .kavii-launch-card:hover { transform: translateY(-6px); box-shadow: 0 18px 48px rgba(6,8,25,0.08); }

    /* card header */
    .card-header {
      background: linear-gradient(90deg, rgba(246,248,255,0.8), rgba(255,255,255,0.6));
      padding:14px;
      display:flex;
      align-items:flex-start;
      gap:12px;
      border-bottom:1px solid #f1f3f6;
    }
    .kavii-id { color:#6b7280; font-weight:700; min-width:48px; }
    .kavii-desc { margin:0; font-size:1rem; color:#111827; font-weight:700; }
    .kavii-sub { display:flex; align-items:center; gap:8px; margin-top:4px; }

    /* chips */
    .kavii-chip { background:#eef2ff; color:#2b4db0; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:600; border:1px solid rgba(43,77,176,0.08); }
    .kavii-chip.secondary { background:#f3f4f6; color:#374151; border:1px solid rgba(55,65,81,0.04); }

    .kavii-value { font-weight:700; color:#0f1724; font-size:1rem; }

    .card-body { padding:12px 14px; background: #fff; }

    .kavii-divider { border:0; height:1px; background:linear-gradient(90deg, rgba(14,20,30,0.02), rgba(14,20,30,0.03)); margin:12px 0; }

    /* responsive tweaks and bootstrap small-input harmony */
    @media (max-width: 1100px) {
      .kavii-grid { grid-template-columns: 1fr; }
      .kavii-card, .kavii-launch-card { margin-bottom: 10px; }
    }

    .form-control-sm { height: auto; padding-top: .35rem; padding-bottom: .35rem; }

    /* ensure table-responsive (if kept) and other elements don't clash */
    .table-editable .form-control { background: transparent; border: 1px solid #e9eef7; border-radius: 6px; }
    .alert-danger { margin-top: .5rem; }

    /* small utility */
    .text-muted { color: rgba(15, 23, 36, 0.6) !important; }
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
