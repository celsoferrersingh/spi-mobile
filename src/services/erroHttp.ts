import axios from "axios";

import { BASE_URL } from "./api";

/**
 * SPRINT 3 - Traduz o erro do Axios para uma frase que a tela exibe.
 * Fica na camada de servicos justamente para a tela nao precisar
 * conhecer o Axios.
 */
export function mensagemDeErro(erro: unknown): string {
  if (axios.isAxiosError(erro)) {
    // Sem resposta = backend parado, porta errada ou BASE_URL errada
    if (!erro.response) {
      if (erro.code === "ECONNABORTED") {
        return `O backend demorou demais para responder (timeout).\nConfira se ele esta rodando em ${BASE_URL}.`;
      }
      return `Nao foi possivel falar com o backend em ${BASE_URL}.\nSuba a API Spring Boot e tente de novo.`;
    }

    const status = erro.response.status;
    if (status === 404) {
      return "Ocorrencia nao encontrada no backend (404).";
    }
    if (status === 400) {
      return "O backend recusou os dados enviados (400). Revise os campos.";
    }
    return `Erro ${status} ao falar com o backend.`;
  }

  if (erro instanceof Error) {
    return erro.message;
  }

  return "Erro inesperado.";
}
