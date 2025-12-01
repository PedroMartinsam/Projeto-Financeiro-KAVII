import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Terceiro {
  id: number;
  razaoSocial: string;
}

@Injectable({ providedIn: 'root' })
export class TerceirosService {
  private readonly API = '/api/terceiros';

  constructor(private http: HttpClient) {}

  listar(): Observable<Terceiro[]> {
    return this.http.get<Terceiro[]>(this.API);
  }

  buscar(id: number): Observable<Terceiro> {
    return this.http.get<Terceiro>(`${this.API}/${id}`);
  }

  criar(data: Partial<Terceiro>): Observable<Terceiro> {
    return this.http.post<Terceiro>(this.API, data);
  }

  atualizar(id: number, data: Partial<Terceiro>): Observable<Terceiro> {
    return this.http.put<Terceiro>(`${this.API}/${id}`, data);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
