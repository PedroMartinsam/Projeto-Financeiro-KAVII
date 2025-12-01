import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface IdNome { id: number; nome?: string; descricao?: string; razaoSocial?: string; }

export interface Lancamento {
  id: number;
  descricao: string;
  parcela: string;
  dataLancamentoISO: string | null;
  dataVencimentoISO: string | null;
  dataBaixaISO: string | null;
  valorDocumento: number;
  valorBaixado: number;
  tipoLancamento: string;
  situacao: string;
  conta?: { id: number; descricao?: string };
  terceiro?: { id: number; nome?: string; razaoSocial?: string };
  centroCusto?: { id: number; descricao?: string };
}

export interface LancamentoPayload {
  descricao: string;
  parcela: string;
  dataLancamentoISO: string | null;
  dataVencimentoISO: string | null;
  dataBaixaISO: string | null;
  valorDocumento: number;
  valorBaixado: number;
  tipoLancamento: string;
  situacao: string;
  contaId: number | null;
  terceiroId: number | null;
  centroCustoId: number | null;
}

@Injectable({ providedIn: 'root' })
export class LancamentosService {
  getGastosPorCentro(contaId: number | null, de: string, ate: string, usarBaixa: boolean) {
    throw new Error('Method not implemented.');
  }
  private readonly API = '/api/lancamentos';
  private readonly API_CONTAS = '/api/contas';
  private readonly API_TERCEIROS = '/api/terceiros';
  private readonly API_CENTROS = '/api/centroCustos'; // ajuste se o endpoint for outro

  constructor(private http: HttpClient) {}

  // ---------- CRUD ----------
  listar(): Observable<Lancamento[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(arr => (arr ?? []).map(x => this.fromBackend(x)))
    );
  }

  buscar(id: number): Observable<Lancamento> {
    return this.http.get<any>(`${this.API}/${id}`).pipe(
      map(x => this.fromBackend(x))
    );
  }

  criar(payload: LancamentoPayload) {
    const body = this.toBackendBody(payload);
    return this.http.post<any>(this.API, body).pipe(map(() => null));
  }

atualizar(id: number, payload: Partial<LancamentoPayload>) {
  const body = this.toBackendBody(payload);
  return this.http.put<any>(`${this.API}/${id}`, body).pipe(map(() => null));
}

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  // ---------- Combos ----------
  listarContas(): Observable<IdNome[]> {
    return this.http.get<any[]>(this.API_CONTAS).pipe(
      map(v => (v ?? []).map(x => ({
        id: Number(x.id),
        descricao: x.descricao ?? x.nome ?? x.razaoSocial ?? `#${x.id}`
      })))
    );
  }
  listarTerceiros(): Observable<IdNome[]> {
    return this.http.get<any[]>(this.API_TERCEIROS).pipe(
      map(v => (v ?? []).map(x => ({
        id: Number(x.id),
        nome: x.nome ?? x.razaoSocial ?? x.descricao ?? `#${x.id}`
      })))
    );
  }
  listarCentrosCusto(): Observable<IdNome[]> {
    return this.http.get<any[]>(this.API_CENTROS).pipe(
      map(v => (v ?? []).map(x => ({
        id: Number(x.id),
        descricao: x.descricao ?? x.nome ?? `#${x.id}`
      })))
    );
  }

  // ---------- adapters ----------
  private toCamel = (s?: string | null) => {
    if (!s) return '';
    const t = String(s).trim();
    if (!t || t.toLowerCase() === 'undefined' || t.toLowerCase() === 'null') return '';
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  };

  private normalizeTipo = (v?: string | null): string => {
  const t = (v ?? '').toString().trim().toLowerCase();
  if (!t) return '';
  if (t === '1' || t.startsWith('deb')) return 'Debito';
  if (t === '0' || t.startsWith('cre')) return 'Credito';
  // fallback: tenta camelizar
  return this.toCamel(t);
};
private normalizeSituacao = (v?: string | null): string => {
  const t = (v ?? '').toString().trim().toLowerCase();
  if (!t) return '';
  if (t.startsWith('baix') || t === '1' || t === 'paid' || t === 'settled' || t === 'closed') return 'Baixado';
  if (t.startsWith('aber') || t === '0' || t === 'open') return 'Aberto';
  return this.toCamel(t);
};

  private fromBackend = (x: any): Lancamento => {
    const contaId = x?.conta?.id ?? null;
    const ccId    = x?.centroCusto?.id ?? null;
    const terId   = x?.terceiro?.id ?? null;

    return {
      id: Number(x.id),
      descricao: x.descricao,
      parcela: x.parcela,

      // datas: dd/MM/yyyy -> ISO
      dataLancamentoISO: this.ddmmyyyyToISO(x?.dataLancamento),
      dataVencimentoISO: this.ddmmyyyyToISO(x?.dataVencimento),
      dataBaixaISO:      this.ddmmyyyyToISO(x?.dataBaixa),

      valorDocumento: Number(x?.valorDocumento ?? 0),
      valorBaixado:   Number(x?.valorBaixado ?? 0),

      // normaliza enum (garante string vazia quando faltante)
      tipoLancamento: this.normalizeTipo(x?.tipoLancamento ?? ''),
      situacao:       this.normalizeSituacao(x?.situacao ?? ''),

      conta:        contaId ? { id: Number(contaId), descricao: x?.conta?.descricao ?? x?.conta?.nome ?? x?.conta?.razaoSocial } : undefined,
      centroCusto:  ccId    ? { id: Number(ccId),   descricao: x?.centroCusto?.descricao ?? x?.centroCusto?.nome } : undefined,
      terceiro:     terId   ? { id: Number(terId),  nome: x?.terceiro?.nome ?? x?.terceiro?.razaoSocial } : undefined,
    };
  };

  private toBackendBody(p: Partial<LancamentoPayload>): any {
    const b: any = {};
    if (p.descricao !== undefined) b.descricao = p.descricao;
    if (p.parcela !== undefined) b.parcela = p.parcela;
    if (p.dataLancamentoISO !== undefined) b.dataLancamento = this.isoToDDMMYYYY(p.dataLancamentoISO);
    if (p.dataVencimentoISO !== undefined) b.dataVencimento = this.isoToDDMMYYYY(p.dataVencimentoISO);
    if (p.dataBaixaISO !== undefined) b.dataBaixa = this.isoToDDMMYYYY(p.dataBaixaISO);
    if (p.valorDocumento !== undefined) b.valorDocumento = Number(p.valorDocumento ?? 0);
    if (p.valorBaixado !== undefined) b.valorBaixado = Number(p.valorBaixado ?? 0);
    if (p.tipoLancamento !== undefined) b.tipoLancamento = this.normalizeTipo(p.tipoLancamento);
    if (p.situacao !== undefined) b.situacao = this.normalizeSituacao(p.situacao);

    if (p.contaId !== undefined)       b.conta = p.contaId ? { id: Number(p.contaId) } : null;
    if (p.terceiroId !== undefined)    b.terceiro = p.terceiroId ? { id: Number(p.terceiroId) } : null;
    if (p.centroCustoId !== undefined) b.centroCusto = p.centroCustoId ? { id: Number(p.centroCustoId) } : null;

    return b;
  }

  // ---------- datas ----------
  private ddmmyyyyToISO(d?: string | null): string | null {
    if (!d) return null;
    const t = String(d).trim();
    if (!t) return null;
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t);
    if (!m) return null;
    return `${m[3]}-${m[2]}-${m[1]}`; // yyyy-MM-dd
  }
  private isoToDDMMYYYY(d?: string | null): string | null {
    if (!d) return null;
    const s = String(d).slice(0, 10);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    return `${m[3]}/${m[2]}/${m[1]}`;
  }
}
