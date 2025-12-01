import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaFinanceirasService, MetaFinanceira } from './metaFinanceiras.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-metaFinanceiras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="k-wrap">
    <div class="k-head">
      <div>
        <h1 class="k-title">Metas Financeiras</h1>
        <p class="k-sub">Defina seus objetivos, prazos e acompanhe o progresso em tempo real.</p>
      </div>
      <button class="k-btn k-btn-reload" (click)="carregar()" [disabled]="carregando()">
        <span *ngIf="carregando()" class="spinner-border spinner-border-sm me-2"></span>
        Recarregar
      </button>
    </div>

    <!-- Criar nova meta -->
    <div class="k-card">
      <form (ngSubmit)="criar(desc.value, val.value, dt.value)" class="row g-2 align-items-end">
        <div class="col-12 col-md-5">
          <label class="k-label">Descrição da meta
            <input #desc class="k-input" placeholder="Ex.: Reserva de emergência">
          </label>
        </div>

        <div class="col-6 col-md-3">
          <label class="k-label">Valor (R$)
            <input #val type="number" step="0.01" class="k-input" placeholder="0,00">
          </label>
        </div>

        <div class="col-6 col-md-3">
          <label class="k-label">Data alvo
            <input #dt type="date" class="k-input">
          </label>
        </div>

        <div class="col-12 col-md-1">
          <button type="submit" class="k-btn k-btn-primary w-100" [disabled]="carregando()">Criar</button>
        </div>
      </form>

      <!-- Quick stats -->
      <div class="k-stats mt-3">
        <div class="k-stat">
          <span>Total de metas</span>
          <span class="k-badge k-badge-dark">{{ metas().length }}</span>
        </div>
        <div class="k-stat">
          <span>Atingidas</span>
          <span class="k-badge k-badge-dark">{{ atingidas() }}</span>
        </div>
        <div class="k-stat">
          <span>Valor total</span>
          <span class="k-badge k-badge-dark">{{ totalGeral() | currency:'BRL':'symbol':'1.2-2' }}</span>
        </div>
      </div>

      <!-- Progresso -->
      <div class="progress-wrap mt-3">
        <div class="progress-label">
          <strong>Progresso</strong>
          <span class="k-purple-ink">{{ progresso() }}%</span>
        </div>
        <div class="progress" aria-label="Progresso geral" role="progressbar"
             [attr.aria-valuenow]="progresso()" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" [style.width.%]="progresso()"
               [style.background]="barraGradiente()"></div>
        </div>
      </div>

      <div *ngIf="erro()" class="alert alert-danger mt-3 mb-0">{{ erro() }}</div>
    </div>

    <!-- Filtro -->
    <div class="k-card mt-4">
      <div class="row g-2">
        <div class="col-md-6">
          <label class="k-label">Filtrar
            <input class="k-input"
                   placeholder="Digite descrição, valor ou data..."
                   (input)="filtro.set(($any($event.target).value ?? '').toString())">
          </label>
        </div>
      </div>
    </div>

    <!-- METAS A CONQUISTAR -->
    <div class="k-card mt-3">
      <div class="section-head">
        <h2 class="section-title">Metas a conquistar</h2>
        <span class="count-chip">{{ metasAConquistar().length }}</span>
      </div>

      <div class="table-responsive">
        <table class="k-table">
          <thead>
            <tr>
              <th style="width:80px;">ID</th>
              <th>Descrição</th>
              <th style="width:180px;">Valor (R$)</th>
              <th style="width:200px;">Data alvo</th>
              <th class="text-end" style="width:220px;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of metasAConquistar()">
              <td class="muted">#{{ m.id }}</td>
              <td><input class="k-input" #d [value]="m.descricaoMeta"></td>
              <td><input class="k-input" #v type="number" step="0.01" [value]="m.valorMeta"></td>
              <td><input class="k-input" #da type="date" [value]="toInputDate(m.dataAlvo)"></td>
              <td class="text-end">
                <button class="k-btn k-btn-green me-2"
                        (click)="atualizar(m.id, d.value, v.value, da.value)"
                        [disabled]="carregando()">Salvar</button>
                <button class="k-btn k-btn-red"
                        (click)="remover(m.id)"
                        [disabled]="carregando()">Excluir</button>
              </td>
            </tr>
            <tr *ngIf="!metasAConquistar().length">
              <td colspan="5" class="text-center muted py-3">Nenhuma meta pendente.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- METAS ATINGIDAS -->
    <div class="k-card mt-3">
      <div class="section-head">
        <h2 class="section-title">Metas atingidas</h2>
        <span class="count-chip success">{{ metasAtingidas().length }}</span>
      </div>

      <div class="table-responsive">
        <table class="k-table">
          <thead>
            <tr>
              <th style="width:80px;">ID</th>
              <th>Descrição</th>
              <th style="width:180px;">Valor (R$)</th>
              <th style="width:200px;">Data alvo</th>
              <th style="width:160px;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of metasAtingidas()" class="row-done">
              <td class="muted">#{{ m.id }}</td>
              <td class="k-purple-ink">{{ m.descricaoMeta }}</td>
              <td class="k-purple-ink">{{ m.valorMeta | number:'1.2-2' }}</td>
              <td class="k-purple-ink">{{ toInputDate(m.dataAlvo) | date:'dd/MM/yyyy' }}</td>
              <td>
                <span class="pill-done">Concluída</span>
              </td>
            </tr>
            <tr *ngIf="!metasAtingidas().length">
              <td colspan="5" class="text-center muted py-3">Nenhuma meta concluída ainda.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
  `,
  styles: [`

     :host{
  display:block;
  /* Fundo Azul noturno elegante */
  background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
  min-height:100%;
}
    :root{
      --k-purple:#8A05BE;
      --k-purple-2:#B517FF;
      --k-purple-3:#E6D5FF;
      --k-ink:#2a0d45;        /* roxo escuro para textos */
      --k-danger:#e11d48;
    }

    .k-wrap{ padding:24px; }
    .k-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
    .k-title{ font-weight:900; color:var(--k-ink); margin:0; font-size:clamp(20px,2vw,24px); }
    .k-sub{ color:#6f5f8c; font-weight:700; font-size:.95rem; margin:2px 0 0; }

    .k-btn{ border-radius:12px; padding:10px 14px; font-weight:800; cursor:pointer; border:1px solid rgba(0,0,0,.08); transition:.15s; color:var(--k-ink); }
    .k-btn-primary{ background:linear-gradient(180deg,var(--k-purple-2),var(--k-purple)); color:#fff; }
    .k-btn-green{ background:#16a34a; color:#fff; }
    .k-btn-red{ background:#dc2626; color:#fff; }

    .k-card{ background:#548; border:1px solid var(--k-purple-3); border-radius:18px; padding:18px; box-shadow:0 16px 40px rgba(181,23,255,.12), 0 8px 18px rgba(0,0,0,.06); color:var(--k-ink); }

    .k-input{ width:100%; border:1px solid var(--k-purple-3); border-radius:12px; padding:10px; background:#FBF8FF; color:var(--k-ink); }
    .k-input:focus{ border-color:var(--k-purple); box-shadow:0 0 0 3px rgba(181,23,255,.2); }
    .k-label{ font-weight:800; color:var(--k-ink); display:grid; gap:4px; }

    .k-stats{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:12px; }
    .k-stat{ display:flex; justify-content:space-between; align-items:center; border:1px dashed var(--k-purple-3); border-radius:14px; padding:10px 12px; background:linear-gradient(180deg,#ffffff 0%, #faf4ff 100%); color:var(--k-ink); }
    .k-badge{ padding:6px 10px; border-radius:999px; background:linear-gradient(180deg,var(--k-purple-2),var(--k-purple)); color:#fff; font-weight:800; }
    .k-badge-dark{ filter:contrast(1.1) saturate(1.1); }

    .progress-label{ display:flex; justify-content:space-between; align-items:center; font-weight:800; color:var(--k-ink); margin-bottom:6px; }
    .progress{ height:18px; border-radius:12px; overflow:hidden; background:#f3eaff; border:1px solid var(--k-purple-3); }
    .progress-bar{ height:100%; transition: width .6s ease-out, filter .2s ease; filter:saturate(110%); }

    .k-table{ width:100%; border-collapse:separate; border-spacing:0 10px; }
    .k-table thead th{ text-align:left; font-weight:900; color:var(--k-ink); padding:10px; }
    .k-table tbody td{ background:#fff; border:1px solid var(--k-purple-3); padding:10px; vertical-align:middle; color:var(--k-ink); }
    .k-table tbody tr{ box-shadow:0 8px 20px rgba(181,23,255,.08), 0 4px 10px rgba(0,0,0,.04); }
    .k-table tbody tr td:first-child{ border-top-left-radius:12px; border-bottom-left-radius:12px; }
    .k-table tbody tr td:last-child{ border-top-right-radius:12px; border-bottom-right-radius:12px; }
    .row-done{ opacity:.9; }
    .k-purple-ink{ color:var(--k-ink); }
    .muted{ color:#7b6a99; }

    .section-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
    .section-title{ margin:0; font-size:18px; font-weight:900; color:var(--k-ink); }
    .count-chip{ background:#efe7ff; color:var(--k-ink); font-weight:900; padding:6px 10px; border-radius:999px; border:1px solid var(--k-purple-3); }
    .count-chip.success{ background:#e8fff1; border-color:#b7f3cf; color:#065f46; }

    .pill-done{ display:inline-block; padding:6px 10px; border-radius:999px; background:linear-gradient(180deg,#22c55e,#16a34a); color:#fff; font-weight:900; border:1px solid rgba(0,0,0,.06); }
  `]
})
export class MetaFinanceirasComponent {
  private api = inject(MetaFinanceirasService);

  filtro = signal('');
  carregando = signal(false);
  erro = signal<string | null>(null);
  metas = signal<MetaFinanceira[]>([]);

  /** Filtro geral */
  metasFiltradas = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    const arr = this.metas();
    if (!f) return arr;
    return arr.filter(m =>
      (m.descricaoMeta ?? '').toLowerCase().includes(f) ||
      String(m.valorMeta ?? '').toLowerCase().includes(f) ||
      (m.dataAlvo ?? '').toLowerCase().includes(f)
    );
  });

  /** Separações */
  metasAtingidas = computed(() => this.metasFiltradas().filter(m => this.isAtingida(m)));
  metasAConquistar = computed(() => this.metasFiltradas().filter(m => !this.isAtingida(m)));

  /** Totais / progresso */
  totalGeral = computed(() => this.metas().reduce((acc, m) => acc + (m.valorMeta || 0), 0));
  atingidas = computed(() => this.metas().filter(m => this.isAtingida(m)).length);
  progresso = computed(() => {
    const total = this.metas().length;
    if (!total) return 0;
    return Math.min(100, Math.round((this.atingidas() / total) * 100));
  });
  barraGradiente = computed(() => {
    const p = this.progresso();
    if (p < 40) return 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)';
    if (p < 80) return 'linear-gradient(90deg, #f59e0b 0%, #84cc16 100%)';
    return 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)';
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.erro.set(null);
    this.api.listar().subscribe({
      next: (data) => { this.metas.set(data ?? []); this.carregando.set(false); },
      error: () => { this.erro.set('Falha ao carregar'); this.carregando.set(false); },
    });
  }

  criar(descricaoMeta: string, valorMeta: string | number, dataAlvoInput: string) {
    if (!descricaoMeta?.trim()) return;
    const body = {
      descricaoMeta: descricaoMeta.trim(),
      valorMeta: Number(valorMeta ?? 0),
      dataAlvo: this.fromInputDate(dataAlvoInput),
    };
    this.carregando.set(true);
    this.erro.set(null);
    this.api.criar(body).subscribe({
      next: () => this.carregar(),
      error: () => { this.erro.set('Falha ao criar'); this.carregando.set(false); },
    });
  }

  atualizar(id: number, descricaoMeta: string, valorMeta: string | number, dataAlvoInput: string) {
    const body: Partial<MetaFinanceira> = {
      descricaoMeta: (descricaoMeta ?? '').trim(),
      valorMeta: Number(valorMeta ?? 0),
      dataAlvo: this.fromInputDate(dataAlvoInput),
    };
    this.carregando.set(true);
    this.erro.set(null);
    this.api.atualizar(id, body).subscribe({
      next: () => this.carregar(),
      error: () => { this.erro.set('Falha ao atualizar'); this.carregando.set(false); },
    });
  }

  remover(id: number) {
    this.carregando.set(true);
    this.erro.set(null);
    this.api.remover(id).subscribe({
      next: () => this.carregar(),
      error: () => { this.erro.set('Falha ao excluir'); this.carregando.set(false); },
    });
  }

  /** ===== Helpers ===== */
  private todayISO(): string {
    const d = new Date(); d.setHours(0,0,0,0);
    return d.toISOString().slice(0,10);
  }
  private normalizeISO(d: string | null | undefined): string {
    if (!d) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    const dt = new Date(d);
    return isNaN(+dt) ? '' : dt.toISOString().slice(0,10);
  }
  /** Atingida: data alvo <= hoje e valorMeta > 0 (regra simples) */
  private isAtingida(m: MetaFinanceira): boolean {
    const iso = this.normalizeISO(m.dataAlvo);
    if (!iso) return false;
    return iso <= this.todayISO() && (Number(m.valorMeta) || 0) > 0;
  }

  toInputDate(d: string | null | undefined): string { return this.normalizeISO(d); }

  private fromInputDate(iso: string | Date): string {
    if (!iso) return '';
    const s = typeof iso === 'string' ? iso : this.toIsoDate(iso);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return '';
    return `${m[3]}/${m[2]}/${m[1]}`;
  }
  private toIsoDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}
