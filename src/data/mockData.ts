// Dados mockados simulando respostas da API do backend (Sprint 1)
// Futuramente serão substituídos por chamadas HTTP reais

import { Ocorrencia } from "../types";

export const mockOcorrencias: Ocorrencia[] = [
  {
    id: 1,
    descricao: "Trinca superficial detectada na peça #4471",
    tipoDefeito: "TRINCA",
    localizacao: "Linha A - Estação 3",
    gravidadeNivel: 4,
    status: "ABERTA",
    dataHoraDeteccao: "2026-05-12T10:30:00",
    imagemReferencia: "imagens/captura_4471.jpg",
    observacoes: "Detectado pelo sensor de câmera S-03",
  },
  {
    id: 2,
    descricao: "Corrosão na tubulação principal da linha B",
    tipoDefeito: "CORROSAO",
    localizacao: "Linha B - Estação 1",
    gravidadeNivel: 3,
    status: "EM_ANALISE",
    dataHoraDeteccao: "2026-05-11T14:15:00",
    observacoes: "Área afetada de aproximadamente 15cm²",
  },
  {
    id: 3,
    descricao: "Defeito dimensional na peça #3892 fora do tolerável",
    tipoDefeito: "DEFEITO_DIMENSIONAL",
    localizacao: "Linha C - Estação 2",
    gravidadeNivel: 2,
    status: "RESOLVIDA",
    dataHoraDeteccao: "2026-05-10T09:00:00",
    observacoes: "Peça descartada e processo ajustado",
  },
  {
    id: 4,
    descricao: "Contaminação detectada no setor de embalagem",
    tipoDefeito: "CONTAMINACAO",
    localizacao: "Linha D - Estação 5",
    gravidadeNivel: 5,
    status: "ABERTA",
    dataHoraDeteccao: "2026-05-12T16:45:00",
    observacoes: "Linha interrompida para inspeção imediata",
  },
];
