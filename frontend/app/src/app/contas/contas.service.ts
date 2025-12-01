import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IdNome { id: number; nome?: string; razaoSocial?: string; descricaoMeta?: string; }

export interface Conta {
  id: number;
  descricao: string;
  saldo: number;   // BigDecimal no back, number no front
  limite: number;  // BigDecimal no back, number no front
  tipoConta: string; // deve casar com o Enum do back (ex.: 'CORRENTE')
  usuario?: { id: number; nome?: string };
  banco?: { id: number; razaoSocial?: string };
  metaFinanceira?: { id: number; descricaoMeta?: string };
}

export interface ContaPayload {
  descricao: string;
  saldo: number;
  limite: number;
  tipoConta: string;
  usuarioId: number | null;
  bancoId: number | null;
  metaFinanceiraId: number | null;
}

@Injectable({ providedIn: 'root' })
export class ContasService {
  private readonly API = '/api/contas';

  // endpoints para os combos
  private readonly API_BANCOS = '/api/bancos';
  private readonly API_USUARIOS = '/api/usuarios';
  private readonly API_METAS = '/api/metaFinanceiras';

  constructor(private http: HttpClient) {}

  // ----------------- CRUD Contas -----------------
  listar(): Observable<Conta[]> {
    return this.http.get<Conta[]>(this.API);
  }

  buscar(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${this.API}/${id}`);
  }

  criar(payload: ContaPayload) {
    const body = this.toBackendBody(payload);
    console.log('POST body =>', body);   // <== veja se bate com o do Postman
    return this.http.post<Conta>(this.API, body);
  }

  atualizar(id: number, payload: Partial<ContaPayload>): Observable<Conta> {
    const body = this.toBackendBody(payload);
    return this.http.put<Conta>(`${this.API}/${id}`, body);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  // ----------------- Combos -----------------
  listarBancos(): Observable<IdNome[]> {
    return this.http.get<IdNome[]>(this.API_BANCOS);
  }

  listarUsuarios(): Observable<IdNome[]> {
    return this.http.get<IdNome[]>(this.API_USUARIOS);
  }

  listarMetas(): Observable<IdNome[]> {
    return this.http.get<IdNome[]>(this.API_METAS);
  }

  private normalizeTipoConta = (v?: string|null) => {
    const t = (v ?? '').toString().trim().toUpperCase();
    return t;
  };

  private toBackendBody(p: Partial<ContaPayload>): any {
    const body: any = {};
    if (p.descricao !== undefined) body.descricao = p.descricao;
    if (p.saldo !== undefined) body.saldo = Number(p.saldo ?? 0);
    if (p.limite !== undefined) body.limite = Number(p.limite ?? 0);
    if (p.tipoConta !== undefined) body.tipoConta = this.normalizeTipoConta(p.tipoConta);

    if (p.usuarioId !== undefined) {
      body.usuario = p.usuarioId ? { id: p.usuarioId } : null;
    }
    if (p.bancoId !== undefined) {
      body.banco = p.bancoId ? { id: p.bancoId } : null;
    }
    if (p.metaFinanceiraId !== undefined) {
      body.metaFinanceira = p.metaFinanceiraId ? { id: p.metaFinanceiraId } : null;
    }

    return body;
  }
}
