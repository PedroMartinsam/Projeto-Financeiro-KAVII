import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CentroCustosService, CentroCusto } from './centroCusto.service';

// Gráfico (opcional — só desenha se existir data de criação)
import Chart from 'chart.js/auto';

type CentroCard = CentroCusto & {
  editando?: boolean;
  _flash?: boolean;
  // Se o backend já tiver, use "createdAt" (ISO) ou "dataCriacao" (dd/MM/yyyy)
  createdAt?: string;
  dataCriacao?: string;
};

@Component({
  selector: 'app-centroCustos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
<section class="container py-4">
  <!-- Header -->
  <div class="d-flex align-items-center justify-content-between mb-4">
    <div>
      <h1 class="h3 mb-0">Unidades Financeiras</h1>
      <p class="muted small">Gerencie, padronize e visualize seus centros com estilo.</p>
    </div>
<button class="k-btn k-btn-reload" (click)="carregar()" [disabled]="loading()">
  <span *ngIf="loading()" class="spinner-border spinner-border-sm me-2"></span>
  Recarregar
</button>
  </div>

  <!-- Criar novo -->
  <div class="create-bar shadow-sm p-3 mb-4">
    <form [formGroup]="form" (ngSubmit)="criar()" class="create-row">
      <input formControlName="descricao" class="form-control form-control-lg"
             placeholder="Ex.: Mercado, Transporte, Saúde..." />
      <button type="submit" class="btn-primary-k"
              [disabled]="form.invalid || loading()">Criar</button>
    </form>
    <div *ngIf="error()" class="alert alert-danger mt-3 mb-0 text-center">{{ error() }}</div>
  </div>

  <!-- Cards -->
  <div *ngIf="!centroCustos().length && !loading()" class="alert alert-light text-center p-4 border">
    Nenhum centro cadastrado.
  </div>

  <div class="card-grid">
    <div
      class="centro-card"
      *ngFor="let c of centroCustos(); let i = index"
      [style.--cor]="gerarCor(c.descricao)"
      [style.animationDelay]="(i*40)+'ms'"
      (mousemove)="tilt($event)"
      (mouseleave)="untlt($event)"
      [class.flash-save]="c._flash">

      <div class="card-top">
        <div class="icon" [style.background]="gradiente(c.descricao)">{{ icon(c.descricao) }}</div>
        <input [(ngModel)]="c.descricao"
               class="form-control-plaintext editable"
               [readonly]="!c.editando" />
      </div>

      <div class="actions">
        <button *ngIf="!c.editando"
                class="btn-mini outline"
                (click)="c.editando = true">Editar</button>

        <button *ngIf="c.editando"
                class="btn-mini success"
                (click)="salvar(c)">Salvar</button>

        <button *ngIf="c.editando"
                class="btn-mini"
                (click)="c.editando = false; carregar();">Cancelar</button>

        <button class="btn-mini danger"
                (click)="remover(c.id)"
                [disabled]="loading()">Excluir</button>
      </div>
    </div>
  </div>

  <!-- Mini dashboard -->
  <div class="mini-dash" *ngIf="hasDates">
    <h3 class="dash-title">Evolução (criados por mês)</h3>
    <div class="dash-wrap">
      <canvas #dash></canvas>
    </div>
  </div>
</section>
  `,
  styles: [`
       :host {
    display: block;
    min-height: 100vh;
    background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
  }

  /* Botões padrão */
  .k-btn {
    border-radius: 12px;
    padding: 12px 18px;
    font-weight: 700;
    cursor: pointer;
    transition: background .2s ease, color .2s ease, box-shadow .2s ease, border .2s ease;
  }

  .k-btn-reload {
    background: #ffffff !important;
    color: #000000 !important;
    border: 1.5px solid #e0e0e0 !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .k-btn-reload:hover {
    background: #f2f2f2 !important;
    color: #000000 !important;
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  }

  .k-btn-reload:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Títulos */
  h1 { font-weight: 800; color: #2b1d59; }
  .muted { color: #fff; }

  /* Botão Criar */
  .btn-primary-k {
    height: 52px; min-width: 140px;
    border: 0; border-radius: 14px;
    padding: 0 20px; font-weight: 800; letter-spacing: .2px;
    color: #fff;
    background: linear-gradient(135deg, #3C096C 0%, #5A189A 60%, #7B2CBF 100%);
    box-shadow: 0 10px 24px rgba(91,24,154,.28), inset 0 1px 0 rgba(255,255,255,.12);
    transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
  }

  .btn-primary-k:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
    box-shadow: 0 14px 30px rgba(91,24,154,.34);
  }

  .btn-primary-k:active {
    transform: translateY(0) scale(.99);
  }

  .btn-ghost {
    border: 1.5px solid #5A189A;
    color: #fff;
    background: transparent;
    padding: 8px 14px;
    border-radius: 12px;
    font-weight: 700;
    transition: background .15s, color .15s, box-shadow .15s;
  }

  .btn-ghost:hover {
    background: rgba(122,44,191,.06);
    box-shadow: 0 6px 18px rgba(122,44,191,.12);
  }

  /* Barra de criação */
  .create-bar {
    background: #35086fff;
    border-radius: 16px;
    border: 1px solid rgba(100,0,200,.1);
  }

  .create-row {
    display: grid;
    grid-template-columns: 1fr 160px;
    gap: 12px;
    align-items: center;
  }

  @media(max-width:640px) {
    .create-row { grid-template-columns: 1fr; }
    .btn-primary-k { width: 100%; }
  }

  /* Grid de cards */
  .card-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  /* Card */
  .centro-card {
    --glow: rgba(123,44,191,.25);
    background: linear-gradient(145deg, #2b0066, #140033);
    border: 1px solid rgba(100,0,200,.15);
    border-radius: 18px;
    padding: 14px;
    box-shadow: 0 10px 24px rgba(0,0,0,.06), 0 0 0 0 var(--glow);
    transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
    animation: cardIn .28s ease both;
    will-change: transform;
    transform-style: preserve-3d;
    color: #fff;
  }

  .centro-card:hover {
    box-shadow: 0 16px 36px rgba(0,0,0,.12), 0 0 32px -10px var(--glow);
    border-color: rgba(100,0,200,.28);
  }

  .card-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    color: #fff;
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-size: 22px;
    color: #fff;
    box-shadow: 0 8px 20px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.18);
    user-select: none;
  }

  .editable {
    font-weight: 800;
    font-size: 1.06rem;
    color: #fff !important;
    background: transparent;
    border: none;
    border-radius: 10px;
  }

  .editable::placeholder {
    color: #d9c9ff;
  }

  .editable:not([readonly]) {
    background: rgba(122,44,191,.10);
    padding: 6px 8px;
    outline: none;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }

  .btn-mini {
    border: 0;
    border-radius: 999px;
    padding: 8px 12px;
    font-weight: 800;
    background: rgba(255,255,255,.10);
    color: #fff;
    border: 1px solid rgba(255,255,255,.18);
  }

  .btn-mini.outline {
  background: transparent;
  border: 1.5px solid #c9afff;
  color: #c9afff;
}


 .btn-mini.success {
  background: linear-gradient(180deg, #22c55e, #16a34a);
  color: #fff;
  border: 1px solid rgba(255,255,255,.18);
}

  .btn-mini.danger {
  background: linear-gradient(180deg, #ef4444, #b91c1c);
  color: #fff;
  border: 1px solid rgba(255,255,255,.18);
}


  /* Flash verde ao salvar */
  .flash-save { animation: flash .9s ease both; }

  /* Mini dashboard */
  .mini-dash { margin-top: 24px; }
  .dash-title {
    font-weight: 800;
    font-size: 1.05rem;
    color: #2b1d59;
    margin-bottom: 8px;
  }

  .dash-wrap {
    border-radius: 16px;
    border: 1px dashed rgba(100,0,200,.18);
    background: linear-gradient(135deg, #ffffff 0%, #faf7ff 100%);
    padding: 14px;
  }

  /* Animations */
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(8px) scale(.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes flash {
    0%   { box-shadow: 0 0 0 0 rgba(34,197,94,.0); }
    30%  { box-shadow: 0 0 0 6px rgba(34,197,94,.35); }
    100% { box-shadow: 0 0 0 0 rgba(34,197,94,.0); }
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    h1 { color: #eef3ff; }
    .muted { color: #aab3c8; }
    .create-bar { background: linear-gradient(145deg, #2b0066, #140033);
  border-radius: 16px;
  border: 1px solid rgba(200,160,255,.18); }
    .centro-card { background: #100a1a; border-color: rgba(200,160,255,.14); }
    .editable { color: #0446ddff; }
    .dash-wrap {
      background: linear-gradient(135deg, #0e0a16 0%, #130d1d 100%);
      border-color: rgba(200,160,255,.18);
    }
  .btn-ghost { border-color: #c9afff; color: #c9afff; }
    .btn-ghost:hover { background: rgba(201,175,255,.08); }
  }
  `]
})
export class CentroCustosComponent {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(CentroCustosService);

  centroCustos = signal<CentroCard[]>([]);
  loading = signal(false);
  error = signal('');

  @ViewChild('dash') dashRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  hasDates = false;

  form = this.fb.group({ descricao: ['', [Validators.required]] });

  ngOnInit(){ this.carregar(); }
  ngOnDestroy(){ this.chart?.destroy(); }

  private getErrorMessage(err: any, fallback: string) {
  return err?.error?.message ||
         err?.error?.error ||
         err?.message ||
         fallback;
}


  carregar() {
  this.loading.set(true);
  this.error.set('');

  this.api.listar().subscribe({
    next: (data) => {
      const items = (data || []).map(c => ({ ...c, editando: false }));
      this.centroCustos.set(items);
      this.loading.set(false);

      setTimeout(() => this.mountDashboard(), 0);
    },
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao carregar');
      this.error.set(msg);
      this.loading.set(false);
    }
  });
}

criar() {
  if (this.form.invalid) return;

  this.loading.set(true);
  this.error.set('');

  this.api.criar(this.form.value).subscribe({
    next: () => {
      this.form.reset();
      this.carregar();
    },
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao criar');
      this.error.set(msg);
      this.loading.set(false);
    }
  });
}

salvar(c: CentroCard) {
  const desc = (c.descricao || '').trim();
  if (!desc) return;

  this.loading.set(true);

  this.api.atualizar(c.id!, { descricao: desc }).subscribe({
    next: () => {
      c.editando = false;
      c._flash = true;
      setTimeout(() => c._flash = false, 900);

      this.loading.set(false);
      this.mountDashboard();
    },
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao atualizar');
      this.error.set(msg);
      this.loading.set(false);
    }
  });
}

remover(id: number) {
  this.loading.set(true);
  this.error.set('');

  this.api.remover(id).subscribe({
    next: () => this.carregar(),
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao excluir');
      this.error.set(msg);
      this.loading.set(false);
    }
  });
}



  /* ===== Visual helpers ===== */
  gerarCor(nome:string): string{
    let hash=0; for(const ch of (nome||'')) hash = ch.charCodeAt(0) + ((hash<<5)-hash);
    const hue = Math.abs(hash)%360; return `hsl(${hue} 70% 55%)`;
  }
  gradiente(nome:string){ return `linear-gradient(135deg, ${this.gerarCor(nome)} 0%, rgba(60,9,108,.9) 100%)`; }

  icon(nome:string): string{
    const n = (nome||'').toLowerCase();
    if(/\b(mercado|super|compra|alimento|feira)\b/.test(n)) return '🛒';
    if(/\b(transporte|uber|ônibus|onibus|gas|combust|carro)\b/.test(n)) return '🚌';
    if(/\b(saúde|hospital|méd|med|consulta|farmácia|farmacia)\b/.test(n)) return '🏥';
    if(/\b(educa|curso|facul|escola|estudo)\b/.test(n)) return '🎓';
    if(/\b(aluguel|moradia|casa|luz|água|agua|condo)\b/.test(n)) return '🏠';
    if(/\b(lazer|stream|assinatura|jogo|games?)\b/.test(n)) return '🎮';
    return '📦';
  }

  /* ===== Hover 3D ===== */
  tilt(ev: MouseEvent){
    const el = ev.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width;  // 0..1
    const y = (ev.clientY - rect.top) / rect.height; // 0..1
    const rx = (0.5 - y) * 6; // rotateX
    const ry = (x - 0.5) * 6; // rotateY
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  }
  untlt(ev: MouseEvent){
    const el = ev.currentTarget as HTMLElement;
    el.style.transform = '';
  }

  /* ===== Mini dashboard ===== */
  private mountDashboard(){
    // suporta createdAt (ISO) ou dataCriacao (dd/MM/yyyy) vindos do backend
    const ds = this.centroCustos().map(c => this.parseDate(c.createdAt || c.dataCriacao || ''))
                                  .filter(Boolean) as Date[];

    this.hasDates = ds.length > 0 && !!this.dashRef;
    if(!this.hasDates){ this.chart?.destroy(); this.chart = undefined; return; }

    // agrupa por mês (últimos 6)
    const last6: { key:string, label:string, count:number }[] = [];
    const now = new Date(); now.setDate(1);
    for(let i=5;i>=0;i--){
      const d = new Date(now); d.setMonth(now.getMonth()-i);
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const lab = d.toLocaleDateString(undefined,{month:'short', year:'2-digit'});
      last6.push({ key:k, label:lab, count:0 });
    }
    for(const d of ds){
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const bucket = last6.find(b => b.key===k);
      if(bucket) bucket.count++;
    }

    const ctx = this.dashRef.nativeElement.getContext('2d')!;
    this.chart?.destroy();
    this.chart = new Chart(ctx,{
      type:'bar',
      data:{
        labels: last6.map(b=>b.label),
        datasets:[{
          data: last6.map(b=>b.count),
          borderRadius: 10,
          backgroundColor: last6.map((_,i)=>`hsl(${260+i*10} 70% 55% / .85)`),
        }]
      },
      options:{
        responsive:true,
        plugins:{ legend:{display:false} },
        scales:{
          x:{ ticks:{ color: '#2b1d59' } },
          y:{ beginAtZero:true, ticks:{ precision:0, color:'#2b1d59' } }
        }
      } as any
    });
  }

  private parseDate(s:string): Date|null{
    if(!s) return null;
    // ISO yyyy-MM-dd / yyyy-MM-ddTHH:mm:ss
    const iso = /^\d{4}-\d{2}-\d{2}/.test(s);
    if(iso){ const d = new Date(s); return isNaN(+d)?null:d; }
    // dd/MM/yyyy
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
    if(m){ return new Date(+m[3], +m[2]-1, +m[1]); }
    const d = new Date(s);
    return isNaN(+d)?null:d;
  }
}
