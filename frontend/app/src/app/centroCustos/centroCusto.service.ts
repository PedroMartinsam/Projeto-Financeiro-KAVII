import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CentroCusto {
  id: number;
  descricao: string;
}

@Injectable({ providedIn: 'root' })
export class CentroCustosService {
  private readonly API = '/api/centroCustos';

  constructor(private http: HttpClient) {}

  listar(): Observable<CentroCusto[]> {
    return this.http.get<CentroCusto[]>(this.API);
  }

  buscar(id: number): Observable<CentroCusto> {
    return this.http.get<CentroCusto>(`${this.API}/${id}`);
  }

  criar(data: Partial<CentroCusto>): Observable<CentroCusto> {
    return this.http.post<CentroCusto>(this.API, data);
  }

  atualizar(id: number, data: Partial<CentroCusto>): Observable<CentroCusto> {
    return this.http.put<CentroCusto>(`${this.API}/${id}`, data);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}