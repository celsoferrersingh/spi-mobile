import React, { useState } from "react";
import { Ocorrencia } from "./src/types";
import { mockOcorrencias } from "./src/data/mockData";
import ListaScreen from "./src/screens/ListaScreen";
import CadastroScreen from "./src/screens/CadastroScreen";
import DetalheScreen from "./src/screens/DetalheScreen";

// Tipos de tela disponíveis no app
type Screen = "lista" | "cadastro" | "detalhe";

export default function App() {
  // Estado global das ocorrências (inicializado com dados mockados)
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(mockOcorrencias);

  // Controle de navegação por estado (sem biblioteca externa)
  const [currentScreen, setCurrentScreen] = useState<Screen>("lista");
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<Ocorrencia | null>(null);

  // Adiciona nova ocorrência ao estado e volta para a lista
  const handleAddOcorrencia = (dados: Omit<Ocorrencia, "id">) => {
    const nova: Ocorrencia = {
      ...dados,
      id: Date.now(), // ID único baseado no timestamp
    };
    setOcorrencias((prev) => [nova, ...prev]);
    setCurrentScreen("lista");
  };

  // Seleciona uma ocorrência e navega para o detalhe
  const handleSelectOcorrencia = (ocorrencia: Ocorrencia) => {
    setSelectedOcorrencia(ocorrencia);
    setCurrentScreen("detalhe");
  };

  // Renderiza a tela correspondente ao estado atual
  if (currentScreen === "lista") {
    return (
      <ListaScreen
        ocorrencias={ocorrencias}
        onNovoCadastro={() => setCurrentScreen("cadastro")}
        onSelectOcorrencia={handleSelectOcorrencia}
      />
    );
  }

  if (currentScreen === "cadastro") {
    return (
      <CadastroScreen
        onSalvar={handleAddOcorrencia}
        onVoltar={() => setCurrentScreen("lista")}
      />
    );
  }

  if (currentScreen === "detalhe" && selectedOcorrencia) {
    return (
      <DetalheScreen
        ocorrencia={selectedOcorrencia}
        onVoltar={() => setCurrentScreen("lista")}
      />
    );
  }

  return null;
}
