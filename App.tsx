import React, { useState } from "react";
import ListaScreen from "./src/screens/ListaScreen";
import CadastroScreen from "./src/screens/CadastroScreen";
import DetalheScreen from "./src/screens/DetalheScreen";

// Tipos de tela disponíveis no app
type Screen = "lista" | "cadastro" | "detalhe";

export default function App() {
  // SPRINT 3: o estado global de ocorrencias saiu daqui.
  // Quem tem os dados agora e o backend; cada tela busca o que precisa
  // pela camada de servicos (src/services).

  // Controle de navegação por estado (sem biblioteca externa)
  const [currentScreen, setCurrentScreen] = useState<Screen>("lista");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Muda a cada volta para a lista, forcando um GET novo na API
  const [chaveRecarga, setChaveRecarga] = useState(0);

  // Volta para a lista e pede uma recarga dos dados
  const voltarParaLista = () => {
    setChaveRecarga((valor) => valor + 1);
    setCurrentScreen("lista");
  };

  // Seleciona uma ocorrência e navega para o detalhe.
  // Passa so o id: o detalhe faz o proprio GET /ocorrencias/{id}.
  const handleSelectOcorrencia = (id: number) => {
    setSelectedId(id);
    setCurrentScreen("detalhe");
  };

  // Renderiza a tela correspondente ao estado atual
  if (currentScreen === "lista") {
    return (
      <ListaScreen
        chaveRecarga={chaveRecarga}
        onNovoCadastro={() => setCurrentScreen("cadastro")}
        onSelectOcorrencia={handleSelectOcorrencia}
      />
    );
  }

  if (currentScreen === "cadastro") {
    return (
      <CadastroScreen
        onSalvo={handleSelectOcorrencia}
        onVoltar={voltarParaLista}
      />
    );
  }

  if (currentScreen === "detalhe" && selectedId !== null) {
    return <DetalheScreen id={selectedId} onVoltar={voltarParaLista} />;
  }

  return null;
}
