import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ocorrencia, StatusOcorrencia } from "../types";
import { buscarPorId, atualizar } from "../services/ocorrenciaService";
import { mensagemDeErro } from "../services/erroHttp";

type Props = {
  /** SPRINT 3: recebe so o id; os dados vem de GET /ocorrencias/{id} */
  id: number;
  onVoltar: () => void;
};

const statusConfig: Record<string, { cor: string; label: string }> = {
  ABERTA: { cor: "#EF4444", label: "Aberta" },
  EM_ANALISE: { cor: "#F59E0B", label: "Em Análise" },
  RESOLVIDA: { cor: "#10B981", label: "Resolvida" },
};

const proximoStatus: Record<StatusOcorrencia, StatusOcorrencia | null> = {
  ABERTA: "EM_ANALISE",
  EM_ANALISE: "RESOLVIDA",
  RESOLVIDA: null,
};

function getGravidadeInfo(nivel: number): { cor: string; label: string } {
  if (nivel <= 2) return { cor: "#10B981", label: "Baixa" };
  if (nivel === 3) return { cor: "#F59E0B", label: "Média" };
  if (nivel === 4) return { cor: "#EF4444", label: "Alta" };
  return { cor: "#7F1D1D", label: "Crítica" };
}

function InfoItem({
  icone,
  label,
  valor,
}: {
  icone: string;
  label: string;
  valor: string;
}) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>
        {icone} {label}
      </Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

export default function DetalheScreen({ id, onVoltar }: Props) {
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);

  // Estados da tela: carregando, erro e sucesso
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  /** GET /ocorrencias/{id} */
  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await buscarPorId(id);
      setOcorrencia(dados);
    } catch (e) {
      setErro(mensagemDeErro(e));
      setOcorrencia(null);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /** PUT /ocorrencias/{id} - avanca o status no fluxo (opcional na sprint) */
  async function avancarStatus() {
    if (!ocorrencia) return;
    const novo = proximoStatus[ocorrencia.status];
    if (!novo) return;

    setSalvando(true);
    setErro(null);
    try {
      const { id: _id, ...dados } = ocorrencia;
      const atualizada = await atualizar(ocorrencia.id, {
        ...dados,
        status: novo,
      });
      setOcorrencia(atualizada);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  const cabecalho = (
    <View style={styles.header}>
      <TouchableOpacity onPress={onVoltar} style={styles.voltarBtn}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>Detalhe</Text>
      <View style={{ width: 70 }} />
    </View>
  );

  // Estado: CARREGANDO
  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        {cabecalho}
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.centroTexto}>Buscando a ocorrência #{id}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Estado: ERRO
  if (!ocorrencia) {
    return (
      <SafeAreaView style={styles.container}>
        {cabecalho}
        <View style={styles.centro}>
          <Text style={styles.erroIcone}>⚠️</Text>
          <Text style={styles.erroTitulo}>Não consegui carregar</Text>
          <Text style={styles.erroTexto}>{erro ?? "Ocorrência não encontrada."}</Text>
          <TouchableOpacity
            style={styles.tentarBtn}
            onPress={carregar}
            activeOpacity={0.85}
          >
            <Text style={styles.tentarTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Estado: SUCESSO
  // Fallback caso o backend traga um status fora da lista conhecida
  const status = statusConfig[ocorrencia.status] ?? {
    cor: "#6B7280",
    label: ocorrencia.status,
  };
  const gravidade = getGravidadeInfo(ocorrencia.gravidadeNivel);
  const dataFormatada = new Date(ocorrencia.dataHoraDeteccao).toLocaleString(
    "pt-BR"
  );
  const proximo = proximoStatus[ocorrencia.status];

  return (
    <SafeAreaView style={styles.container}>
      {cabecalho}

      <ScrollView showsVerticalScrollIndicator={false}>
        {erro ? (
          <View style={styles.caixaErro}>
            <Text style={styles.textoErro}>{erro}</Text>
          </View>
        ) : null}

        {/* Card principal */}
        <View style={styles.cardPrincipal}>
          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: status.cor }]}>
              <Text style={styles.badgeTexto}>{status.label}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: gravidade.cor }]}>
              <Text style={styles.badgeTexto}>
                Gravidade {ocorrencia.gravidadeNivel}/5 — {gravidade.label}
              </Text>
            </View>
          </View>

          <Text style={styles.tipoDefeito}>
            {ocorrencia.tipoDefeito.replace(/_/g, " ")}
          </Text>
          <Text style={styles.descricao}>{ocorrencia.descricao}</Text>
        </View>

        {/* Detalhes */}
        <View style={styles.secao}>
          <InfoItem icone="📍" label="Localização" valor={ocorrencia.localizacao} />
          <InfoItem icone="🕐" label="Detectado em" valor={dataFormatada} />
          <InfoItem
            icone="🔢"
            label="ID da Ocorrência"
            valor={`#${ocorrencia.id}`}
          />
          {ocorrencia.imagemReferencia ? (
            <InfoItem
              icone="📷"
              label="Imagem de Referência"
              valor={ocorrencia.imagemReferencia}
            />
          ) : null}
          {ocorrencia.observacoes ? (
            <InfoItem icone="📝" label="Observações" valor={ocorrencia.observacoes} />
          ) : null}
        </View>

        {/* PUT: avanca o status no fluxo */}
        {proximo ? (
          <TouchableOpacity
            style={[styles.acaoBtn, salvando && styles.acaoBtnDesativado]}
            onPress={avancarStatus}
            disabled={salvando}
            activeOpacity={0.85}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.acaoTexto}>
                Mover para {statusConfig[proximo].label}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    backgroundColor: "#1E40AF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  voltarBtn: { width: 70 },
  voltarTexto: { color: "#93C5FD", fontSize: 14, fontWeight: "600" },
  titulo: { fontSize: 17, fontWeight: "700", color: "#fff" },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  centroTexto: {
    marginTop: 14,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  erroIcone: { fontSize: 40, marginBottom: 10 },
  erroTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#EF4444",
    marginBottom: 8,
  },
  erroTexto: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  tentarBtn: {
    backgroundColor: "#1E40AF",
    borderRadius: 12,
    paddingHorizontal: 26,
    paddingVertical: 13,
  },
  tentarTexto: { color: "#fff", fontSize: 15, fontWeight: "700" },
  caixaErro: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  textoErro: { color: "#991B1B", fontSize: 14, lineHeight: 20 },
  cardPrincipal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeTexto: { color: "#fff", fontSize: 12, fontWeight: "700" },
  tipoDefeito: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 25,
  },
  secao: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  infoItem: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValor: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
  acaoBtn: {
    backgroundColor: "#1E40AF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 18,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  acaoBtnDesativado: { opacity: 0.6 },
  acaoTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
