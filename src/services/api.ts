import axios from "axios";
import { Platform } from "react-native";

/**
 * SPRINT 3 - Instancia unica do Axios usada por todos os servicos.
 *
 * Nenhuma tela importa axios nem monta URL: as telas falam so com
 * ocorrenciaService.ts, e so este arquivo conhece o endereco do backend.
 */

const PORTA = 8080;

/**
 * >>> CELULAR FISICO (Expo Go no telefone) <<<
 * Preencha com o IP da sua maquina na rede local e salve o arquivo.
 *   Windows : ipconfig      -> "Endereco IPv4" do adaptador Wi-Fi
 *   macOS   : ipconfig getifaddr en0
 *   Linux   : hostname -I
 * Exemplo: const IP_DA_MAQUINA = "192.168.0.12";
 *
 * Deixe string vazia para web, iOS Simulator e emulador Android.
 */
const IP_DA_MAQUINA = "";

function definirBaseUrl(): string {
  // 1) Celular fisico na mesma rede Wi-Fi -> IP da maquina
  if (IP_DA_MAQUINA.trim().length > 0) {
    return `http://${IP_DA_MAQUINA.trim()}:${PORTA}`;
  }

  // 2) Emulador Android -> 10.0.2.2 e o "localhost do PC" visto de dentro do emulador
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${PORTA}`;
  }

  // 3) Web e iOS Simulator -> localhost
  return `http://localhost:${PORTA}`;
}

export const BASE_URL = definirBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
