import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LancamentosService, Lancamento, IdNome } from '../lancamentos/lancamentos.service';
import Chart, { ChartItem, Plugin } from 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  styles: [`

    
/* ====== THEME VARS (ROXO #3C096C) ====== */
.kavii-root{
  /* Dark */
  --k-bg:#19052e;            /* fundo geral */
  --k-bg-soft:#240046;       /* superfícies */
  --k-card:#2b0752;          /* cards */
  --k-border:rgba(255,255,255,.14);
  --k-text:#f6eaff;
  --k-muted:#cfbaf0;

  /* Roxos (seu tom + acentos) */
  --k-primary:#3C096C; /* tom pedido */
  --k-accent:#9D4EDD;
  --k-accent-2:#7B2CBF;

  /* glow p/ efeitos sutis */
  --neon-center: rgba(157,78,221,.22);
  --neon-edge: rgba(123,44,191,.10);

  --k-white:#548;
  color:var(--k-text);
}
.kavii-root.light{
  /* Light */
  --k-bg:#faf6ff;
  --k-bg-soft:#ffffff;
  --k-card:#ffffff;
  --k-border:rgba(60,9,108,.14);
  --k-text:#180026;
  --k-muted:#6b4a88;

  --k-primary:#3C096C;
  --k-accent:#7B2CBF;
  --k-accent-2:#9D4EDD;

  --neon-center: rgba(157,78,221,.12);
  --neon-edge: rgba(157,78,221,.05);
}

/* layout base */
.kavii-root section{background:var(--k-bg);}
a{color:var(--k-accent);text-decoration:none}

/* HERO */
.hero{
  border-radius:18px;padding:20px;margin-bottom:16px;
  background:
    radial-gradient(800px 300px at 0% 0%, var(--neon-center), transparent 60%),
    linear-gradient(135deg, var(--k-bg-soft), var(--k-bg));
  border:1px solid var(--k-border);color:var(--k-text);
}
.hero-title{display:flex;align-items:center;gap:12px;margin:0 0 6px;font-weight:900;letter-spacing:.2px;font-size:clamp(20px,2vw,26px)}
.hero .badge{
  background:linear-gradient(135deg,var(--k-primary),var(--k-accent));
  color:#fff;border:none;font-weight:800;padding:6px 10px;border-radius:999px;font-size:.9rem
}

/* CONTAINER VIDRO */
.container-kavii{
  background:
    linear-gradient(135deg, rgba(43,7,82,.96), rgba(36,0,70,.94)) padding-box,
    radial-gradient(1200px 500px at 80% -10%, rgba(157,78,221,0.10), transparent 60%) border-box;
  border:1px solid rgba(255,255,255,.08);
  border-radius:24px;padding:24px;backdrop-filter:blur(8px);
  color: var(--k-text);
  transition: background .25s ease, color .25s ease;
}
.kavii-root.light .container-kavii{
  background:
    linear-gradient(135deg, #ffffff 0%, #f3e9ff 65%) padding-box,
    radial-gradient(1200px 500px at 80% -10%, rgba(157,78,221,0.08), transparent 60%) border-box;
  border:1px solid rgba(60,9,108,.10);
}

/* ====== ICON TILES ====== */
.apps-grid{
  display:grid; gap:14px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}
.app-tile{
  display:flex; flex-direction:column; align-items:center; gap:10px;
  padding:14px; border-radius:16px; background:transparent; border:1px dashed transparent;
  transition: transform .15s ease, border-color .15s ease;
}
.app-tile:hover,
.app-tile:focus-within{ transform: translateY(-2px); border-color: var(--k-border); }

.app-icon{
  width:100px; height:100px; border-radius:999px; overflow:hidden;
  display:grid; place-items:center;
  border:1px solid var(--k-border);
  box-shadow: 0 10px 22px rgba(0,0,0,.24) inset, 0 6px 18px rgba(0,0,0,.18);
  background:
    radial-gradient(120px 120px at 70% 30%, rgba(255,255,255,.16), transparent 55%),
    linear-gradient(160deg, #4c147d 0%, #2b0752 55%, #381066 100%);
}
.kavii-root.light .app-icon{
  box-shadow: 0 10px 22px rgba(0,0,0,.08) inset, 0 6px 18px rgba(0,0,0,.06);
  background:
    radial-gradient(120px 120px at 70% 30%, rgba(255,255,255,.75), transparent 55%),
    linear-gradient(160deg, #f3e9ff 0%, #ead8ff 60%, #e0c9ff 100%);
}
.app-img{
  width:70%; height:70%; object-fit:contain; filter:drop-shadow(0 2px 2px rgba(0,0,0,.35));
}
.kavii-root.light .app-img{ filter:none; }

.app-label{
  font-weight:900; letter-spacing:.2px; margin-top:4px;
  color:var(--k-text); text-align:center; line-height:1.1;
}
.app-open{
  display:inline-block; margin-top:2px; font-weight:800; font-size:.9rem;
  padding:6px 10px; border-radius:10px; border:1px solid var(--k-accent); color:var(--k-accent);
  background:transparent; text-decoration:none;
}
.app-open:hover{ color:#fff; background:linear-gradient(135deg,var(--k-primary),var(--k-accent)); border-color:transparent; }

/* ====== GRID DE ÁREAS ====== */
.areas-grid{
  display:grid;
  grid-template-columns:1fr;
  gap:16px;
  max-width:1200px;margin-inline:auto;margin-bottom:16px;
}
@media(min-width:992px){ .areas-grid{ grid-template-columns:repeat(3, 1fr);} }

.area{ display:flex; flex-direction:column; gap:12px; }
.area-title{
  font-weight:800; color:var(--k-text);
  font-size:clamp(16px,1.4vw,18px);
  padding-bottom:8px; border-bottom:1px solid var(--k-border); opacity:.92;
}

/* ====== TOOLBAR / CHART ====== */
.section-title{margin:0 0 16px;font-weight:800;color:var(--k-text);font-size:clamp(18px,1.6vw,20px)}
.toolbar{display:grid;gap:12px;align-items:end;grid-template-columns:1fr}
@media(min-width:992px){.toolbar{grid-template-columns:1.5fr 1fr 1fr 1.6fr auto}}
.form-label{color:var(--k-muted);font-weight:800;margin-bottom:6px}
.form-select,.form-control{background:var(--k-bg-soft);color:var(--k-text);border:1px solid var(--k-border);border-radius:12px;height:44px}
.segment{display:inline-flex;border:1px solid var(--k-border);border-radius:12px;overflow:hidden;background:var(--k-bg-soft)}
.segment button{padding:10px 14px;border:0;color:var(--k-text);background:transparent;font-weight:800;cursor:pointer}
.segment button.active{background:linear-gradient(135deg,var(--k-primary),var(--k-accent));color:#fff}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{border:1px solid var(--k-border);background:var(--k-bg-soft);color:var(--k-text);border-radius:999px;padding:6px 12px;font-weight:800;cursor:pointer}
.chip:hover{border-color:var(--k-accent)}
.theme-btn,.btn-secondary-k{border:1px solid var(--k-border);background:var(--k-bg-soft);color:var(--k-text);border-radius:12px;height:44px;padding:0 12px;font-weight:900}
.apply{height:44px;border-radius:12px;font-weight:900;letter-spacing:.2px;background:linear-gradient(135deg,var(--k-primary),var(--k-accent));border:0;color:#fff;padding:0 18px;cursor:pointer}
.apply:disabled{filter:grayscale(.4) opacity(.7);cursor:not-allowed}
.chart-wrap{position:relative;height:300px;border:1px dashed var(--k-border);border-radius:16px;display:flex;align-items:center;justify-content:center;padding:8px}
.empty{text-align:center;color:var(--k-muted);padding:24px 8px}

/* ===== FIX A1: Apenas categorias pretas no tema escuro ===== */
.kavii-root:not(.light) .area-title { color: #000 !important; }
.kavii-root:not(.light) .app-label { color: #000 !important; }
.kavii-root:not(.light) .app-open {
  color: #000 !important;
  border-color: #000 !important;
  background: #fff !important;
}
.kavii-root:not(.light) .app-open:hover {
  background: #e3d1ff !important;  /* leve lilás */
  border-color: #3C096C !important;
}
  :host {
      display: block;
      background: radial-gradient(circle at top left, #7d539aff, #2c0a31ff);
      min-height: 100vh;
      color: #ffffff;
      font-family: 'Poppins', sans-serif;
      padding: 2rem;
    }

    /* GRID DOS 3 GRUPOS */
.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  padding: 24px;
}

/* CARD DE CADA GRUPO */
.area {
  background: #eee4edff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
  transition: transform .3s ease, box-shadow .3s ease;
}

.area:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0,0,0,0.12);
}

/* TÍTULO DO GRUPO */
.area-title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #111;
  text-align: center;
}

/* GRID DAS BOLAS */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 24px;
  justify-items: center;
}

/* CADA ITEM */
.app-tile {
  text-align: center;
}

/* BOLA ROXA (SEUS ÍCONES DENTRO) */
.app-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3C096C, #5A189A, #7B2CBF);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  box-shadow: 0 8px 20px rgba(91,24,154,.35);
  transition: transform .25s ease;
}

/* HOVER 3D NA BOLA */
.app-tile:hover .app-icon {
  transform: scale(1.08) rotateX(8deg) rotateY(8deg);
}

/* TEXTO DO APP */
.app-label {
  font-weight: 700;
  margin-bottom: 6px;
  color: #000;
  font-size: 15px;
}

/* BOTÃO ABRIR */
.app-open {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 16px;
  border: 1.5px solid #000;
  color: #000;
  text-decoration: none;
  font-weight: 700;
  transition: background .2s ease, color .2s ease;
}

.app-open:hover {
  background: #000;
  color: #fff;
}
/* ===== DASHBOARD CARDS (VERSÃO PREMIUM) ===== */

.dashboard-card {
  background: linear-gradient(180deg, #1a0826, #0e0418);
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 24px;
  box-shadow: 
    0 20px 60px rgba(120, 60, 255, 0.25),
    inset 0 0 0 1px rgba(255,255,255,0.05);
  color: white;
  transition: transform .3s ease, box-shadow .3s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 30px 80px rgba(120, 60, 255, 0.35),
    inset 0 0 0 1px rgba(255,255,255,0.08);
}

.card-title {
  font-weight: 800;
  margin-bottom: 18px;
  font-size: 1.3rem;
  color: #e9ddff;
  letter-spacing: .5px;
}

/* ===== GRID DOS FILTROS ===== */

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
}

/* ===== INPUTS / SELECT ===== */

.form-label {
  font-size: .85rem;
  margin-bottom: 6px;
  color: #cdbbff;
  font-weight: 600;
}

.form-select,
.form-control {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 10px 12px;
  color: white;
  transition: .25s;
  backdrop-filter: blur(6px);
}

.form-select:focus,
.form-control:focus {
  outline: none;
  border-color: #9b6bff;
  box-shadow: 0 0 0 3px rgba(155,107,255,0.25);
}

/* ===== SEGMENTO DOCUMENTO / BAIXA ===== */

.segment {
  display: flex;
  border-radius: 999px;
  padding: 4px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
}

.segment button {
  flex: 1;
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #d5c8ff;
  font-weight: 600;
  cursor: pointer;
  transition: .25s;
}

.segment button.active {
  background: linear-gradient(135deg, #7b2cff, #b066ff);
  color: white;
  box-shadow: 0 6px 20px rgba(155,107,255,0.45);
}

/* ===== CHIPS ===== */

.chips {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.chip {
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
  font-size: .8rem;
  font-weight: 600;
  color: #e6dcff;
  cursor: pointer;
  transition: .25s;
  border: 1px solid rgba(255,255,255,0.12);
}

.chip:hover {
  background: linear-gradient(135deg, #7b2cff, #b066ff);
  color: white;
  transform: translateY(-2px);
}

/* ===== AÇÕES ===== */

.actions {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

/* BOTÃO LIMPAR */
.btn-secondary-k {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.25);
  color: white;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: .25s;
}

.btn-secondary-k:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

/* BOTÃO APLICAR */
.btn-primary-k {
  background: linear-gradient(135deg, #7b2cff, #b066ff);
  border: none;
  color: white;
  padding: 11px 22px;
  border-radius: 999px;
  font-weight: 800;
  cursor: pointer;
  transition: .25s;
  box-shadow: 0 10px 30px rgba(155,107,255,0.5);
}

.btn-primary-k:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 45px rgba(155,107,255,0.65);
}

.btn-primary-k:disabled {
  opacity: .45;
  cursor: not-allowed;
  box-shadow: none;
}

/* ===== GRÁFICO ===== */

.chart-wrap {
  position: relative;
  min-height: 340px;
  margin-top: 10px;
}

.empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #bfaeff;
  font-weight: 600;
}
/* SELECT PRINCIPAL */
.form-select {
  background: #1a102b !important;   /* fundo escuro */
  color: #fff !important;           /* texto branco */
  border: 1px solid #7c4dff;
  border-radius: 10px;
}

/* QUANDO CLICA */
.form-select:focus {
  background: #1a102b;
  color: #fff;
  border-color: #a78bfa;
  box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.3);
}

/* LISTA DE OPÇÕES (onde tá branco) */
.form-select option {
  background: #1a102b;
  color: #fff;
}

/* Quando passa o mouse nas opções */
.form-select option:hover {
  background: #7c4dff;
  color: #fff;
}


`],
  template: `
<section class="kavii-root" [class.light]="isLight">
  <div class="container py-4">

    <!-- HERO -->
<div class="hero">
  <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
    <div>
      <h1 class="hero-title">
        <span class="badge">KAVII</span>
        CARTEIRA PESSOAL
      </h1>
      <small style="color:var(--k-muted)">Dashboard inicial · visão rápida</small>
    </div>
  </div>
</div>


    <!-- ====== 3 TEMAS / COLUNAS ====== -->
    <div class="areas-grid">
      <div class="area" *ngFor="let g of navGroups">
        <div class="area-title">{{ g.title }}</div>

        <div class="apps-grid">
          <div class="app-tile" *ngFor="let card of g.items">
            <div class="app-icon" aria-hidden="true">
              <img *ngIf="card.img" [src]="card.img" [alt]="card.t" class="app-img" />
              <ng-container *ngIf="!card.img" [ngSwitch]="card.icon">
                <svg *ngSwitchCase="'lancamentos'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M7 3h7l4 4v14H7V3z" stroke="white" stroke-width="1.8" opacity=".9"/>
                  <path d="M14 3v5h5" stroke="white" stroke-width="1.8" opacity=".9"/>
                  <path d="M9 12h6M9 16h6" stroke="white" stroke-width="1.8" opacity=".9"/>
                </svg>
                <svg *ngSwitchCase="'contas'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="white" stroke-width="1.8" opacity=".95"/>
                  <path d="M16 12.5h4v3h-4a1.5 1.5 0 0 1 0-3z" fill="white" opacity=".9"/>
                </svg>
                <svg *ngSwitchCase="'bancos'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M4 9h16M5 9V18M9 9V18M15 9V18M19 9V18M3 18h18M3 9l9-5 9 5" stroke="white" stroke-width="1.8" opacity=".92"/>
                </svg>
                <svg *ngSwitchCase="'centros'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v9l6.5 6.5A9 9 0 1 1 12 3z" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <path d="M12 12h9" stroke="white" stroke-width="1.8" opacity=".92"/>
                </svg>
                <svg *ngSwitchCase="'metas'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <circle cx="12" cy="12" r="2" fill="white" opacity=".95"/>
                </svg>
                <svg *ngSwitchCase="'terceiros'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="8" r="3" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <path d="M3.5 18a5.5 5.5 0 0 1 11 0" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <circle cx="17" cy="9" r="2.4" stroke="white" stroke-width="1.6" opacity=".8"/>
                </svg>
                <svg *ngSwitchCase="'usuarios'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l6 2v5c0 4.2-2.9 8-6 9-3.1-1-6-4.8-6-9V5l6-2z" stroke="white" stroke-width="1.8" opacity=".9"/>
                  <circle cx="12" cy="10" r="2.8" stroke="white" stroke-width="1.8" opacity=".92"/>
                </svg>
                <svg *ngSwitchDefault width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.8" opacity=".9"/>
                </svg>
              </ng-container>
            </div>

            <div class="app-label">{{ card.t }}</div>
            <a class="app-open" [routerLink]="card.link" aria-label="Abrir {{card.t}}">Abrir</a>
          </div>
        </div>
      </div>
    </div>


   <!--  FILTROS --> <div class="dashboard-card filtros-card">
    <h3 class="card-title"> Filtros</h3> <div class="filtros-grid">
     <div> <label class="form-label">Conta</label> <select class="form-select"
     [ngModel]="contaId"
      (ngModelChange)="contaId = $event; aplicar()"> <option *ngFor="let c of contas"
      [ngValue]="c.id"> {{ c.descricao || c.nome || ('#'+c.id) }} </option> </select>
      </div> <div> <label class="form-label">Período — de</label> <input type="date"
      class="form-control" [(ngModel)]="de"> </div> <div> <label class="form-label">
      Período — até</label> <input type="date" class="form-control" [(ngModel)]="ate">
      </div> <div> <label class="form-label d-block">Base de valor</label> <div class="
      segment"> <button [class.active]="!usarBaixa" (click)="setBase(false)">Documento
      </button> <button [class.active]="usarBaixa" (click)="setBase(true)">Baixa</button>
       </div> <div class="chips"> <span class="chip" (click)="setPreset(30)">Últimos 30d
       </span> <span class="chip" (click)="setPreset(90)">Últimos 90d</span>   </div> </div> <div class="actions"> <button
        class="btn-secondary-k" (click)="limpar()">Limpar</button> 
        <button class="btn-primary-k" (click)="aplicar()" 
        [disabled]="!hasRequiredFilters()">Aplicar</button>
         </div> </div> <div *ngIf="erro" 
         class="alert alert-danger mt-2 mb-0">{{ erro }}</div> </div> 
         <!--  GRÁFICO --> <div class="dashboard-card grafico-card"> 
         <h3 class="card-title"> Gastos por Centro de Custo</h3>
          <div class="chart-wrap"> <canvas #gastosCentroChart></canvas>
           <div *ngIf="msgSemDados" class="empty"> <strong>Sem dados</strong>
            <small>{{ msgSemDados }}</small> </div> </div> </div>

  `,
})
export class HomeComponent {
  constructor(private api: LancamentosService) { }

  @ViewChild('gastosCentroChart') gastosCentroChart!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  isLight = false;

  navGroups = [
    {
      title: 'Gestão Financeira',
      items: [
        { icon: 'lancamentos', t: 'Lançamentos', d: 'Gerencie todas as movimentações financeiras.', link: '/lancamentos', img: '' },
        { icon: 'contas', t: 'Contas', d: 'Controle de saldos e bancos conectados.', link: '/contas', img: '' },
        { icon: 'bancos', t: 'Bancos', d: 'Vincule e gerencie instituições financeiras.', link: '/bancos', img: '' },
      ]
    },
    {
      title: 'Estrutura e Organização',
      items: [
        { icon: 'centros', t: 'Unidades Financeiras', d: 'Classifique e analise seus gastos.', link: '/centroCustos', img: '' },
        { icon: 'metas', t: 'Metas Financeiras', d: 'Acompanhe seus objetivos de forma inteligente.', link: '/metaFinanceiras', img: '' },
      ]
    },
    {
      title: 'Relacionamentos e Acesso',
      items: [
        { icon: 'terceiros', t: 'Empresas', d: 'Organize clientes e fornecedores.', link: '/terceiros', img: '' },
        { icon: 'usuarios', t: 'Usuários', d: 'Gestão de usuários e permissões.', link: '/usuarios', img: '' },
      ]
    }
  ];

  lancs: Lancamento[] = [];
  contas: IdNome[] = [];
  contaId: number | null = null;
  de = '';
  ate = '';
  usarBaixa = false;

  erro: string | null = null;
  msgSemDados = '';
  private applied = false;
  private lastTotal = 0;

  ngOnInit() {
    const saved = localStorage.getItem('kavii_theme');
    this.isLight = saved === 'light';

    this.api.listar().subscribe({
      next: (ls) => { this.lancs = ls ?? []; this.drawIfReady(); },
      error: () => { this.erro = 'Falha ao carregar lançamentos'; }
    });
    this.api.listarContas().subscribe({
      next: (v) => {
        this.contas = v ?? [];
        if (!this.contaId && this.contas.length) this.contaId = this.contas[0].id;
        this.drawIfReady();
      }
    });
  }
  ngAfterViewInit() { this.drawIfReady(); }
  ngOnDestroy() { this.chart?.destroy(); }

 

  public hasRequiredFilters(): boolean { return !!(this.contaId && this.de && this.ate); }
  aplicar() { this.applied = true; this.redesenhar(); }
  limpar() {
    this.de = ''; this.ate = ''; this.usarBaixa = false; this.applied = false;
    this.chart?.destroy(); this.chart = undefined as any;
    this.msgSemDados = 'Selecione conta, período e clique em Aplicar.';
  }
  setBase(v: boolean) { this.usarBaixa = v; this.aplicar(); }

  setPreset(days: number) {
    const end = new Date(); end.setHours(0, 0, 0, 0);
    const start = new Date(end); start.setDate(start.getDate() - days + 1);
    this.de = this.iso(start); this.ate = this.iso(end);
    this.aplicar();
  }
  setYTD() {
    const end = new Date(); end.setHours(0, 0, 0, 0);
    const start = new Date(end.getFullYear(), 0, 1);
    this.de = this.iso(start); this.ate = this.iso(end);
    this.aplicar();
  }
  setAnoAtual() {
    const year = new Date().getFullYear();
    this.de = `${year}-01-01`; this.ate = `${year}-12-31`;
    this.aplicar();
  }
  private iso(d: Date) { return d.toISOString().slice(0, 10); }

  private drawIfReady() {
    if (!this.gastosCentroChart) return;
    if (!this.lancs.length || !this.contas.length) return;
    if (!this.applied || !this.hasRequiredFilters()) {
      this.chart?.destroy(); this.chart = undefined as any;
      this.msgSemDados = 'Selecione conta, período e clique em Aplicar.';
      return;
    }
    requestAnimationFrame(() => this.redesenhar());
  }

  private refDateISO(l: Lancamento): string | null {
    const iso = this.usarBaixa ? l.dataBaixaISO : l.dataLancamentoISO;
    return iso ? iso.slice(0, 10) : null;
  }
  private inRangeISO(dateISO: string | null): boolean {
    if (!dateISO) return false;
    if (this.de && dateISO < this.de) return false;
    if (this.ate && dateISO > this.ate) return false;
    return true;
  }
  private valorDebito(l: Lancamento): number {
    const tipo = String(l.tipoLancamento ?? '').toLowerCase();
    if (tipo !== 'debito' && !tipo.startsWith('debit')) return 0;
    const v = this.usarBaixa ? (l.valorBaixado ?? 0) : (l.valorDocumento ?? 0);
    return Number(v) || 0;
  }
  private groupByCentroForConta(): Map<string, number> {
    const map = new Map<string, number>();
    const cid = this.contaId;
    for (const l of this.lancs) {
      if (cid && (l.conta?.id ?? null) !== cid) continue;
      const refDate = this.refDateISO(l);
      if (!this.inRangeISO(refDate)) continue;
      const v = this.valorDebito(l);
      if (!v) continue;
      const label = l.centroCusto?.descricao
        || (l.centroCusto?.id != null ? `#${l.centroCusto.id}` : '— Sem centro —');
      map.set(label, (map.get(label) ?? 0) + v);
    }
    return map;
  }

  private centerLabel: Plugin = {
    id: 'centerLabel',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart as any;
      if (!this.lastTotal) return;

      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 16px system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillStyle = this.isLight ? '#0b1220' : '#e6ebf5';

      const total = this.lastTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      ctx.fillText('Total', cx, cy - 12);
      ctx.font = '800 18px system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillText(total, cx, cy + 10);
      ctx.restore();
    }
  };

  private redesenhar(): void {
    if (!this.gastosCentroChart) return;
    if (!this.applied || !this.hasRequiredFilters()) {
      this.chart?.destroy();
      this.chart = undefined as any;
      this.msgSemDados = 'Selecione conta, período e clique em Aplicar.';
      return;
    }

    this.chart?.destroy();
    this.msgSemDados = '';

    const dataMap = this.groupByCentroForConta();
    const labels = [...dataMap.keys()];
    const data = [...dataMap.values()];

    if (!labels.length) {
      this.msgSemDados = 'Sem dados no período/conta selecionados.';
      return;
    }

    const total = data.reduce((s, n) => s + Math.abs(n || 0), 0);
    this.lastTotal = total;
    if (total <= 0) {
      this.msgSemDados = 'Sem valores > 0 no período/conta selecionados.';
      return;
    }

    const bg = this.makePalette(labels.length);

    this.chart = new Chart(
      this.gastosCentroChart.nativeElement.getContext('2d') as ChartItem,
      {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: bg,
            borderWidth: 2,
            borderColor: this.isLight ? '#ffffff' : '#0b1220',
            hoverOffset: 6,
            borderRadius: 8,
            spacing: 2
          }]
        },
        options: ({
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: this.isLight ? '#0b1220' : '#e6ebf5' }
            },
            tooltip: {
              callbacks: {
                label: (ctx: any) =>
                  `${ctx.label}: ${Number(ctx.parsed).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
              }
            }
          }
        } as any),
        plugins: [this.centerLabel]
      }
    );
  }

  /* ====== Paleta roxa para o gráfico ====== */
  private makePalette(n: number): string[] {
    const baseHue = 276; // próximo de #3C096C
    const spread = 16;
    const arr: string[] = [];
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const h = baseHue - spread / 2 + spread * t;
      const s = 78 - 12 * t;
      const l = this.isLight ? 58 - 16 * t : 56 - 10 * t;
      arr.push(`hsl(${h} ${s}% ${l}%)`);
    }
    return arr
  }
}
