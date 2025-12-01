import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { LancamentosService, Lancamento, IdNome } from '../lancamentos/lancamentos.service';

type Filtros = {
  descricao: string;
  centroCustoId: number | null;
  contaId: number | null;
  lancDe: string;  lancAte: string;
  vencDe: string;  vencAte: string;
  baixaDe: string; baixaAte: string;
};

@Component({
  selector: 'app-extrato-lancamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
<section class="extrato-page container py-4">
  <!-- Top header: título + actions -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <div>
      <h1 class="h3 mb-0 extrato-title">Extrato — Lançamentos</h1>
      <small class="text-muted">Visualize e filtre lançamentos baixados. Use os chips rápidos para aplicar filtros instantâneos.</small>
    </div>

    <div class="d-flex align-items-center gap-2">
      <button class="btn btn-outline-light btn-sm" (click)="carregar()" [disabled]="carregando()">
        <span *ngIf="carregando()" class="spinner-border spinner-border-sm me-2"></span>
        Recarregar
      </button>
      <button class="btn btn-light btn-sm" (click)="exportarCSV()">Exportar CSV</button>
    </div>
  </div>

  <!-- KPI cards -->
  <div class="kpi-row mb-3">
    <div class="kpi-card saldo">
      <div class="kpi-label">Saldo (Documento)</div>
      <div class="kpi-value">R$ {{ saldoDoc() | number:'1.2-2' }}</div>
      <div class="kpi-sub">Crédito {{ totCreditoDoc() | number:'1.2-2' }} • Débito {{ totDebitoDoc() | number:'1.2-2' }}</div>
    </div>

    <div class="kpi-card saldo-baix">
      <div class="kpi-label">Saldo (Baixado)</div>
      <div class="kpi-value">R$ {{ saldoBaix() | number:'1.2-2' }}</div>
      <div class="kpi-sub">Crédito {{ totCreditoBaix() | number:'1.2-2' }} • Débito {{ totDebitoBaix() | number:'1.2-2' }}</div>
    </div>

    <div class="kpi-card actions">
      <div class="kpi-label">Filtros rápidos</div>
      <div class="chips">
        <button class="chip" (click)="chipUltimos7()">Últimos 7 dias</button>
        <button class="chip" (click)="chipMesAtual()">Mês atual</button>
        <button class="chip" (click)="chipVencidos()">Vencidos</button>
        <button class="chip ghost" (click)="limpar()">Limpar</button>
      </div>
    </div>
  </div>

  <!-- filtro avançado (form) -->
  <div class="kavii-card mb-4">
    <form [formGroup]="form" class="row g-2 align-items-end">
      <div class="col-12 col-md-4">
        <label class="kavii-label">Descrição</label>
        <input class="kavii-input form-control" formControlName="descricao" placeholder="Descrição...">
      </div>

      <div class="col-6 col-md-2">
        <label class="kavii-label">Conta</label>
        <select class="kavii-select form-select" formControlName="contaId">
          <option [ngValue]="null">– Todas –</option>
          <option *ngFor="let c of contas()" [ngValue]="c.id">{{ c.descricao || ('#' + c.id) }}</option>
        </select>
      </div>

      <div class="col-6 col-md-2">
        <label class="kavii-label">Centro de Custo</label>
        <select class="kavii-select form-select" formControlName="centroCustoId">
          <option [ngValue]="null">– Todos –</option>
          <option *ngFor="let cc of centros()" [ngValue]="cc.id">{{ cc.descricao || ('#' + cc.id) }}</option>
        </select>
      </div>

      <div class="col-6 col-md-2">
        <label class="kavii-label">Venc. De</label>
        <input type="date" class="kavii-input form-control" formControlName="vencDe">
      </div>

      <div class="col-6 col-md-2">
        <label class="kavii-label">Venc. Até</label>
        <input type="date" class="kavii-input form-control" formControlName="vencAte">
      </div>
    </form>
  </div>

  <!-- Grid de cards do extrato -->
  <div class="extrato-grid">
    <div *ngIf="listaExtrato().length === 0" class="empty-state kavii-card text-center p-4">
      <strong>Nenhum lançamento encontrado</strong>
      <div class="text-muted">Ajuste os filtros ou limpe para ver mais resultados.</div>
    </div>

    <article *ngFor="let l of listaExtrato(); let i = index" class="extrato-card" [style.background]="corLancamento(l) ? corLancamento(l) : '#ffffff'">
      <div class="d-flex align-items-start gap-3">
        <div class="left-col">
          <div class="id">#{{ l.id }}</div>
          <div class="linha-title">{{ l.descricao || '—' }}</div>
          <div class="linha-sub">{{ l.conta?.descricao || getContaLabel(l) }} • {{ l.centroCusto?.descricao || '—' }}</div>
        </div>

        <div class="middle-col ms-3">
          <div class="small">Data Lanç.</div>
          <div>{{ l.dataLancamentoISO ? (l.dataLancamentoISO | date:'dd/MM/yyyy') : '—' }}</div>

          <div class="small mt-2">Vencimento</div>
          <div>{{ l.dataVencimentoISO ? (l.dataVencimentoISO | date:'dd/MM/yyyy') : '—' }}</div>

          <div class="small mt-2 text-muted">Baixa</div>
          <div>{{ l.dataBaixaISO ? (l.dataBaixaISO | date:'dd/MM/yyyy') : '—' }}</div>
        </div>

        <div class="ms-auto text-end">
          <div [ngClass]="{'badge-tipo credito': l.tipoLancamento === 'Credito', 'badge-tipo debito': l.tipoLancamento === 'Debito'}">
            {{ l.tipoLancamento || '-' }}
          </div>
          <div class="linha-valor mt-2">R$ {{ l.valorDocumento | number:'1.2-2' }}</div>
          <div class="text-muted small">Baixado: R$ {{ l.valorBaixado | number:'1.2-2' }}</div>

          <div class="mt-3 d-flex gap-2 justify-content-end">
            <button class="btn btn-sm btn-outline-success" (click)="detalhar(l)">Detalhes</button>
            <button class="btn btn-sm btn-outline-danger" (click)="remover(l.id)" [disabled]="carregando()">Excluir</button>
          </div>
        </div>
      </div>
    </article>
  </div>
</section>
  `,
  styles: [`
    :host {
      display:block;
      font-family: 'Inter', system-ui, sans-serif;
      color: #0f1724;
      background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
      padding: 2rem;
      box-sizing: border-box;
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; }

    .extrato-title { color: #fff; font-weight:700; }
    .text-muted { color: rgba(15,23,36,0.6); }

    /* KPI row */
    .kpi-row { display:flex; gap:16px; margin-bottom:12px; align-items:stretch; }
    .kpi-card {
      flex:1;
      border-radius:12px;
      padding:16px;
      background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92));
      box-shadow: 0 12px 30px rgba(6,8,25,0.08);
      color: #0f1724;
      border: 1px solid rgba(10,15,30,0.04);
    }
    .kpi-card.saldo { background: linear-gradient(90deg,#ffffff,#f7fbff); }
    .kpi-card.saldo-baix { background: linear-gradient(90deg,#ffffff,#f7fff6); }
    .kpi-card.actions { display:flex; flex-direction:column; gap:8px; align-items:flex-start; justify-content:center; }

    .kpi-label { font-size:0.85rem; color:#6b7280; font-weight:600; }
    .kpi-value { font-size:1.6rem; font-weight:800; margin-top:6px; color:#0f1724; }
    .kpi-sub { font-size:0.85rem; color:#6b7280; margin-top:6px; }

    .chips { display:flex; gap:8px; flex-wrap:wrap; }
    .chip {
      background: linear-gradient(90deg,#5566ff,#7b9bff);
      color: #fff;
      padding:6px 10px;
      border-radius:999px;
      border:0;
      font-weight:600;
      cursor:pointer;
      box-shadow: 0 8px 24px rgba(86,99,255,0.18);
    }
    .chip.ghost {
      background:transparent; color:#374151; border:1px solid rgba(55,65,81,0.08); box-shadow:none;
    }

    /* filtro card */
    .kavii-card {
      border-radius:12px;
      padding:12px;
      background: linear-gradient(180deg,#ffffffee,#ffffffdd);
      box-shadow: 0 10px 28px rgba(6,8,25,0.06);
      border:1px solid rgba(10,15,30,0.04);
      color: #0f1724;
    }
    .kavii-input, .kavii-select, .form-control {
      border-radius:8px;
      border:1px solid #e6e9ef;
      padding:.5rem .6rem;
      box-shadow: inset 0 1px 0 rgba(16,24,40,0.03);
      color: #0f1724;
    }

    /* grid */
    .extrato-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:14px; margin-top:12px; }
    .extrato-card {
      border-radius:12px;
      padding:14px;
      background:#fff;
      box-shadow: 0 8px 28px rgba(6,8,25,0.06);
      border:1px solid rgba(10,15,30,0.03);
      transition: transform .14s ease, box-shadow .14s ease;
    }
    .extrato-card:hover { transform: translateY(-6px); box-shadow: 0 18px 48px rgba(6,8,25,0.10); }

    .left-col .id { font-weight:700; color:#6b7280; }
    .linha-title { font-size:1rem; font-weight:700; color:#0f1724; margin-top:6px; }
    .linha-sub { font-size:.85rem; color:#6b7280; margin-top:6px; }

    .middle-col .small { font-size:.78rem; color:#6b7280; }
    .linha-valor { font-weight:800; font-size:1.1rem; color:#0f1724; }

    .badge-tipo { display:inline-block; padding:6px 10px; border-radius:999px; font-weight:700; margin-bottom:6px; }
    .badge-tipo.credito { background: #e6fff0; color:#027a3a; border:1px solid rgba(2,122,58,0.08); }
    .badge-tipo.debito { background: #fff5f5; color:#b3261e; border:1px solid rgba(179,38,30,0.06); }

    /* small screens */
    @media (max-width: 980px) {
      .extrato-grid { grid-template-columns: 1fr; }
      .kpi-row { flex-direction: column; gap:12px; }
    }

    /* utilities */
    .me-2 { margin-right:.5rem; }
    .mt-2 { margin-top:.5rem; }
    .mt-3 { margin-top:.75rem; }
    .ms-auto { margin-left:auto; }
    .d-flex { display:flex; }
    .gap-2 { gap:.5rem; }
    .gap-3 { gap:1rem; }
  `]
})
export class ExtratoLancamentosComponent {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(LancamentosService);

  carregando = signal(false);
  erro = signal<string | null>(null);

  centros = signal<IdNome[]>([]);
  todos = signal<Lancamento[]>([]);
  contas = signal<IdNome[]>([]);

  form = this.fb.group({
    descricao: [''],
    centroCustoId: [null as number | null],
    contaId: [null as number | null],
    lancDe: [''], lancAte: [''],
    vencDe: [''], vencAte: [''],
    baixaDe: [''], baixaAte: [''],
  });

  // signal que guarda filtros lidos do form
  private filtrosSignal = signal<Filtros>({
    descricao: '', centroCustoId: null, contaId: null,
    lancDe: '', lancAte: '', vencDe: '', vencAte: '', baixaDe: '', baixaAte: ''
  });
  // getter para usar this.filtros() no computed (retorna signal)
  get filtros() { return this.filtrosSignal; }

  private parseDate(str?: string | null): Date | null {
    if (!str) return null;
    const s = String(str).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      const d = new Date(s);
      if (!isNaN(d.getTime())) { d.setHours(0,0,0,0); return d; }
    }
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
      const d = new Date(+m[3], +m[2]-1, +m[1]);
      if (!isNaN(d.getTime())) { d.setHours(0,0,0,0); return d; }
    }
    return null;
  }

  private today0(): Date { const d = new Date(); d.setHours(0,0,0,0); return d; }

  corLancamento(l: Lancamento): string | null {
    const sit = String(l.situacao ?? '').trim().toUpperCase();
    if (sit !== 'ABERTO' && sit !== 'EM_ABERTO' && sit !== 'ABERTA') return null;
    const venc = this.parseDate(l.dataVencimentoISO ?? null);
    if (!venc) return null;
    const hoje = this.today0();
    if (venc < hoje) return '#fff3f3'; // leve vermelho para vencidos
    const diff = Math.round((venc.getTime() - hoje.getTime()) / 86400000);
    if (diff <= 5) return '#fffbe6'; // amarelo claro
    return null;
  }

  ngOnInit() {
    this.carregar();
    this.api.listarCentrosCusto().subscribe({ next: v => this.centros.set(v ?? []) });
    this.api.listarContas().subscribe({ next: v => this.contas.set(v ?? []) });

    this.form.valueChanges.subscribe(v => {
      this.filtrosSignal.set({
        descricao: (v.descricao ?? '').trim(),
        centroCustoId: (v.centroCustoId as any) ?? null,
        contaId: (v.contaId as any) ?? null,
        lancDe: v.lancDe ?? '', lancAte: v.lancAte ?? '',
        vencDe: v.vencDe ?? '', vencAte: v.vencAte ?? '',
        baixaDe: v.baixaDe ?? '', baixaAte: v.baixaAte ?? '',
      });
    });
  }

  carregar() {
    this.carregando.set(true); this.erro.set(null);
    this.api.listar().subscribe({
      next: (ls) => { this.todos.set(ls ?? []); this.carregando.set(false); },
      error: () => { this.erro.set('Falha ao carregar lançamentos'); this.carregando.set(false); }
    });
  }

  // chips rápidos:
  private isoDateDaysAgo(days: number) {
    const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - days);
    const mm = String(d.getMonth() + 1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
  private isoStartOfMonth() {
    const d = new Date(); d.setHours(0,0,0,0); d.setDate(1);
    const mm = String(d.getMonth() + 1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
  private isoEndOfMonth() {
    const d = new Date(); d.setHours(0,0,0,0);
    const last = new Date(d.getFullYear(), d.getMonth()+1, 0);
    const mm = String(last.getMonth() + 1).padStart(2,'0');
    const dd = String(last.getDate()).padStart(2,'0');
    return `${last.getFullYear()}-${mm}-${dd}`;
  }

  chipUltimos7() {
    const de = this.isoDateDaysAgo(7);
    const ate = this.isoDateDaysAgo(0);
    this.form.patchValue({ lancDe: de, lancAte: ate });
  }

  chipMesAtual() {
    this.form.patchValue({ lancDe: this.isoStartOfMonth(), lancAte: this.isoEndOfMonth() });
  }

  chipVencidos() {
    const hoje = this.isoDateDaysAgo(0);
    this.form.patchValue({ vencDe: '', vencAte: hoje });
  }

  limpar() {
    this.form.reset({
      descricao: '', centroCustoId: null, contaId: null,
      lancDe: '', lancAte: '', vencDe: '', vencAte: '', baixaDe: '', baixaAte: ''
    });
  }

  // export simples CSV (client-side)
  exportarCSV() {
    try {
      const rows = this.listaExtrato().map(l => ({
        id: l.id,
        descricao: l.descricao,
        tipo: l.tipoLancamento,
        situacao: l.situacao,
        valorDocumento: l.valorDocumento,
        valorBaixado: l.valorBaixado,
        dataLancamentoISO: l.dataLancamentoISO,
        dataVencimentoISO: l.dataVencimentoISO,
        dataBaixaISO: l.dataBaixaISO,
        conta: l.conta?.descricao ?? '',
        centroCusto: l.centroCusto?.descricao ?? '',
      }));
      if (rows.length === 0) { alert('Nenhum registro para exportar'); return; }
      const header = Object.keys(rows[0] ?? {}).join(',');
      const csv = [header, ...rows.map(r => Object.values(r).map(v => `"${String(v ?? '')?.replace(/"/g,'""')}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extrato_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Falha ao exportar CSV');
    }
  }

  // helpers existentes
  private excluirSituacoes = new Set(['ABERTA','ABERTO','EM_ABERTO']);
  private isAberta = (l: Lancamento) =>
    this.excluirSituacoes.has(String(l.situacao ?? '').trim().toUpperCase());

  private inRange(dateISO?: string | null, de?: string, ate?: string) {
    if (!de && !ate) return true;
    const x = dateISO?.slice(0,10) ?? '';
    if (!x) return false;
    return (!de || x >= de) && (!ate || x <= ate);
  }

  lista = computed(() => {
    const fs = this.filtros();
    const desc = fs.descricao.toLowerCase();
    const ccId = fs.centroCustoId;
    const contaId = fs.contaId;

    return this.todos().filter(l => {
      if (desc && !(l.descricao ?? '').toLowerCase().includes(desc)) return false;
      if (ccId && (l.centroCusto?.id ?? null) !== ccId) return false;
      if (contaId && (l.conta?.id ?? null) !== contaId) return false;

      if (!this.inRange(l.dataLancamentoISO, fs.lancDe, fs.lancAte)) return false;
      if (!this.inRange(l.dataVencimentoISO, fs.vencDe, fs.vencAte)) return false;
      if (!this.inRange(l.dataBaixaISO, fs.baixaDe, fs.baixaAte)) return false;

      return true;
    });
  });

  listaExtrato = computed(() => this.lista().filter(l => !this.isAberta(l)));

  totCreditoDoc = computed(() =>
    this.listaExtrato().reduce((s,l)=> s + (l.tipoLancamento==='Credito' ? (l.valorDocumento||0) : 0), 0)
  );
  totDebitoDoc = computed(() =>
    this.listaExtrato().reduce((s,l)=> s + (l.tipoLancamento==='Debito' ? (l.valorDocumento||0) : 0), 0)
  );
  saldoDoc = computed(() => this.totCreditoDoc() - this.totDebitoDoc());

  totCreditoBaix = computed(() =>
    this.listaExtrato().reduce((s,l)=> s + (l.tipoLancamento==='Credito' ? (l.valorBaixado||0) : 0), 0)
  );
  totDebitoBaix = computed(() =>
    this.listaExtrato().reduce((s,l)=> s + (l.tipoLancamento==='Debito' ? (l.valorBaixado||0) : 0), 0)
  );
  saldoBaix = computed(() => this.totCreditoBaix() - this.totDebitoBaix());

  // ações mínimas auxiliares (preservando sua API)
  remover(id: number) {
    if (!confirm('Confirma exclusão deste lançamento?')) return;
    this.carregando.set(true);
    this.api.remover(id).subscribe({
      next: () => { this.carregar(); },
      error: () => { this.carregando.set(false); alert('Falha ao excluir'); }
    });
  }

  detalhar(l: Lancamento) {
    alert(`Lançamento #${l.id} — ${l.descricao}`);
  }

  // getters para template
  getContaLabel(l: Lancamento): string {
    const contaFull = this.contas().find(c => c.id === (l.conta?.id ?? null));
    return contaFull?.descricao ?? `Conta #${l.conta?.id ?? '—'}`;
  }

  // util
  toNumber(n: any): number {
    const v = Number(n);
    return Number.isNaN(v) ? 0 : v;
  }
}
