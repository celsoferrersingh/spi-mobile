import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ocorrencia } from "../types";

type Props = {
  ocorrencia: Ocorrencia;
  onPress: () => void;
};

const statusConfig: Record<string, { cor: string; label: string }> = {
  ABERTA: { cor: "#EF4444", label: "Aberta" },
  EM_ANALISE: { cor: "#F59E0B", label: "Em Análise" },
  RESOLVIDA: { cor: "#10B981", label: "Resolvida" },
};

function getGravidadeCor(nivel: number): string {
  if (nivel <= 2) return "#10B981";
  if (nivel === 3) return "#F59E0B";
  return "#EF4444";
}

export default function OcorrenciaCard({ ocorrencia, onPress }: Props) {
  // Fallback caso o backend traga um status fora da lista conhecida
  const status = statusConfig[ocorrencia.status] ?? {
    cor: "#6B7280",
    label: ocorrencia.status,
  };
  const gravidadeCor = getGravidadeCor(ocorrencia.gravidadeNivel);
  const data = new Date(ocorrencia.dataHoraDeteccao).toLocaleDateString("pt-BR");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: status.cor }]}>
          <Text style={styles.badgeText}>{status.label}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: gravidadeCor }]}>
          <Text style={styles.badgeText}>Nível {ocorrencia.gravidadeNivel}</Text>
        </View>
      </View>

      <Text style={styles.tipo}>
        {ocorrencia.tipoDefeito.replace(/_/g, " ")}
      </Text>
      <Text style={styles.descricao} numberOfLines={2}>
        {ocorrencia.descricao}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.local} numberOfLines={1}>
          📍 {ocorrencia.localizacao}
        </Text>
        <Text style={styles.data}>{data}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  tipo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  descricao: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 12,
    lineHeight: 21,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  local: {
    fontSize: 12,
    color: "#9CA3AF",
    flex: 1,
    marginRight: 8,
  },
  data: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
