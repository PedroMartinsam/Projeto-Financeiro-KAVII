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
  min-height: 100vh; 
  background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
}

/* BOTÃO CRIAR e FECHAR — BRANCO COM TEXTO PRETO */
.k-btn-primary {
  background: linear-gradient(145deg, #2b0066, #e6e0eeff); /* fundo roxo escuro */
  color: #fff; /* texto claro */
  border: 1px solid #7f42ff55;
  box-shadow: 0 6px 16px rgba(0,0,0,.35);
  font-weight: 800;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  transition: transform .08s ease, box-shadow .15s ease, background .15s ease;
}

/* Hover */
.k-btn-primary:hover {
  background: linear-gradient(145deg, #3a007a, #e4deebff); /* tom mais vibrante no hover */
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(127,66,255,.45);
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
      --text:#fff;
      --muted:#fff;

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
    
  .k-card--pad {
  background: linear-gradient(145deg, #2b0066, #140033);
  border: 1px solid #7f42ff55;
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 20px rgba(0,0,0,.35);
  padding: 28px;
  color: #f1ecff;
}
    .k-card--padless{ padding:0; }

    .k-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 24px;

  background: linear-gradient(145deg, #2b0066, #140033);
  border: 1px solid #7f42ff55;
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 20px rgba(0,0,0,.35);
  color: #f1ecff;
}

/* Título e subtítulo */
.k-title {
  margin: 0;
  font-size: clamp(24px, 2.8vw, 32px);
  font-weight: 800;
  color: #fff;
}

.k-sub {
  margin-top: 6px;
  font-size: 14px;
  color: #d9c9ff;
}

/* Botões do topo */
.k-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Cards / Tabela */
.k-seg {
  display: flex;
  border: 1px solid #7f42ff55;
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
  padding: 4px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
}

.k-seg__btn {
  border: 0;
  background: transparent;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 700;
  color: #d9c9ff;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, transform .06s ease;
}

.k-seg__btn:hover {
  background: rgba(255,255,255,0.12);
}

.k-seg__btn.is-active {
  background: linear-gradient(180deg, var(--accent-2), var(--accent));
  color: #fff;
}


    /* ===== FORM DE CRIAÇÃO ===== */
    .k-form-row {
  display: flex;
  gap: 16px;
  align-items: center; /* ⬅️ muda de flex-end para center */
  flex-wrap: wrap;
}
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
    .k-input-lg {
  background: rgba(255,255,255,0.08);
  border: 1px solid #7f42ff55;
  color: #fff;
  padding: 14px;
  font-size: 15px;
}

.k-input-lg::placeholder {
  color: #d9c9ff;
}

.k-input-lg:focus {
  background: rgba(255,255,255,0.12);
  border-color: #7f42ff;
  box-shadow: 0 0 0 2px rgba(127,66,255,.35);
}

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
    .k-btn-ghost {
  background: rgba(255,255,255,0.08);
  color: #f1ecff;
  border: 1px solid #7f42ff55;
}

.k-btn-ghost:hover {
  background: rgba(255,255,255,0.12);
}

    /* PRIMÁRIO ROXO CHAMATIVO — TEXTO PRETO (pedido) */
    .k-btn-primary {
  background: linear-gradient(180deg, var(--accent-2), var(--accent));
  color: #fff;
  border: 1px solid #7f42ff55;
  box-shadow: 0 4px 12px rgba(234, 231, 238, 0.32);
}

.k-btn-primary:hover {
  background: linear-gradient(180deg, #D8B6FF, var(--accent));
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(181, 23, 255, .32);
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

    /* ===== CARD ROXO ESCURO PADRÃO (COMPACTO) ===== */
    
.k-bank {
  display: inline-block;     /* mantém os cards lado a lado */
  vertical-align: top;
  margin: 20px;              /* espaçamento externo maior */

  background: linear-gradient(145deg, #2b0066, #140033);
  border: 1px solid #7f42ff55;
  border-radius: 14px;

  padding: 28px;             /* espaço interno mais confortável */
  height: auto;              /* altura automática conforme conteúdo */
  max-width: 400px;          /* mais espaço para textos longos */

  box-shadow: 
    0 8px 20px rgba(0,0,0,.35),
    inset 0 0 0 1px rgba(255,255,255,.08);

  color: #f1ecff;

  transition: 
    transform .14s ease, 
    box-shadow .14s ease, 
    border-color .14s ease;
}





.k-bank:hover {
  transform: translateY(-2px);
  border-color: #7f42ff;
  box-shadow:
    0 10px 26px rgba(127,66,255,.45),
    inset 0 0 0 1px rgba(255,255,255,.12);
}

/* ===== TOPO DO CARD ===== */
.k-bank__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px; /* ⬅️ MENOR */
}

/* ===== ID ===== */
.k-id {
  font-size: 11px;   /* ⬅️ MENOR */
  font-weight: 800;
  color: #fff;
  background: rgba(127, 66, 255, 0.25);
  border: 1px solid #7f42ff55;
  padding: 5px 8px;  /* ⬅️ MENOR */
  border-radius: 999px;
}

/* ===== ÍCONE / BOLINHA ===== */
.k-mono {
  width: 38px;      /* ⬅️ MENOR */
  height: 38px;     /* ⬅️ MENOR */
  border-radius: 10px;

  display: grid;
  place-items: center;
  font-weight: 400;
  color: #fff;
  letter-spacing: .5px;

  background: linear-gradient(135deg, #B517FF, #7f42ff);
  box-shadow: inset 0 0 6px rgba(255,255,255,.25);
}

/* ===== INPUTS DENTRO DO CARD ===== */
.k-bank .k-input {
  background: rgba(255,255,255,0.08);
  border: 1px solid #7f42ff55;
  color: #fff;

  padding: 8px 10px;   /* ⬅️ MENOR */
  font-size: 13px;    /* ⬅️ MENOR */
}

.k-bank .k-input::placeholder {
  color: #d9c9ff;
}

.k-bank .k-input:focus {
  background: rgba(255,255,255,0.12);
  border-color: #7f42ff;
  box-shadow: 0 0 0 2px rgba(127,66,255,.35);
}

/* ===== AÇÕES ===== */
.k-actions {
  display: flex;
  gap: 6px;      /* ⬅️ MENOR */
  margin-top: 10px;
}

    /* ===== TABELA ===== */
   .k-table-wrap {
  width: 100%;
  overflow: auto;
  border-radius: 16px;
  padding: 12px;
  background: linear-gradient(145deg, #2b0066, #140033); /* fundo igual ao card */
  box-shadow: 
    0 6px 16px rgba(0,0,0,.35),
    inset 0 0 0 1px rgba(255,255,255,.08);
}

.k-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 15px;
  color: #f1ecff; /* texto claro igual ao card */
}

.k-table thead th {
  text-align: left;
  padding: 18px 20px;
  font-weight: 800;
  color: #fff;
  background: rgba(127, 66, 255, 0.25); /* tom lilás translúcido */
  border-bottom: 2px solid #7f42ff55;
}

.k-table tbody td {
  padding: 16px 20px;
  border-bottom: 1px solid #7f42ff55;
  vertical-align: middle;
  background: rgba(255,255,255,0.04); /* fundo leve nas células */
}

.k-table tbody tr:nth-child(odd) td {
  background: rgba(255,255,255,0.06); /* alternância suave */
}

.k-table tbody tr:hover td {
  background: rgba(255,255,255,0.12);
  transition: background 0.2s ease;
}

.k-cell-id {
  color: #d9c9ff;
  font-weight: 800;
}



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
