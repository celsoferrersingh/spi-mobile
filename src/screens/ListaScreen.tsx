import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ocorrencia } from "../types";
import OcorrenciaCard from "../components/OcorrenciaCard";

type Props = {
  ocorrencias: Ocorrencia[];
  onNovoCadastro: () => void;
  onSelectOcorrencia: (ocorrencia: Ocorrencia) => void;
};

export default function ListaScreen({
  ocorrencias,
  onNovoCadastro,
  onSelectOcorrencia,
}: Props) {
  const abertas = ocorrencias.filter((o) => o.status === "ABERTA").length;
  const emAnalise = ocorrencias.filter((o) => o.status === "EM_ANALISE").length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>SPI Ocorrências</Text>
          <Text style={styles.subtitulo}>Visão Computacional Industrial</Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.badgeHeader, { backgroundColor: "#EF4444" }]}>
            <Text style={styles.badgeNum}>{abertas}</Text>
            <Text style={styles.badgeLabel}>Abertas</Text>
          </View>
          <View style={[styles.badgeHeader, { backgroundColor: "#F59E0B" }]}>
            <Text style={styles.badgeNum}>{emAnalise}</Text>
            <Text style={styles.badgeLabel}>Em Análise</Text>
          </View>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={ocorrencias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OcorrenciaCard
            ocorrencia={item}
            onPress={() => onSelectOcorrencia(item)}
          />
        )}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioIcone}>🏭</Text>
            <Text style={styles.vazioTexto}>Nenhuma ocorrência registrada</Text>
            <Text style={styles.vazioSub}>
              Toque no botão abaixo para adicionar
            </Text>
          </View>
        }
      />

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={onNovoCadastro}
        activeOpacity={0.85}
      >
        <Text style={styles.fabTexto}>＋ Nova Ocorrência</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#1E40AF",
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  subtitulo: {
    fontSize: 12,
    color: "#93C5FD",
    marginTop: 2,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badgeHeader: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  badgeNum: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  badgeLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  lista: {
    paddingTop: 10,
    paddingBottom: 110,
  },
  vazio: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  vazioIcone: {
    fontSize: 48,
    marginBottom: 12,
  },
  vazioTexto: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    textAlign: "center",
  },
  vazioSub: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 28,
    left: 20,
    right: 20,
    backgroundColor: "#1E40AF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  fabTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
