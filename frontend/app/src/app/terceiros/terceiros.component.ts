import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TerceirosService, Terceiro } from './terceiros.service';

@Component({
  selector: 'app-Terceiros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<style>
  :root{
    --k-purple:#8A05BE;
    --k-purple-2:#B517FF;
    --k-purple-3:#E6D5FF;
    --k-purple-dark:#3C096C;
    --k-text-dark:#0b1220;
    --k-danger:#e11d48;
  }

  .k-wrap{ padding:24px; }
  .k-head{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
  .k-title{ margin:0; font-weight:900; font-size:clamp(20px,2vw,24px); color:var(--k-text-dark); }
  .k-sub{ margin:2px 0 0; color:#5a5375; font-weight:700; font-size:.95rem; }

  /* Botões */
  .k-btn{
    border-radius:12px; padding:10px 14px; font-weight:800; cursor:pointer;
    border:1px solid rgba(0,0,0,.08); transition:.15s;
  }
  .k-btn:disabled{ opacity:.6; cursor:not-allowed; }
  .k-btn-primary{
    background:linear-gradient(180deg,var(--k-purple-2) 0%,var(--k-purple) 100%);
    color:#000; box-shadow:0 6px 16px rgba(181,23,255,.28);
  }
  .k-btn-primary:hover{ transform:translateY(-1px); }
  .k-btn-reload{ background:linear-gradient(180deg,var(--k-purple-2) 0%,var(--k-purple) 100%); color:#000; }
  .k-btn-green{ background:#16a34a; color:#fff; border-color:#12843d; }
  .k-btn-red{ background:#dc2626; color:#fff; border-color:#b91c1c; }

  /* Cards */
  .k-card{
    background:#fff; border:1px solid var(--k-purple-3); border-radius:18px;
    padding:18px; box-shadow:0 16px 40px rgba(181,23,255,.12), 0 8px 18px rgba(0,0,0,.06);
  }
  .k-card + .k-card{ margin-top:16px; }

  /* Inputs */
  .k-label{ display:grid; gap:6px; font-weight:800; color:#3a3556; font-size:13px; }
  .k-input{
    padding:12px; border-radius:12px; border:1px solid var(--k-purple-3);
    background:#FBF8FF; color:#0f1020; outline:none; transition:.15s; width:100%;
  }
  .k-input:hover{ background:#f5ebff; }
  .k-input:focus{
    border-color:var(--k-purple);
    box-shadow:0 0 0 4px rgba(181,23,255,.22);
    background:#fff;
  }

  /* Tabela como linhas-card */
  .k-table{ width:100%; border-collapse:separate; border-spacing:0 10px; }
  .k-table thead th{ text-align:left; font-weight:900; color:#3a3556; padding:10px; }
  .k-table tbody td{
    background:#fff; border:1px solid var(--k-purple-3); padding:10px; vertical-align:middle;
  }
  .k-table tbody tr{ box-shadow:0 8px 20px rgba(181,23,255,.08), 0 4px 10px rgba(0,0,0,.04); }
  .k-table tbody tr td:first-child{ border-top-left-radius:12px; border-bottom-left-radius:12px; }
  .k-table tbody tr td:last-child{ border-top-right-radius:12px; border-bottom-right-radius:12px; }
  .muted{ color:#6b7280; }
  .alert-danger{ border-radius:12px; }
</style>

<section class="k-wrap">
  <!-- Cabeçalho -->
  <div class="k-head">
    <div>
      <h1 class="k-title">Empresas</h1>
      <p class="k-sub">Cadastre e gerencie fornecedores e clientes.</p>
    </div>

    <button class="k-btn k-btn-reload" (click)="carregar()" [disabled]="loading">
      <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
      Recarregar
    </button>
  </div>

  <!-- Card: Criar -->
  <div class="k-card">
    <form [formGroup]="form" (ngSubmit)="criar()" class="row g-2 align-items-end">
      <div class="col-md-6">
        <label class="k-label">Razão Social
          <input class="k-input" formControlName="razaoSocial" placeholder="Ex.: Alfa Soluções Tecnológicas Ltda.">
        </label>
      </div>
      <div class="col-auto">
        <button type="submit" class="k-btn k-btn-primary" [disabled]="form.invalid || loading">
          Criar
        </button>
      </div>

      <div class="col-12" *ngIf="error">
        <div class="alert alert-danger mt-2 mb-0">{{ error }}</div>
      </div>
    </form>
  </div>

  <!-- Card: Lista -->
  <div class="k-card">
    <div class="table-responsive">
      <table class="k-table">
        <thead>
          <tr>
            <th style="width:90px;">ID</th>
            <th>Razão Social</th>
            <th class="text-end" style="width:240px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of Terceiros">
            <td class="muted">#{{ t.id }}</td>
            <td>
              <input class="k-input" [value]="t.razaoSocial" #novo>
            </td>
            <td class="text-end">
              <button class="k-btn k-btn-green me-2"
                      (click)="atualizar(t.id, novo.value)"
                      [disabled]="loading">
                Salvar
              </button>
              <button class="k-btn k-btn-red"
                      (click)="remover(t.id)"
                      [disabled]="loading">
                Excluir
              </button>
            </td>
          </tr>

          <tr *ngIf="!Terceiros?.length">
            <td colspan="3" class="text-center muted py-3">Nenhum terceiro cadastrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
  `,
  styles: [`
   :host{
  display: block;
  min-height: 100vh; /* ✅ ERA 100% – AGORA 100vh */
  background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
}

  .k-btn {
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s ease, color .2s ease, box-shadow .2s ease, border .2s ease;
}

/* BOTÃO RECARREGAR - PADRÃO BRANCO */
.k-btn-reload {
  background: #ffffff !important;
  color: #000000 !important;
  border: 1.5px solid #e0e0e0 !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* HOVER */
.k-btn-reload:hover {
  background: #f2f2f2 !important;
  color: #000000 !important;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

/* DESATIVADO */
.k-btn-reload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}


  `]
})
export class TerceirosComponent {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(TerceirosService);

  Terceiros: Terceiro[] = [];
  loading = false;
  error = '';

  form = this.fb.group({
    razaoSocial: ['', [Validators.required]],
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true; this.error = '';
    this.api.listar().subscribe({
      next: (data) => { this.Terceiros = data; this.loading = false; },
      error: () => { this.error = 'Falha ao carregar'; this.loading = false; }
    });
  }

  criar() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    this.api.criar(this.form.value).subscribe({
      next: () => { this.form.reset(); this.carregar(); },
      error: () => { this.error = 'Falha ao criar'; this.loading = false; }
    });
  }

  atualizar(id: number, razaoSocial: string) {
    this.loading = true; this.error = '';
    this.api.atualizar(id, { razaoSocial }).subscribe({
      next: () => { this.carregar(); },
      error: () => { this.error = 'Falha ao atualizar'; this.loading = false; }
    });
  }

  remover(id: number) {
    this.loading = true; this.error = '';
    this.api.remover(id).subscribe({
      next: () => { this.carregar(); },
      error: () => { this.error = 'Falha ao excluir'; this.loading = false; }
    });
  }
}
