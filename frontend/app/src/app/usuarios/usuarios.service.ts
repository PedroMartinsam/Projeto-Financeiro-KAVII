import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface definida aqui mesmo
export interface UsuarioDTO {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  personType?: string[]; // ["USER", "ADMIN"]
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private base = '/api/usuarios';

  constructor(private http: HttpClient) {}

  list(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.base);
  }

  get(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.base}/${id}`);
  }

  create(dto: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(this.base, dto);
  }

  update(id: number, dto: UsuarioDTO): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
