import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ContasService, Conta, IdNome, ContaPayload } from './contas.service';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="topbar">
      <h2>Contas</h2>
      <button class="btn-outline" (click)="carregarTudo()" [disabled]="carregando()">
        <span *ngIf="carregando()" class="spinner"></span> Recarregar
      </button>
    </div>

    <div class="panel">
      <form [formGroup]="form" (ngSubmit)="criar()" class="form-grid">
        <div class="form-item">
          <label>Descrição</label>
          <input class="input" placeholder="Ex.: Conta Corrente Santander" formControlName="descricao">
        </div>

        <div class="form-item">
          <label>Saldo (R$)</label>
          <input type="number" step="0.01" class="input" placeholder="0,00" formControlName="saldo" inputmode="decimal">
        </div>

        <div class="form-item">
          <label>Limite (R$)</label>
          <input type="number" step="0.01" class="input" placeholder="0,00" formControlName="limite" inputmode="decimal">
        </div>

        <div class="form-item">
          <label>Tipo</label>
          <select class="select" formControlName="tipoConta">
            <option *ngFor="let t of tiposConta" [value]="t.value">{{ t.label }}</option>
          </select>
        </div>

        <div class="form-item">
          <label>Banco</label>
          <select class="select" formControlName="bancoId">
            <option [ngValue]="null">– Banco –</option>
            <option *ngFor="let b of bancos()" [ngValue]="b.id">{{ b.razaoSocial || b.nome || ('#' + b.id) }}</option>
          </select>
        </div>

        <div class="form-item">
          <label>Usuário</label>
          <select class="select" formControlName="usuarioId">
            <option [ngValue]="null">– Usuário –</option>
            <option *ngFor="let u of usuarios()" [ngValue]="u.id">{{ u.nome || ('#' + u.id) }}</option>
          </select>
        </div>

        <div class="form-item">
          <label>Meta Financeira</label>
          <select class="select" formControlName="metaFinanceiraId">
            <option [ngValue]="null">– Meta Financeira –</option>
            <option *ngFor="let m of metas()" [ngValue]="m.id">{{ m.descricaoMeta || ('#' + m.id) }}</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="btn" type="submit" [disabled]="form.invalid || carregando()">Criar</button>
        </div>

        <div class="form-error" *ngIf="erro()">{{ erro() }}</div>
      </form>
    </div>

    <input class="input mb" placeholder="Filtrar por descrição / saldo / limite / tipo..."
           (input)="filtro.set(($any($event.target).value ?? '').toString())">

    <div class="cards">
      <div class="card" *ngFor="let c of contasFiltradas()">
        <div class="card-inner">
          <div class="card-header">
            <div class="title-wrap">
              <input class="title-input"
                     [ngModel]="c.descricao"
                     [ngModelOptions]="{standalone:true}"
                     (ngModelChange)="c.descricao = $event"
                     placeholder="Descrição da conta" />
            </div>

            <div class="meta-tag">
              <span class="meta-icon">🎯</span>
              <span class="meta-text">{{ c.metaFinanceira?.descricaoMeta || 'Sem meta' }}</span>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-row">
              <span class="label">Banco</span>
              <select class="chip-select"
                      [ngModel]="c.banco?.id ?? null"
                      [ngModelOptions]="{standalone:true}"
                      (ngModelChange)="c.banco = $event ? { id: $event } : undefined">
                <option [ngValue]="null">–</option>
                <option *ngFor="let b of bancos()" [ngValue]="b.id">{{ b.razaoSocial || b.nome || ('#' + b.id) }}</option>
              </select>
            </div>

            <div class="info-row">
              <span class="label">Usuário</span>
              <select class="chip-select"
                      [ngModel]="c.usuario?.id ?? null"
                      [ngModelOptions]="{standalone:true}"
                      (ngModelChange)="c.usuario = $event ? { id: $event } : undefined">
                <option [ngValue]="null">–</option>
                <option *ngFor="let u of usuarios()" [ngValue]="u.id">{{ u.nome || ('#' + u.id) }}</option>
              </select>
            </div>

            <div class="info-row">
              <span class="label">Tipo</span>
              <select class="chip-select"
                      [ngModel]="c.tipoConta"
                      [ngModelOptions]="{standalone:true}"
                      (ngModelChange)="c.tipoConta = $event">
                <option *ngFor="let t of tiposConta" [ngValue]="t.value">{{ t.label }}</option>
              </select>
            </div>

            <div class="info-row">
              <span class="label">Saldo</span>
              <input type="number" step="0.01" class="chip-input"
                     [ngModel]="c.saldo"
                     [ngModelOptions]="{standalone:true}"
                     (ngModelChange)="c.saldo = toNumber($event)"
                     placeholder="0,00">
            </div>

            <div class="info-row">
              <span class="label">Limite</span>
              <input type="number" step="0.01" class="chip-input"
                     [ngModel]="c.limite"
                     [ngModelOptions]="{standalone:true}"
                     (ngModelChange)="c.limite = toNumber($event)"
                     placeholder="0,00">
            </div>
          </div>

          <div class="progress-wrap">
            <div class="progress-header">
              <span class="label-strong">Uso do limite</span>
              <span class="value-strong">
                {{
                  (toNumber(c.limite) > 0)
                    ? ((toNumber(c.saldo) / toNumber(c.limite)) * 100 | number:'1.0-0') + '%'
                    : '—'
                }}
              </span>
            </div>

            <div class="progress-container" role="progressbar" [attr.aria-valuenow]="(toNumber(c.limite) > 0) ? (toNumber(c.saldo) / toNumber(c.limite)) * 100 : 0">
              <div class="progress-bar"
                   [style.width.%]="(toNumber(c.limite) > 0) ? (toNumber(c.saldo) / toNumber(c.limite)) * 100 : 0"
                   [style.background]="getTipoColors(c.tipoConta).saldoGradient"
                   [style.boxShadow]="getTipoColors(c.tipoConta).saldoShadow">
              </div>
            </div>

            <div class="progress-legend">
              <span class="legend-item">
                <span class="dot" [style.background]="getTipoColors(c.tipoConta).saldoColor"></span> Saldo
              </span>
              <span class="legend-item">
                <span class="dot" [style.background]="getTipoColors(c.tipoConta).limiteColor"></span> Limite
              </span>
            </div>

            <div class="progress-footer">
              <span>Saldo: {{ c.saldo | currency:'BRL':'symbol-narrow':'1.2-2' }}</span>
              <span>Limite: {{ c.limite | currency:'BRL':'symbol-narrow':'1.2-2' }}</span>
            </div>
          </div>

          <div class="btns">
            <button class="btn"
                    (click)="atualizar(c.id, {
                      descricao: c.descricao,
                      saldo: c.saldo,
                      limite: c.limite,
                      tipoConta: c.tipoConta,
                      bancoId: c.banco?.id ?? null,
                      usuarioId: c.usuario?.id ?? null,
                      metaFinanceiraId: c.metaFinanceira?.id ?? null
                    })"
                    [disabled]="carregando()">Salvar</button>

            <button class="btn btn-del" (click)="remover(c.id)" [disabled]="carregando()">Excluir</button>
          </div>
        </div>
      </div>

      <div *ngIf="!contas().length" class="empty">Nenhuma conta cadastrada</div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
      min-height: 100vh;
      color: #ffffff;
      font-family: 'Poppins', sans-serif;
      padding: 2rem;
    }



    /* Topbar */
    .topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; gap:1rem; }
    h2 { margin:0; color:#fff; font-weight:800; letter-spacing:.2px; text-shadow:0 0 4px #6b4dff55; font-size:1.4rem; }
    .btn-outline { 
  background: #ffffff; /* FUNDO BRANCO */
  color: #000;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: .45rem .8rem;
  cursor: pointer;
  transition: all .2s ease;
}

.btn-outline:hover{
  background: #f5f5f5;
  border-color: #bbb;
}
    .spinner { width:14px; height:14px; border:2px solid #d9ccff; border-top-color:transparent; border-radius:50%; margin-right:.4rem; animation:spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Panel form */
    .panel { background: linear-gradient(145deg, #260053, #140032); border-radius:12px; padding:1rem; border:1px solid #7f42ff33; box-shadow: 0 8px 20px #5c3cff22; margin-bottom:1rem; }
    .form-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: .9rem 1rem; align-items:end; }
    .form-item { display:flex; flex-direction:column; gap:.35rem; }
    label { color:#f3efff; font-size:.9rem; font-weight:700; }
    .input, .select { background:#1f013f; border:1px solid #8a6aff66; color:#fff; border-radius:10px; padding:.5rem .7rem; outline:none; }
    .input::placeholder { color:#d8d1ff; }
    .input:focus, .select:focus { border-color:#c1a8ff; box-shadow:0 0 0 3px #754bff22; }
    .form-actions { display:flex; justify-content:flex-end; align-items:center; }
    .form-error { grid-column:1 / -1; color:#ffb8c4; font-weight:700; }

    .btn { background: linear-gradient(135deg, #5e00ff, #8b33ff); border:none; border-radius:10px; color:#fff; padding:.55rem 1rem; font-weight:700; cursor:pointer; }
    .btn:hover { filter:brightness(1.06); transform: translateY(-1px); }
    .btn-del { background: linear-gradient(135deg, #ff4b6e, #ff6b8a); }

    .mb { margin-bottom:1rem; }

    /* Cards grid: ensure equal-height cards by stretching items */
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
      align-items: stretch;
      align-content: start;
    }

    .card {
      display: flex;
      flex-direction: column;
      min-height: 360px;       /* increased base height for all cards */
      max-height: 420px;       /* avoid extremely tall cards */
      height: 100%;            /* allow grid items to stretch equally */
      background: linear-gradient(145deg, #2b0066, #140033);
      border-radius: 14px;
      padding: 1rem;
      box-shadow: 0 8px 20px #25201722, inset 0 0 0 1px #fffc6322;
      border:1px solid #7f42ff33;
      box-sizing: border-box;
    }

    /* inner wrapper stretches to push footer down */
    .card-inner {
      display:flex;
      flex-direction:column;
      flex: 1 1 auto;
      gap: .6rem;
      overflow: hidden;
    }

    /* ===== updated header/title block (paste this over your old block) ===== */
    .card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .4rem;
      text-align: center;
      padding: 0 .4rem; /* avoids title touching card edges */
    }

    .title-wrap {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    /* Título centralizado, permite quebra automática até 2 linhas e aplica ellipsis */
    .title-input {
      width: 100%;
      border: none;
      background: transparent;
      color: #fff;
      font-size: 1.05rem;
      font-weight: 800;
      text-align: center;
      outline: none;
      display: -webkit-box;
      -webkit-line-clamp: 2;       /* limits to 2 lines */
      -webkit-box-orient: vertical;
      white-space: normal;         /* allows line-break */
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.15em;
      max-height: calc(1.15em * 2);/* ensures it doesn't grow beyond 2 lines */
      padding: 0 .25rem;
      box-sizing: border-box;
    }
    /* ===================================================================== */

    .meta-tag { display:inline-flex; align-items:center; gap:.35rem; background: linear-gradient(90deg, #7e49ff, #b993ff); color:#fff; font-size:.82rem; padding:.28rem .6rem; border-radius:10px; box-shadow:0 0 8px #8b4dff44; font-weight:700; }

    .info-grid { display:grid; grid-template-columns: 1fr 1fr; gap:.5rem .7rem; align-items:center; }
    @media (max-width:520px) { .info-grid { grid-template-columns: 1fr; } }

    .info-row { display:flex; align-items:center; gap:.5rem; flex-wrap:nowrap; min-width:0; }
    .label { min-width:70px; color:#fff; font-weight:700; flex:0 0 auto; }

    .chip-select, .chip-input {
      background:#1f013f; border:1px solid #8a6aff66; color:#fff; border-radius:8px; padding:.35rem .5rem; outline:none;
      width:100%; min-width:0; flex:1 1 auto; box-sizing:border-box;
    }
    .chip-select:focus, .chip-input:focus { border-color:#c1a8ff; box-shadow:0 0 0 3px #754bff22; }

    .chip-select option, .chip-input { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

    .progress-wrap { margin-top:.4rem; flex: 0 0 auto; }
    .progress-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:.4rem; gap:.6rem; }
    .label-strong, .value-strong { color:#fff; font-weight:800; font-size:.95rem; }

    .progress-container { background:#21004a; height:12px; border-radius:10px; overflow:hidden; outline:1px solid #5d38b933; box-shadow: inset 0 0 6px #00000055; }
    .progress-bar { height:100%; border-radius:10px; transition: width .35s ease; }

    .progress-legend { display:flex; gap:1rem; align-items:center; margin-top:.45rem; color:#f0eaff; font-weight:700; font-size:.88rem; }
    .legend-item { display:inline-flex; align-items:center; gap:.4rem; white-space:nowrap; }
    .dot { width:11px; height:11px; border-radius:50%; box-shadow:0 0 6px currentColor; }

    .progress-footer { display:flex; justify-content:space-between; margin-top:.4rem; color:#f8f6ff; font-weight:800; font-size:.9rem; }

    .btns { display:flex; justify-content:space-between; gap:.6rem; margin-top:auto; } /* margin-top:auto pushes buttons to bottom */
    .empty { grid-column:1 / -1; text-align:center; color:#f0eaff; padding:1rem 0; font-weight:800; }

    @media (max-width: 420px) {
      .card { min-height: 260px; max-height: none; }
      .title-input { font-size: 1rem; }
      .label { min-width: 64px; }
    }
  `]
})
export class ContasComponent {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(ContasService);

  contas = signal<Conta[]>([]);
  filtro = signal('');
  carregando = signal(false);
  erro = signal<string | null>(null);

  bancos = signal<IdNome[]>([]);
  usuarios = signal<IdNome[]>([]);
  metas = signal<IdNome[]>([]);

  tiposConta = [
    { value: 'CONTA_CORRENTE', label: 'Conta Corrente' },
    { value: 'CONTA_INVESTIMENTO', label: 'Conta Investimento' },
    { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { value: 'CARTAO_ALIMENTACAO', label: 'Cartão Alimentação' },
    { value: 'POUPANCA', label: 'Poupança' },
  ] as const;

  form = this.fb.group({
    descricao: ['', Validators.required],
    saldo: [0 as number, Validators.required],
    limite: [0 as number, Validators.required],
    tipoConta: [this.tiposConta[0].value, Validators.required],
    usuarioId: [null as number | null],
    bancoId: [null as number | null],
    metaFinanceiraId: [null as number | null],
  });

  contasFiltradas = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    const arr = this.contas();
    if (!f) return arr;
    return arr.filter(c =>
      (c.descricao ?? '').toLowerCase().includes(f) ||
      String(c.saldo ?? '').includes(f) ||
      String(c.limite ?? '').includes(f) ||
      (c.tipoConta ?? '').toLowerCase().includes(f)
    );
  });

  ngOnInit() { this.carregarTudo(); }

  private getErrorMessage(err: any, fallback: string) {
  return err?.error?.message ||
         err?.error?.error ||
         err?.message ||
         fallback;
}


  carregarTudo() {
  this.carregando.set(true);
  this.erro.set(null);

  this.api.listar().subscribe({
    next: (cs) => {
      this.contas.set(cs ?? []);
      this.carregando.set(false);
    },
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao carregar contas');
      this.erro.set(msg);
      this.carregando.set(false);
    }
  });

  this.api.listarBancos().subscribe({
    next: (b) => this.bancos.set(b ?? []),
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao carregar bancos');
      console.error(msg);
    }
  });

  this.api.listarUsuarios().subscribe({
    next: (u) => this.usuarios.set(u ?? []),
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao carregar usuários');
      console.error(msg);
    }
  });

  this.api.listarMetas().subscribe({
    next: (m) => this.metas.set(m ?? []),
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao carregar metas');
      console.error(msg);
    }
  });
}


criar() {
  if (this.form.invalid) return;

  const payload: ContaPayload = this.form.getRawValue();
  this.carregando.set(true);
  this.erro.set(null);

  this.api.criar(payload).subscribe({
    next: () => {
      this.form.reset({
        descricao: '',
        saldo: 0,
        limite: 0,
        tipoConta: this.tiposConta[0].value,
        usuarioId: null,
        bancoId: null,
        metaFinanceiraId: null
      });

      this.carregarTudo();
    },
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao criar conta');
      this.erro.set(msg);
      this.carregando.set(false);
    }
  });
}


atualizar(id: number, dto: Partial<ContaPayload>) {
  this.carregando.set(true);
  this.erro.set(null);

  this.api.atualizar(id, dto).subscribe({
    next: () => this.carregarTudo(),
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao atualizar conta');
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
      const msg = this.getErrorMessage(err, 'Falha ao excluir conta');
      this.erro.set(msg);
      this.carregando.set(false);
    }
  });
}



  toNumber(n: any): number {
    const v = Number(n);
    return isNaN(v) ? 0 : v;
  }

  getTipoColors(tipo: string | undefined) {
    const t = (tipo ?? '').toUpperCase();
    switch (t) {
      case 'CARTAO_CREDITO':
        return {
          saldoColor: '#ffb500',
          limiteColor: '#7bd0ff',
          saldoGradient: 'linear-gradient(90deg, #ffd76b, #ff9f1a)',
          saldoShadow: '0 0 8px #ffb50066'
        };
      case 'CONTA_CORRENTE':
        return {
          saldoColor: '#7affb2',
          limiteColor: '#7bd0ff',
          saldoGradient: 'linear-gradient(90deg, #7affb2, #37e08a)',
          saldoShadow: '0 0 8px #37e08a66'
        };
      case 'CONTA_INVESTIMENTO':
        return {
          saldoColor: '#b8ff7a',
          limiteColor: '#c0a6ff',
          saldoGradient: 'linear-gradient(90deg, #c8ff9e, #9be46b)',
          saldoShadow: '0 0 8px #9be46b66'
        };
      case 'CARTAO_ALIMENTACAO':
        return {
          saldoColor: '#ff9ecd',
          limiteColor: '#7bd0ff',
          saldoGradient: 'linear-gradient(90deg, #ffc0df, #ff82bc)',
          saldoShadow: '0 0 8px #ff82bc66'
        };
      case 'POUPANCA':
        return {
          saldoColor: '#ffe27a',
          limiteColor: '#a7e0ff',
          saldoGradient: 'linear-gradient(90deg, #ffe27a, #ffc44d)',
          saldoShadow: '0 0 8px #ffc44d66'
        };
      default:
        return {
          saldoColor: '#ffd76b',
          limiteColor: '#7bd0ff',
          saldoGradient: 'linear-gradient(90deg, #ffd76b, #ff9f1a)',
          saldoShadow: '0 0 8px #ffb50066'
        };
    }
  }
}
