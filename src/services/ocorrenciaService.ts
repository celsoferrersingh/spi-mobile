import api from "./api";
import type {
  NovaOcorrencia,
  Ocorrencia,
  StatusOcorrencia,
} from "../types";

/**
 * SPRINT 3 - Camada de servicos da entidade Ocorrencia.
 * Este e o unico arquivo do app que conhece o caminho do recurso na API.
 */

const RECURSO = "/ocorrencias";

/** GET /ocorrencias */
export async function listar(): Promise<Ocorrencia[]> {
  const resposta = await api.get<Ocorrencia[]>(RECURSO);
  return resposta.data;
}

/** GET /ocorrencias/status/{status} */
export async function listarPorStatus(
  status: StatusOcorrencia
): Promise<Ocorrencia[]> {
  const resposta = await api.get<Ocorrencia[]>(`${RECURSO}/status/${status}`);
  return resposta.data;
}

/** GET /ocorrencias/{id} */
export async function buscarPorId(id: number): Promise<Ocorrencia> {
  const resposta = await api.get<Ocorrencia>(`${RECURSO}/${id}`);
  return resposta.data;
}

/** POST /ocorrencias */
export async function criar(nova: NovaOcorrencia): Promise<Ocorrencia> {
  const resposta = await api.post<Ocorrencia>(RECURSO, nova);
  return resposta.data;
}

/** PUT /ocorrencias/{id} - opcional na sprint */
export async function atualizar(
  id: number,
  dados: NovaOcorrencia
): Promise<Ocorrencia> {
  const resposta = await api.put<Ocorrencia>(`${RECURSO}/${id}`, dados);
  return resposta.data;
}

/** DELETE /ocorrencias/{id} - opcional na sprint */
export async function remover(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}

export default {
  listar,
  listarPorStatus,
  buscarPorId,
  criar,
  atualizar,
  remover,
};
