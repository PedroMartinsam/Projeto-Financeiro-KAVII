import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <section class="login-wrapper">

    <!-- LADO ESQUERDO -->
    <div class="login-left">
      <h1>
        Faça Login <br>
        e tenha acesso ao <br>
        <span>KAVII</span>
      </h1>

      <p>
        Sistema moderno de controle financeiro, extratos e lançamentos
        em tempo real, com total segurança.
      </p>

      <div class="decor-circle"></div>
    </div>

    <!-- LADO DIREITO -->
    <div class="login-right">
      <div class="login-card">
        <h2>LOGIN</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <label>Usuário</label>
          <input type="text" formControlName="username" placeholder="Nome cadastrado ou e-mail">

          <label>Senha</label>
          <input type="password" formControlName="password" placeholder="Digite sua senha">

          <button type="submit" [disabled]="loading || form.invalid">
            {{ loading ? 'Entrando...' : 'ENTRAR' }}
          </button>

        </form>

        <p class="erro" *ngIf="error">{{ error }}</p>
      </div>
    </div>

  </section>
  `,
  styles: [`

  * { box-sizing: border-box; }

  .login-wrapper{
  height: 93vh;        /* em vez de min-height */
  
  background: radial-gradient(circle at top, #2b054f, #0e001a);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 40px;
  gap: 40px;
  font-family: 'Segoe UI', Arial, sans-serif;
}


  /* ===== LADO ESQUERDO ===== */
  .login-left{
    color: #fff;
    position: relative;
  }

  .login-left h1{
    font-size: 44px;
    font-weight: 900;
    line-height: 1.2;
  }

  .login-left h1 span{
    color: #b517ff;
  }

  .login-left p{
    margin-top: 16px;
    font-size: 16px;
    color: #d1cce3;
    max-width: 420px;
  }

.decor-circle{
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(181,23,255,.25), transparent 40%);
  pointer-events: none;
}





  /* ===== LADO DIREITO ===== */
  .login-right{
    display: flex;
    justify-content: center;
  }

  .login-card{
    background: #1c082f;
    border-radius: 22px;
    padding: 38px 34px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 20px 60px rgba(181,23,255,.35);
    border: 1px solid rgba(181,23,255,.3);
  }

  .login-card h2{
    text-align: center;
    margin-bottom: 22px;
    color: #b517ff;
    letter-spacing: 2px;
    font-size: 20px;
  }

  label{
    display: block;
    margin-top: 14px;
    font-size: 13px;
    color: #c9bde8;
  }

  input{
    width: 100%;
    padding: 12px;
    margin-top: 6px;
    border-radius: 10px;
    border: 1px solid rgba(181,23,255,.3);
    outline: none;
    background: #2b0c49;
    color: #fff;
    transition: border .2s, box-shadow .2s;
  }

  input:focus{
    border-color: #b517ff;
    box-shadow: 0 0 0 3px rgba(181,23,255,.3);
  }

  input::placeholder{
    color: #9d91bb;
  }

  button{
    margin-top: 24px;
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(90deg, #b517ff, #7a00ff);
    color: #fff;
    font-weight: 900;
    letter-spacing: 1px;
    cursor: pointer;
    transition: transform .15s, box-shadow .15s;
  }

  button:hover{
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(181,23,255,.5);
  }

  button:disabled{
    opacity: .6;
    cursor: not-allowed;
  }

  .erro{
    margin-top: 16px;
    color: #ff6b81;
    font-size: 14px;
    text-align: center;
  }

  /* ===== RESPONSIVO ===== */
  @media(max-width: 900px){
    .login-wrapper{
      grid-template-columns: 1fr;
      padding: 30px;
      text-align: center;
    }

    .decor-circle{
      display: none;
    }
  }

  `]
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.loading = false;
        this.error =
          (err?.status === 401 || err?.status === 403)
          ? 'Usuário ou senha inválidos'
          : 'Erro ao conectar no servidor';
      }
    });
  }
}
