import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BancosService, Banco } from './bancos.service';

@Component({
  selector: 'app-bancos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <!-- ===== DASHBOARD ROXO CHAMATIVO (Nubank-like) ===== -->
  <section class="k-wrap">
    <!-- Header -->
    <header class="k-header k-card">
      <div class="k-header__left">
        <h1 class="k-title">Bancos</h1>
        <p class="k-sub">Gerencie as instituições financeiras cadastradas</p>
      </div>

      <div class="k-header__right">
        <div class="k-seg">
          <button class="k-seg__btn" [class.is-active]="view==='cards'" (click)="view='cards'">Tabela</button>
          <button class="k-seg__btn" [class.is-active]="view==='table'" (click)="view='table'">Cards</button>
        </div>

        <!-- Novo Banco / Fechar (texto preto) -->
        <button class="k-btn k-btn-primary" (click)="showCreate = !showCreate" [attr.aria-pressed]="showCreate">
          {{ showCreate ? 'Fechar' : 'Novo Banco' }}
        </button>

        <button class="k-btn k-btn-ghost" (click)="carregar()" [disabled]="loading" title="Recarregar">
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
          Recarregar
        </button>
      </div>
    </header>

    <!-- Criar -->
    <div class="k-card k-card--pad" *ngIf="showCreate">
      <form [formGroup]="form" (ngSubmit)="criar()" class="k-form-row">
        <div class="k-form-col">
          <label class="k-label">Razão Social</label>
          <input formControlName="razaoSocial"
                 class="k-input k-input-lg"
                 placeholder="Ex.: Santander, Nubank, XP Investimentos"
                 (keyup.enter)="!form.invalid && !loading && criar()" />
          <small class="k-hint">Preencha a razão social e pressione Enter ou clique em Criar</small>
        </div>
        <div class="k-form-actions">
          <!-- Criar (texto preto) -->
          <button type="submit" class="k-btn k-btn-primary" [disabled]="form.invalid || loading">
            Criar
          </button>
        </div>
      </form>

      <div *ngIf="error" class="k-alert k-alert-danger mt-12">{{ error }}</div>
    </div>

    <!-- Lista -->
    <ng-container [ngSwitch]="view">
      <!-- ====== CARDS ====== -->
      <div *ngSwitchCase="'cards'" class="k-grid">
        <div *ngIf="!bancos?.length" class="k-empty">Nenhum banco cadastrado.</div>

        <article *ngFor="let b of bancos" class="k-bank">
          <div class="k-bank__top">
            <span class="k-id">#{{ b.id }}</span>
            <div class="k-mono">{{ (b.razaoSocial || '??') | slice:0:2 | uppercase }}</div>
          </div>

          <label class="k-label mb-6">Razão Social</label>
          <div class="k-input-row" (keyup.enter)="atualizar(b.id, novo.value)">
            <input #novo class="k-input" [value]="b.razaoSocial" placeholder="Razão social" />
          </div>

          <div class="k-actions">
            <button class="k-btn k-btn-success" (click)="atualizar(b.id, novo.value)" [disabled]="loading">
              Salvar
            </button>
            <button class="k-btn k-btn-danger" (click)="remover(b.id)" [disabled]="loading">
              Excluir
            </button>
          </div>
        </article>
      </div>

      <!-- ====== TABELA ====== -->
      <div *ngSwitchCase="'table'" class="k-card k-card--padless">
        <div class="k-table-wrap">
          <table class="k-table">
            <thead>
              <tr>
                <th style="width:100px">ID</th>
                <th>Razão Social</th>
                <th class="text-end" style="width:240px"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bancos" class="k-row">
                <td class="k-cell-id">#{{ b.id }}</td>
                <td>
                  <input [value]="b.razaoSocial" #novo class="k-input k-input-sm" placeholder="Razão social" />
                </td>
                <td class="text-end">
                  <div class="k-actions">
                    <button class="k-btn k-btn-success" (click)="atualizar(b.id, novo.value)" [disabled]="loading">
                      Salvar
                    </button>
                    <button class="k-btn k-btn-danger" (click)="remover(b.id)" [disabled]="loading">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!bancos?.length">
                <td colspan="3" class="k-empty">Nenhum banco cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ng-container>
  </section>
  `,
  styles: [`
    /* ===== TOKENS / PALETA ROXO CHAMATIVO ===== */
    
   :host{
  display: block;
  min-height: 100vh; /* ✅ ERA 100% – AGORA 100vh */
  background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
}

/* BOTÃO CRIAR e FECHAR — BRANCO COM TEXTO PRETO */
.k-btn-primary{
  background: #ffffff !important;
  color: #000000 !important;
  border: 1.5px solid #e0e0e0 !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.10) !important;
  font-weight: 800;
}

/* Hover */
.k-btn-primary:hover{
  background: #f2f2f2 !important;
  color: #000000 !important;
  box-shadow: 0 6px 16px rgba(0,0,0,0.16) !important;
  transform: translateY(-1px);
}

/* Desativado */
.k-btn-primary:disabled{
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}


    :root{
      --bg:#f7f9fc;

      /* Roxo Nubank-like (chamativo e elegante) */
      --purple-strong:#8A05BE; /* primário vibrante */
      --purple-glow:#B517FF;   /* brilho/gradiente alto */
      --purple-soft:#E6D5FF;   /* superfícies claras */
      --lilac-100:#FBF5FF;
      --lilac-200:#F6EDFF;
      --lilac-300:#EFE2FF;

      --card:#ffffff;
      --title:#0b1220;
      --text:#1b2430;
      --muted:#6b6f85;

      --border:#E6DAFF;          /* lilás nas bordas */
      --border-strong:#D9C9FF;
      --input:#F8F3FF;           /* leve lilás no input */

      /* Acentos (substituem os antigos) */
      --accent: var(--purple-strong);
      --accent-2: var(--purple-glow);

      /* Estados */
      --success:#16a34a;
      --danger:#e11d48;

      --shadow:0 10px 30px rgba(74, 107, 174, 0.08);
      --shadow-sm:0 4px 14px rgba(16,24,40,.06);

      --radius-xl:18px;
      --radius-lg:14px;
      --radius-md:10px;
    }

    /* ===== WRAP & HEADER ===== */
    .k-wrap{ max-width:1120px; margin:0 auto; padding:32px 20px 64px; color:var(--text); }
    .k-card{
      background:var(--card); border:1px solid var(--border);
      border-radius:var(--radius-xl); box-shadow:var(--shadow);
    }
    .k-card--pad{ padding:18px; }
    .k-card--padless{ padding:0; }

    .k-header{ display:flex; justify-content:space-between; align-items:center; padding:16px 18px; margin-bottom:16px; }
    .k-title{ margin:0; color:var(--title); font-weight:800; letter-spacing:.2px; font-size: clamp(22px, 2.6vw, 28px); }
    .k-sub{ margin:4px 0 0; color:var(--muted); font-size:13px; }
    .k-header__left{ display:flex; flex-direction:column; gap:6px; }
    .k-header__right{ display:flex; align-items:center; gap:12px; }

    /* Segmented control */
    .k-seg{ display:flex; border:1px solid var(--border); background:#fff; border-radius:999px; padding:4px; box-shadow:var(--shadow-sm); }
    .k-seg__btn{
      border:0; background:transparent; padding:8px 14px; border-radius:999px;
      font-weight:700; color:#3c3f52; cursor:pointer;
      transition: background .15s ease, color .15s ease, transform .06s ease;
    }
    .k-seg__btn:hover{ background:var(--lilac-200); }
    .k-seg__btn.is-active{
      background: linear-gradient(180deg, var(--accent-2), var(--accent));
      color:#fff;
    }

    /* ===== FORM DE CRIAÇÃO ===== */
    .k-form-row{ display:flex; gap:16px; align-items:flex-end; flex-wrap:wrap; }
    .k-form-col{ flex:1 1 560px; min-width:280px; }
    .k-label{ display:block; font-weight:700; font-size:13px; color:#3a3556; margin-bottom:8px; }
    .k-hint{ display:block; color:var(--muted); font-size:12px; margin-top:6px; }
    .k-form-actions{ display:flex; gap:8px; }

    .k-input{
      width:100%; border-radius:var(--radius-md); border:1px solid var(--border);
      background:var(--input); padding:10px 12px; font-size:14px; line-height:1.2;
      transition:border-color .15s ease, box-shadow .15s ease, background .15s ease, transform .05s ease;
    }
    .k-input:hover{ background:var(--lilac-200); }
    .k-input:focus{
      outline:none;
      border-color: color-mix(in hsl, var(--accent) 65%, var(--border));
      box-shadow: 0 0 0 3px color-mix(in hsl, var(--accent) 22%, transparent);
      background:#fff;
    }
    .k-input-lg{ padding:14px 14px; font-size:15px; }
    .k-input-sm{ padding:8px 10px; font-size:14px; }

    /* ===== BUTTONS ===== */
    .k-btn{
      border:1px solid var(--border); background:#fff; color:#0b1220;
      padding:10px 14px; border-radius:var(--radius-md); font-weight:800;
      box-shadow:var(--shadow-sm); cursor:pointer;
      transition:transform .08s ease, box-shadow .15s ease, border-color .15s ease, background .15s ease;
    }
    .k-btn:hover{ transform: translateY(-1px); box-shadow:var(--shadow); }
    .k-btn:disabled{ opacity:.65; cursor:not-allowed; transform:none; box-shadow:var(--shadow-sm); }
    .k-btn-ghost{ background:#fff; }

    /* PRIMÁRIO ROXO CHAMATIVO — TEXTO PRETO (pedido) */
    .k-btn-primary{
      color:#ffff; 
      background: linear-gradient(180deg, var(--accent-2) 0%, var(--accent) 100%);
      border-color: color-mix(in hsl, var(--accent) 70%, transparent);
      box-shadow: 0 4px 12px rgba(234, 231, 238, 0.32);
    }
    .k-btn-primary:hover{
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(181, 23, 255, .32);
      /* mais claro no hover para manter contraste do texto preto */
      background: linear-gradient(180deg, #D8B6FF 0%, var(--accent) 100%);
    }

    /* Sucesso / Perigo (mantidos) */
    .k-btn-success{
      color:#fff; border-color: color-mix(in hsl, var(--success), transparent 50%);
      background: linear-gradient(180deg, #22c55e, #16a34a); padding:8px 12px;
    }
    .k-btn-danger{
      color:#fff; border-color: color-mix(in hsl, var(--danger), transparent 50%);
      background: linear-gradient(180deg, #f43f5e, #e11d48); padding:8px 12px;
    }

    .mt-12{ margin-top:12px; }

    /* ===== GRID DE CARDS ===== */
    .k-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-top:16px; }
    .k-bank{
      background:#fff; border:1px solid var(--border); border-radius:16px; padding:16px; box-shadow:var(--shadow);
      transition: transform .14s ease, box-shadow .14s ease, border-color .14s ease;
    }
    .k-bank:hover{ transform: translateY(-2px); border-color:var(--border-strong); box-shadow:0 12px 32px rgba(16,24,40,.10); }
    .k-bank__top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    .k-id{ font-size:12px; font-weight:800; color:#5a5; background:var(--lilac-200); border:1px solid var(--border); padding:6px 10px; border-radius:999px; }
    .k-mono{
      width:44px; height:44px; border-radius:12px; display:grid; place-items:center; font-weight:900; color:#fff; letter-spacing:.5px;
      background: linear-gradient(135deg, var(--accent-2), var(--accent));
      box-shadow: inset 0 0 8px rgba(255,255,255,.25);
    }
    .mb-6{ margin-bottom:6px; }
    .k-input-row{ display:flex; gap:10px; align-items:center; }
    .k-actions{ display:flex; gap:8px; margin-top:12px; }

    /* ===== TABELA ===== */
    .k-table-wrap{ width:100%; overflow:auto; border-radius:16px; }
    .k-table{ width:100%; border-collapse:separate; border-spacing:0; }
    .k-table thead th{
      text-align:left; padding:14px 16px; font-weight:800; color:#548;
      background:var(--lilac-100); border-bottom:1px solid var(--border);
    }
    .k-table tbody td{ padding:14px 16px; border-bottom:1px solid var(--border); vertical-align:middle; }
    .k-row:nth-child(odd) td{ background:var(--lilac-100); }
    .k-row:hover td{ background:var(--lilac-200); }
    .k-cell-id{ color:#548; font-weight:800; }

    /* ===== EMPTY / ALERT ===== */
    .k-empty{ text-align:center; padding:28px; color:var(--muted); background:var(--lilac-100); border-top:1px solid var(--border); }
    .k-alert{ padding:10px 12px; border-radius:12px; font-weight:700; }
    .k-alert-danger{ background:#fff1f2; border:1px solid #fecdd3; color:#9f1239; }
  `]
})
export class BancosComponent {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(BancosService);

  bancos: Banco[] = [];
  loading = false;
  error = '';

  // visual: cards (default) ou table
  view: 'cards' | 'table' = 'cards';
  // mostra/oculta o card de criação
  showCreate = true;

  form = this.fb.group({
    razaoSocial: ['', [Validators.required]],
  });

  ngOnInit() { this.carregar(); }

  carregar() {
  this.loading = true;
  this.error = '';

  this.api.listar().subscribe({
    next: (data) => {
      this.bancos = data;
      this.loading = false;
    },
    error: (err) => {
      this.error = this.getErrorMessage(err, 'Falha ao carregar');
      this.loading = false;
    }
  });
}

criar() {
  if (this.form.invalid) return;

  this.loading = true;
  this.error = '';

  this.api.criar(this.form.value).subscribe({
    next: () => {
      this.form.reset();
      this.carregar();
    },
    error: (err) => {
      this.error = this.getErrorMessage(err, 'Falha ao criar');
      this.loading = false;
    }
  });
}

atualizar(id: number, razaoSocial: string) {
  this.loading = true;
  this.error = '';

  this.api.atualizar(id, { razaoSocial }).subscribe({
    next: () => this.carregar(),
    error: (err) => {
      this.error = this.getErrorMessage(err, 'Falha ao atualizar');
      this.loading = false;
    }
  });
}

remover(id: number) {
  this.loading = true;
  this.error = '';

  this.api.remover(id).subscribe({
    next: () => this.carregar(),
    error: (err) => {
      this.error = this.getErrorMessage(err, 'Falha ao excluir');
      this.loading = false;
    }
  });
}

  private getErrorMessage(err: any, fallback: string) {
  return err?.error?.message ||
         err?.error?.error ||
         err?.message ||
         fallback;
}

}
