import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { UsuariosService, UsuarioDTO } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styles: [`
     :host{
  display: block;
  min-height: 100vh; /* ✅ ERA 100% – AGORA 100vh */
  background: radial-gradient(circle at top left, #ebe2f1ff, #2c0a31ff);
}

.k-btn {
  padding: .55rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all .2s ease;
}

.k-btn-reload {
  background-color: #ffffff !important;
  color: #000000 !important;
  border: 1.5px solid #d1d5db !important;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all .2s ease;
}

/* Hover */
.k-btn-reload:hover {
  background-color: #f3f4f6 !important;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  transform: translateY(-1px);
}

/* Clique */
.k-btn-reload:active {
  transform: scale(0.97);
}

/* Desativado */
.k-btn-reload:disabled {
  background-color: #e5e7eb !important;
  color: #6b7280 !important;
  box-shadow: none;
  cursor: not-allowed;
}


  `]
})
export class UsuariosComponent {
  private fb = inject(NonNullableFormBuilder); // <-- removi o "X" que estava aqui
  private api = inject(UsuariosService);

  usuarios: UsuarioDTO[] = [];
  loading = false;
  error = '';

  form = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    personType: this.fb.control<string[]>(['USER'])
  });

  ngOnInit() { this.carregar(); }

  private getErrorMessage(err: any, fallback: string) {
  return err?.error?.message ||
         err?.error?.error ||
         err?.message ||
         fallback;
}


 carregar() {
  this.loading = true;
  this.error = '';

  this.api.list().subscribe({
    next: (data) => {
      this.usuarios = data ?? [];
      this.loading = false;
    },
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao carregar');
      this.error = msg;
      this.loading = false;
    }
  });
}

criar() {
  if (this.form.invalid) return;

  this.loading = true;
  this.error = '';

  const dto: UsuarioDTO = {
    nome: this.form.value.nome?.trim() || '',
    email: this.form.value.email?.trim() || '',
    senha: (this.form.value.senha || '').trim() || undefined,
    personType: (this.form.value.personType && this.form.value.personType.length)
      ? this.form.value.personType
      : ['USER']
  };

  this.api.create(dto).subscribe({
    next: () => {
      this.form.reset({ personType: ['USER'] });
      this.carregar();
    },
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao criar');
      this.error = msg;
      this.loading = false;
    }
  });
}


/** Handler de botão */
onSalvar(u: UsuarioDTO, nome: string, email: string, senha: string, isAdmin: boolean) {
  const id = u.id ?? 0;
  if (!id) return;

  const dto: UsuarioDTO = {
    id,
    nome: (nome || '').trim(),
    email: (email || '').trim(),
    personType: isAdmin ? ['USER', 'ADMIN'] : ['USER'],
    ...(senha && senha.trim() ? { senha: senha.trim() } : {})
  };

  this.atualizar(id, dto);
}

atualizar(id: number, dto: UsuarioDTO) {
  this.loading = true;
  this.error = '';

  this.api.update(id, dto).subscribe({
    next: () => this.carregar(),
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao atualizar');
      this.error = msg;
      this.loading = false;
    }
  });
}

remover(id?: number) {
  const safeId = id ?? 0;
  if (!safeId) return;

  this.loading = true;
  this.error = '';

  this.api.remove(safeId).subscribe({
    next: () => this.carregar(),
    error: (err) => {
      const msg = this.getErrorMessage(err, 'Falha ao excluir');
      this.error = msg;
      this.loading = false;
    }
  });
}

}
