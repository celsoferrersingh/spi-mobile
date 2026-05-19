# SPI Mobile — Frontend React Native
## Sprint 2 — Aplicativo Industrial de Ocorrências

App mobile desenvolvido com **React Native + Expo** para o projeto **SPI (Sistemas de Integração)**, no contexto da **Metaindústria**. Nesta sprint, o app funciona com dados mockados, preparado para integração futura com o backend (Sprint 1).

---

## O que o app faz

O app gerencia **ocorrências industriais** detectadas por visão computacional, permitindo:

- Visualizar a lista de ocorrências com status e nível de gravidade
- Cadastrar novas ocorrências com formulário completo
- Ver o detalhe completo de cada ocorrência

---

## Telas do App

| Tela | Descrição |
|------|-----------|
| **ListaScreen** | Lista todas as ocorrências com cards coloridos por status |
| **CadastroScreen** | Formulário para registrar nova ocorrência |
| **DetalheScreen** | Exibe todos os dados de uma ocorrência selecionada |

---

## Como os dados estão mockados

Os dados simulados estão em `src/data/mockData.ts` — um array fixo de ocorrências do tipo `Ocorrencia` (definido em `src/types/index.ts`), alinhado com a entidade do backend.

```typescript
// src/data/mockData.ts
export const mockOcorrencias: Ocorrencia[] = [
  {
    id: 1,
    descricao: "Trinca superficial detectada na peça #4471",
    tipoDefeito: "TRINCA",
    localizacao: "Linha A - Estação 3",
    gravidadeNivel: 4,
    status: "ABERTA",
    dataHoraDeteccao: "2026-05-12T10:30:00",
    ...
  },
  // ... mais ocorrências
];
```

O estado é gerenciado com `useState` no `App.tsx`. Novas ocorrências criadas no app são adicionadas ao estado local (em memória).

---

## Estrutura do Projeto

```
spi-mobile/
├── App.tsx                          ← Gerencia navegação e estado global
└── src/
    ├── types/
    │   └── index.ts                 ← Tipos TypeScript (Ocorrencia, etc.)
    ├── data/
    │   └── mockData.ts              ← Dados mockados (array fixo)
    ├── components/
    │   └── OcorrenciaCard.tsx       ← Card reutilizável da lista
    └── screens/
        ├── ListaScreen.tsx          ← Tela de lista
        ├── CadastroScreen.tsx       ← Tela de cadastro
        └── DetalheScreen.tsx        ← Tela de detalhe
```

---

## Como Rodar o App

### Pré-requisitos
- Node.js instalado (`node --version`)
- Expo Go instalado no celular (App Store / Google Play)

### Passo a Passo

1. **Acesse a pasta do projeto**
   ```bash
   cd spi-mobile
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor Expo**
   ```bash
   npx expo start
   ```

4. **Abra no celular**
   - Abra o app **Expo Go** no seu celular
   - Escaneie o QR code que aparece no terminal
   - O app abrirá automaticamente

---

## Tecnologias Utilizadas

- **React Native** (framework mobile)
- **Expo** (plataforma de desenvolvimento)
- **TypeScript** (tipagem estática)
- **useState** (gerenciamento de estado local)
- **FlatList** (lista performática de ocorrências)

---

## Contexto do Projeto

Este frontend faz parte do projeto **SPI - Sistemas de Integração**, desenvolvido para a disciplina de **Metaindústria**. Integra-se com a etapa de **Visão Computacional** (etapa anterior) e será conectado ao **backend Spring Boot** (Sprint 1) na próxima sprint.
