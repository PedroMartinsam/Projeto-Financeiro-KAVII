import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NgIf],
  template: `
  <nav class="k-nav">
    <div class="container k-nav__inner">
      <a class="k-brand" routerLink="/home" aria-label="Ir para Home">KAVII</a>

      <button class="k-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Abrir menu">
        ☰
      </button>

      <div id="mainNav" class="k-collapse">
        <ul class="k-menu" *ngIf="auth.isLoggedIn()">
          <li><a class="k-link" routerLink="/home" routerLinkActive="is-active">Home</a></li>
          <li><a class="k-link" routerLink="/extrato" routerLinkActive="is-active">Extrato</a></li>
        </ul>

        <div class="k-actions">
          <button *ngIf="auth.isLoggedIn()" class="k-btn k-btn-ghost" (click)="auth.logout()">Sair</button>
          <a *ngIf="!auth.isLoggedIn()" class="k-btn k-btn-ghost" routerLink="/login">Login</a>
        </div>
      </div>
    </div>
  </nav>

  <router-outlet></router-outlet>
  `,
  styles: [`

    /* ===== NAVBAR ===== */
.k-nav{
  position: sticky;
  top: 0;
  z-index: 1030;

  background: #ffffff; /* FUNDO BRANCO */
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
  border-bottom: 1px solid rgba(0,0,0,.08);
}

  /* ===== Roxo Chamativo (Nubank-like) ===== */
  :root{
    --k-purple:#8A05BE;    /* primário vibrante */
    --k-purple-2:#B517FF;  /* brilho/gradiente */
    --k-purple-3:#E6D5FF;  /* detalhes claros */
    --k-text-dark:#0b1220;
    --k-text-light:#ffffff;
    --k-border: rgba(255,255,255,.22);
    --k-shadow: 0 10px 30px rgba(181,23,255,.18);
  }

  
  .k-nav__inner{
    display:flex; align-items:center; gap:12px; min-height:64px;
    justify-content:space-between;
  }

  /* Marca */
  .k-brand{
    font-weight:900; letter-spacing:.6px; font-size: clamp(18px, 2.2vw, 22px);
    padding:8px 10px; border-radius:12px;
    color: var(--k-text-dark); text-decoration:none;
    background: rgba(255,255,255,.85);
    border: 1px solid rgba(255,255,255,.6);
    box-shadow: inset 0 0 8px rgba(255,255,255,.28);
  }

  /* Toggler (mobile) */
  .k-toggle{
    display:none; border:1px solid rgba(255,255,255,.5);
    background: rgba(255,255,255,.2);
    color:#000; border-radius:10px; padding:6px 10px; cursor:pointer;
  }

  /* Área colapsável */
  .k-collapse{
    display:flex; align-items:center; gap:16px;
  }

  /* Menu */
  .k-menu{
    display:flex; align-items:center; gap:6px; margin:0; padding:0; list-style:none;
  }
  .k-link{
    display:inline-block; text-decoration:none;
    padding:10px 12px; border-radius:10px; font-weight:800;
    color: var(--k-text-dark);  /* texto preto (pedido) */
    border:1px solid transparent;
    background: rgba(255,255,255,.75);
    transition: transform .08s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
  }
  .k-link:hover{
    transform: translateY(-1px);
    background: rgba(255,255,255,.95);
    border-color: rgba(255,255,255,.9);
  }
  .k-link.is-active{
    background: #fff;
    border-color: var(--k-purple-3);
    box-shadow: 0 6px 16px rgba(0,0,0,.08), inset 0 0 0 2px rgba(138,5,190,.10);
  }

  /* Ações (login/sair) em estilo fantasma claro com texto preto */
  .k-actions{ display:flex; align-items:center; gap:8px; }
  .k-btn{
    border:1px solid rgba(255,255,255,.65);
    background: rgba(255,255,255,.85);
    color:#000; font-weight:800; border-radius:10px; padding:8px 12px;
    transition: transform .08s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
  }
  .k-btn:hover{
    transform: translateY(-1px);
    background:#fff; border-color:#fff;
    box-shadow: 0 8px 18px rgba(0,0,0,.10);
  }
  .k-btn-ghost{ }

  /* ===== Responsivo ===== */
  @media (max-width: 991px){
    .k-toggle{ display:inline-block; }
    .k-collapse{
      position: fixed; left:0; right:0; top:64px;
      background: linear-gradient(180deg, var(--k-purple) 0%, var(--k-purple) 100%);
      border-bottom:1px solid rgba(255,255,255,.18);
      box-shadow: 0 10px 22px rgba(0,0,0,.12);
      padding:12px 16px;
      display:flex; justify-content:space-between; align-items:center; gap:12px;
    }
    .k-menu{ gap:8px; }
    .k-link{ padding:10px 12px; }
  }
  `]
})
export class AppComponent {
  auth = inject(AuthService);
}
