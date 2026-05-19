// Tipos alinhados com a entidade Ocorrencia do backend (Sprint 1)

export type TipoDefeito =
  | "TRINCA"
  | "CORROSAO"
  | "DEFEITO_DIMENSIONAL"
  | "CONTAMINACAO"
  | "OUTRO";

export type StatusOcorrencia = "ABERTA" | "EM_ANALISE" | "RESOLVIDA";

export type Ocorrencia = {
  id: number;
  descricao: string;
  tipoDefeito: TipoDefeito;
  localizacao: string;
  gravidadeNivel: number; // 1 (baixo) a 5 (crítico)
  status: StatusOcorrencia;
  dataHoraDeteccao: string; // ISO 8601
  imagemReferencia?: string;
  observacoes?: string;
};
