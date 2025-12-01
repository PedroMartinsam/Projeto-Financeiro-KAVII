import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Banco {
  id: number;
  razaoSocial: string;
}

@Injectable({ providedIn: 'root' })
export class BancosService {
  private readonly API = '/api/bancos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Banco[]> {
    return this.http.get<Banco[]>(this.API);
  }

  buscar(id: number): Observable<Banco> {
    return this.http.get<Banco>(`${this.API}/${id}`);
  }

  criar(data: Partial<Banco>): Observable<Banco> {
    return this.http.post<Banco>(this.API, data);
  }

  atualizar(id: number, data: Partial<Banco>): Observable<Banco> {
    return this.http.put<Banco>(`${this.API}/${id}`, data);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
