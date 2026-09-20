import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ocorrencia } from "../types";
import OcorrenciaCard from "../components/OcorrenciaCard";
import { listar, listarPorStatus } from "../services/ocorrenciaService";
import { mensagemDeErro } from "../services/erroHttp";
import { BASE_URL } from "../services/api";

type Props = {
  /** Muda quando o usuario volta do cadastro/detalhe, forcando um GET novo */
  chaveRecarga: number;
  onNovoCadastro: () => void;
  onSelectOcorrencia: (id: number) => void;
};

export default function ListaScreen({
  chaveRecarga,
  onNovoCadastro,
  onSelectOcorrencia,
}: Props) {
  // SPRINT 3: os dados vem do backend, nao mais do mockData.ts
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [abertas, setAbertas] = useState(0);
  const [emAnalise, setEmAnalise] = useState(0);

  // Estados da tela: carregando, erro e sucesso
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /**
   * Tres chamadas ao backend de uma vez: a lista completa, as abertas e as
   * em analise. Promise.all dispara as tres em paralelo e so segue quando
   * todas terminam.
   */
  async function carregar(modo: "inicial" | "refresh") {
    if (modo === "inicial") {
      setCarregando(true);
    } else {
      setAtualizando(true);
    }
    setErro(null);

    try {
      const [todas, listaAbertas, listaEmAnalise] = await Promise.all([
        listar(),
        listarPorStatus("ABERTA"),
        listarPorStatus("EM_ANALISE"),
      ]);
      setOcorrencias(todas);
      setAbertas(listaAbertas.length);
      setEmAnalise(listaEmAnalise.length);
    } catch (e) {
      setErro(mensagemDeErro(e));
      setOcorrencias([]);
      setAbertas(0);
      setEmAnalise(0);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  // Primeira carga da tela e recarga ao voltar do cadastro/detalhe
  useEffect(() => {
    carregar("inicial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveRecarga]);

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

      {/* Estado: CARREGANDO */}
      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.centroTexto}>Buscando ocorrências em {BASE_URL}</Text>
        </View>
      ) : erro ? (
        /* Estado: ERRO (backend fora do ar) */
        <View style={styles.centro}>
          <Text style={styles.erroIcone}>⚠️</Text>
          <Text style={styles.erroTitulo}>Não consegui carregar</Text>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity
            style={styles.tentarBtn}
            onPress={() => carregar("inicial")}
            activeOpacity={0.85}
          >
            <Text style={styles.tentarTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Estado: SUCESSO */
        <FlatList
          data={ocorrencias}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OcorrenciaCard
              ocorrencia={item}
              onPress={() => onSelectOcorrencia(item.id)}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => carregar("refresh")}
              tintColor="#1E40AF"
            />
          }
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
      )}

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
    flexGrow: 1,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 90,
  },
  centroTexto: {
    marginTop: 14,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  erroIcone: {
    fontSize: 40,
    marginBottom: 10,
  },
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
  tentarTexto: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
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
