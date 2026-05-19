import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ocorrencia } from "../types";

type Props = {
  ocorrencia: Ocorrencia;
  onVoltar: () => void;
};

const statusConfig: Record<string, { cor: string; label: string }> = {
  ABERTA: { cor: "#EF4444", label: "Aberta" },
  EM_ANALISE: { cor: "#F59E0B", label: "Em Análise" },
  RESOLVIDA: { cor: "#10B981", label: "Resolvida" },
};

function getGravidadeInfo(nivel: number): { cor: string; label: string } {
  if (nivel <= 2) return { cor: "#10B981", label: "Baixa" };
  if (nivel === 3) return { cor: "#F59E0B", label: "Média" };
  if (nivel === 4) return { cor: "#EF4444", label: "Alta" };
  return { cor: "#7F1D1D", label: "Crítica" };
}

function InfoItem({ icone, label, valor }: { icone: string; label: string; valor: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>
        {icone} {label}
      </Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

export default function DetalheScreen({ ocorrencia, onVoltar }: Props) {
  const status = statusConfig[ocorrencia.status];
  const gravidade = getGravidadeInfo(ocorrencia.gravidadeNivel);
  const dataFormatada = new Date(ocorrencia.dataHoraDeteccao).toLocaleString("pt-BR");

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} style={styles.voltarBtn}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Detalhe</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
          <InfoItem icone="🔢" label="ID da Ocorrência" valor={`#${ocorrencia.id}`} />
          {ocorrencia.imagemReferencia ? (
            <InfoItem icone="📷" label="Imagem de Referência" valor={ocorrencia.imagemReferencia} />
          ) : null}
          {ocorrencia.observacoes ? (
            <InfoItem icone="📝" label="Observações" valor={ocorrencia.observacoes} />
          ) : null}
        </View>

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
  badgesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
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
});
