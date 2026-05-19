import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ocorrencia, TipoDefeito, StatusOcorrencia } from "../types";

type Props = {
  onSalvar: (ocorrencia: Omit<Ocorrencia, "id">) => void;
  onVoltar: () => void;
};

const tiposDefeito: TipoDefeito[] = [
  "TRINCA",
  "CORROSAO",
  "DEFEITO_DIMENSIONAL",
  "CONTAMINACAO",
  "OUTRO",
];

const statusOpcoes: { valor: StatusOcorrencia; label: string }[] = [
  { valor: "ABERTA", label: "Aberta" },
  { valor: "EM_ANALISE", label: "Em Análise" },
  { valor: "RESOLVIDA", label: "Resolvida" },
];

export default function CadastroScreen({ onSalvar, onVoltar }: Props) {
  const [descricao, setDescricao] = useState("");
  const [tipoDefeito, setTipoDefeito] = useState<TipoDefeito>("TRINCA");
  const [localizacao, setLocalizacao] = useState("");
  const [gravidadeNivel, setGravidadeNivel] = useState(1);
  const [status, setStatus] = useState<StatusOcorrencia>("ABERTA");
  const [observacoes, setObservacoes] = useState("");

  const handleSalvar = () => {
    if (!descricao.trim() || !localizacao.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha a Descrição e a Localização para continuar."
      );
      return;
    }

    onSalvar({
      descricao: descricao.trim(),
      tipoDefeito,
      localizacao: localizacao.trim(),
      gravidadeNivel,
      status,
      dataHoraDeteccao: new Date().toISOString(),
      observacoes: observacoes.trim() || undefined,
    });
  };

  const getGravidadeCor = (n: number) => {
    if (n <= 2) return "#10B981";
    if (n === 3) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} style={styles.voltarBtn}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Nova Ocorrência</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView
        style={styles.form}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Descrição */}
        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva a ocorrência detectada pelo sistema..."
          multiline
          numberOfLines={3}
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />

        {/* Tipo de Defeito */}
        <Text style={styles.label}>Tipo de Defeito</Text>
        <View style={styles.opcoes}>
          {tiposDefeito.map((tipo) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.opcaoBotao,
                tipoDefeito === tipo && styles.opcaoSelecionada,
              ]}
              onPress={() => setTipoDefeito(tipo)}
            >
              <Text
                style={[
                  styles.opcaoTexto,
                  tipoDefeito === tipo && styles.opcaoTextoSelecionado,
                ]}
              >
                {tipo.replace(/_/g, " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Localização */}
        <Text style={styles.label}>Localização *</Text>
        <TextInput
          style={styles.input}
          value={localizacao}
          onChangeText={setLocalizacao}
          placeholder="Ex: Linha A - Estação 3"
          placeholderTextColor="#9CA3AF"
        />

        {/* Nível de Gravidade */}
        <Text style={styles.label}>
          Nível de Gravidade:{" "}
          <Text style={{ color: getGravidadeCor(gravidadeNivel) }}>
            {gravidadeNivel}/5
          </Text>
        </Text>
        <View style={styles.nivelContainer}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              style={[
                styles.nivelBotao,
                gravidadeNivel === n && {
                  backgroundColor: getGravidadeCor(n),
                  borderColor: getGravidadeCor(n),
                },
              ]}
              onPress={() => setGravidadeNivel(n)}
            >
              <Text
                style={[
                  styles.nivelTexto,
                  gravidadeNivel === n && styles.nivelTextoSelecionado,
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.nivelLegenda}>
          <Text style={[styles.legItem, { color: "#10B981" }]}>● Baixo</Text>
          <Text style={[styles.legItem, { color: "#F59E0B" }]}>● Médio</Text>
          <Text style={[styles.legItem, { color: "#EF4444" }]}>● Alto</Text>
        </View>

        {/* Status */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.opcoes}>
          {statusOpcoes.map((s) => (
            <TouchableOpacity
              key={s.valor}
              style={[
                styles.opcaoBotao,
                status === s.valor && styles.opcaoSelecionada,
              ]}
              onPress={() => setStatus(s.valor)}
            >
              <Text
                style={[
                  styles.opcaoTexto,
                  status === s.valor && styles.opcaoTextoSelecionado,
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Observações */}
        <Text style={styles.label}>Observações (opcional)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Informações adicionais sobre a ocorrência..."
          multiline
          numberOfLines={3}
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />

        {/* Botão Salvar */}
        <TouchableOpacity
          style={styles.salvarBtn}
          onPress={handleSalvar}
          activeOpacity={0.85}
        >
          <Text style={styles.salvarTexto}>Registrar Ocorrência</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
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
  form: { paddingHorizontal: 16 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1F2937",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputMultiline: { height: 85, textAlignVertical: "top" },
  opcoes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcaoBotao: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  opcaoSelecionada: { backgroundColor: "#1E40AF", borderColor: "#1E40AF" },
  opcaoTexto: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  opcaoTextoSelecionado: { color: "#fff", fontWeight: "700" },
  nivelContainer: { flexDirection: "row", gap: 10 },
  nivelBotao: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  nivelTexto: { fontSize: 18, fontWeight: "700", color: "#9CA3AF" },
  nivelTextoSelecionado: { color: "#fff" },
  nivelLegenda: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    justifyContent: "center",
  },
  legItem: { fontSize: 11, fontWeight: "600" },
  salvarBtn: {
    backgroundColor: "#1E40AF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  salvarTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
