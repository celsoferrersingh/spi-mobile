// Tipos alinhados com a entidade Ocorrencia do backend (Sprint 1)
//
// SPRINT 3: o JSON abaixo e exatamente o que GET /ocorrencias devolve.
// {
//   "id": 1,
//   "descricao": "Trinca superficial detectada na peca #4471",
//   "tipoDefeito": "TRINCA",
//   "localizacao": "Linha A - Estacao 3",
//   "gravidadeNivel": 4,
//   "status": "ABERTA",
//   "dataHoraDeteccao": "2026-09-18T10:30:00",
//   "imagemReferencia": "imagens/captura_4471.jpg",
//   "observacoes": "Detectado pelo sensor de camera S-03"
// }

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

// SPRINT 3: corpo do POST /ocorrencias.
// O id e gerado pelo banco, entao nao vai no corpo da requisicao.
export type NovaOcorrencia = Omit<Ocorrencia, "id">;
