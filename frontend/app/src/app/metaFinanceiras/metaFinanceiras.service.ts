// meta-financeiras.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MetaFinanceira {
  id: number;
  descricaoMeta: string;
  valorMeta: number;   // BigDecimal no back, number no front
  dataAlvo: string;    // dd/MM/yyyy (por causa do @JsonFormat)
}

@Injectable({ providedIn: 'root' })
export class MetaFinanceirasService {
  // ajuste essa URL para a rota real do seu controller (ex.: /api/metas-financeiras)
  private readonly API = '/api/metaFinanceiras';

  constructor(private http: HttpClient) {}

  listar(): Observable<MetaFinanceira[]> {
    return this.http.get<MetaFinanceira[]>(this.API);
  }

  buscar(id: number): Observable<MetaFinanceira> {
    return this.http.get<MetaFinanceira>(`${this.API}/${id}`);
  }

  criar(body: Omit<MetaFinanceira, 'id'>): Observable<MetaFinanceira> {
    return this.http.post<MetaFinanceira>(this.API, body);
  }

  atualizar(id: number, body: Partial<MetaFinanceira>): Observable<MetaFinanceira> {
    return this.http.put<MetaFinanceira>(`${this.API}/${id}`, body);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
