# SPI — Sistema de Visão Computacional Industrial

## Sprint 3 — Integração Frontend e Backend

Advanced Programming & Mobile Dev — FIAP · Desafio Metaindústria

### Integrantes

| Nome | RM |
|---|---|
| Celso Fernando Ferrer Singh | 565643 |
| Juan Alberto Lenis Rodriguez | 559744 |
| Rodrigo Arantes da Silva Philippi | 557594 |
| Henrique Monteiro Khouri | 555572 |
| Kagio Miura Neto | 559212 |

---

## 1. Descrição

O SPI registra e acompanha as **ocorrências** que o sistema de visão computacional
detecta na linha de produção — trincas, corrosão, defeito dimensional, contaminação —
com a localização na fábrica, o nível de gravidade de 1 a 5 e o status no fluxo de
resolução (aberta → em análise → resolvida).

Na **Sprint 1** foi construída a API Spring Boot com a entidade `Ocorrencia` e H2 em
arquivo. Na **Sprint 2** foi construído o app React Native (Expo), que lia os dados de
`src/data/mockData.ts`.

Nesta **Sprint 3** os dois foram conectados. O mock deixou de existir: as três telas
(lista, cadastro e detalhe) leem e gravam registros reais da API.

### Repositórios

| Repositório | O que é |
|---|---|
| [spi-backend](https://github.com/celsoferrersingh/spi-backend) | API Spring Boot (Sprint 1) + CORS + rota por status |
| [spi-mobile](https://github.com/celsoferrersingh/spi-mobile) | App Expo (Sprint 2) + camada de serviços, sem mock |

Este README está nos dois repositórios, porque documenta a integração inteira.
Onde aparecer `spi-backend/` ou `spi-mobile/` abaixo, leia como "a raiz do
repositório correspondente".

---

## 2. O que mudou nesta sprint

### No backend (`spi-backend`)

| Arquivo | Mudança |
|---|---|
| `controller/OcorrenciaController.java` | **`@CrossOrigin(origins = "*")`** — sem isso o navegador bloqueia o app |
| `controller/OcorrenciaController.java` | nova rota `GET /ocorrencias/status/{status}` |
| `repository/OcorrenciaRepository.java` | consulta derivada `findByStatusOrderByDataHoraDeteccaoDesc` |
| `service/OcorrenciaService.java` | `listarPorStatus`, ordenação por data, `dataHoraDeteccao` preenchida quando não vem no POST |
| `config/CargaInicial.java` | **novo** — insere na primeira execução as 4 ocorrências que antes eram o mock |
| `application.properties` | datas em ISO-8601 (`write-dates-as-timestamps=false`) |

A entidade, o `pom.xml` e a estrutura em camadas continuam exatamente como na Sprint 1.

### No app (`spi-mobile`)

| Arquivo | Mudança |
|---|---|
| `src/data/mockData.ts` | **removido** |
| `src/services/api.ts` | **novo** — instância do Axios |
| `src/services/ocorrenciaService.ts` | **novo** — `listar`, `listarPorStatus`, `buscarPorId`, `criar`, `atualizar`, `remover` |
| `src/services/erroHttp.ts` | **novo** — traduz o erro do Axios em mensagem para a tela |
| `src/types/index.ts` | `NovaOcorrencia = Omit<Ocorrencia, "id">` |
| `App.tsx` | não guarda mais a lista em memória; passa só o **id** para o detalhe |
| `src/screens/ListaScreen.tsx` | `GET` + `useEffect` + `Promise.all` + estados |
| `src/screens/CadastroScreen.tsx` | `POST` + estados |
| `src/screens/DetalheScreen.tsx` | `GET` por id + `PUT` para avançar o status |
| `package.json` | `axios` |

O visual e a navegação por estado da Sprint 2 foram mantidos.

---

## 3. Pré-requisitos

| Ferramenta | Versão |
|---|---|
| JDK | 17 ou superior |
| Maven | 3.8+ (ou rodar pelo IntelliJ / VS Code) |
| Node.js | 18 ou superior |
| Expo Go, emulador Android ou navegador | — |

---

## 4. Como subir o backend

```bash
cd spi-backend
mvn spring-boot:run
```

A API sobe em **`http://localhost:8080`**.

Rode sempre de dentro de `spi-backend`: o H2 cria o arquivo em `./data/spidb.mv.db`,
relativo ao diretório atual.

Na primeira execução a classe `CargaInicial` insere quatro ocorrências de exemplo —
as mesmas que estavam no `mockData.ts` da Sprint 2. Agora elas nascem no banco.

Console do H2: <http://localhost:8080/h2-console>
(JDBC URL `jdbc:h2:file:./data/spidb`, usuário `sa`, senha vazia)

Para zerar o banco, pare o backend e apague a pasta `spi-backend/data/`.

---

## 5. Como subir o frontend

```bash
cd spi-mobile
npm install
npx expo install axios     # axios instalado pelo Expo, não por npm install
npx expo start
```

| Tecla | Abre em |
|---|---|
| `w` | Navegador |
| `a` | Emulador Android |
| `i` | Simulador iOS (macOS) |
| QR Code | Celular com o Expo Go |

O `npx expo install` resolve a versão do axios compatível com a SDK do projeto, o que
o `npm install axios` não faz.

---

## 6. Endpoints

Base: `http://localhost:8080` · Recurso: `/ocorrencias`

| Método | Rota | O que faz | Usado por |
|---|---|---|---|
| `GET` | `/ocorrencias` | Lista todas (mais recentes primeiro) | Tela de **lista** |
| `GET` | `/ocorrencias/status/{status}` | Lista por status | Tela de **lista** (`Promise.all`) |
| `GET` | `/ocorrencias/{id}` | Busca uma por id | Tela de **detalhe** |
| `POST` | `/ocorrencias` | Cria uma ocorrência (201) | Tela de **cadastro** |
| `PUT` | `/ocorrencias/{id}` | Atualiza *(opcional)* | Detalhe — avançar status |
| `DELETE` | `/ocorrencias/{id}` | Exclui (204) *(opcional)* | — |

O controller tem **`@CrossOrigin(origins = "*")`**, sem o qual a versão web do app
seria bloqueada pelo CORS do navegador.

### JSON da Ocorrência

```json
{
  "id": 1,
  "descricao": "Trinca superficial detectada na peca #4471",
  "tipoDefeito": "TRINCA",
  "localizacao": "Linha A - Estacao 3",
  "gravidadeNivel": 4,
  "status": "ABERTA",
  "dataHoraDeteccao": "2026-09-18T10:30:00",
  "imagemReferencia": "imagens/captura_4471.jpg",
  "observacoes": "Detectado pelo sensor de camera S-03"
}
```

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `number` | Gerado pelo banco (`IDENTITY`) |
| `descricao` | `string` | Obrigatório |
| `tipoDefeito` | `string` | `TRINCA`, `CORROSAO`, `DEFEITO_DIMENSIONAL`, `CONTAMINACAO`, `OUTRO` |
| `localizacao` | `string` | Obrigatório — ex.: "Linha A - Estação 3" |
| `gravidadeNivel` | `number` | 1 (baixo) a 5 (crítico) |
| `status` | `string` | `ABERTA`, `EM_ANALISE`, `RESOLVIDA` |
| `dataHoraDeteccao` | `string` | ISO-8601 |
| `imagemReferencia` | `string?` | Opcional |
| `observacoes` | `string?` | Opcional |

O corpo do `POST` é o mesmo JSON **sem `id`** — daí o tipo
`NovaOcorrencia = Omit<Ocorrencia, "id">` no app.

### Conferindo antes de integrar

Abra <http://localhost:8080/ocorrencias> no navegador — tem que devolver um array JSON.

Para o `POST`, use o arquivo `spi-backend/requests.http` (VS Code + extensão
*REST Client*), que já traz as oito requisições montadas, ou copie para o
Postman/Insomnia.

---

## 7. A camada de serviços

A regra da sprint: **a tela não chama Axios e não monta URL**. Quem faz isso é
`src/services`.

```
spi-mobile/
├── App.tsx                     <- navegação por estado; passa só o id para o detalhe
└── src/
    ├── services/
    │   ├── api.ts              <- instância do Axios (baseURL, timeout, headers)
    │   ├── ocorrenciaService.ts <- listar, listarPorStatus, buscarPorId, criar, atualizar, remover
    │   └── erroHttp.ts         <- traduz o erro do Axios em mensagem para a tela
    ├── types/index.ts          <- tipos alinhados ao JSON da API
    ├── screens/
    │   ├── ListaScreen.tsx     <- GET + useEffect + Promise.all
    │   ├── CadastroScreen.tsx  <- POST
    │   └── DetalheScreen.tsx   <- GET por id + PUT
    └── components/
        └── OcorrenciaCard.tsx
```

`api.ts` cria a instância do Axios com `baseURL`, `timeout` de 10 segundos e
`Content-Type: application/json`.

`ocorrenciaService.ts` é o único arquivo do app que conhece o caminho `/ocorrencias`.
As telas importam funções (`listar()`, `criar(nova)`, `buscarPorId(id)`) e recebem
objetos já tipados.

---

## 8. `BASE_URL` — qual endereço usar

O `BASE_URL` é montado em `src/services/api.ts`. Existem três casos porque "localhost"
significa coisas diferentes dependendo de onde o app roda.

| Onde o app roda | `BASE_URL` | Por quê |
|---|---|---|
| Navegador (web) e iOS Simulator | `http://localhost:8080` | Compartilham o localhost da máquina |
| Emulador Android | `http://10.0.2.2:8080` | Dentro do emulador, `10.0.2.2` é o localhost do PC |
| **Celular físico** (Expo Go) | `http://SEU_IP:8080` | O celular é outro aparelho na rede |

Web, iOS e emulador Android funcionam **sem mexer em nada** — o `Platform.OS` resolve.

### Para rodar no celular físico

1. Descubra o IP da máquina na rede local:
   - **Windows:** `ipconfig` → "Endereço IPv4" do adaptador Wi-Fi
   - **macOS:** `ipconfig getifaddr en0`
   - **Linux:** `hostname -I`
2. Em `spi-mobile/src/services/api.ts`, preencha:

   ```ts
   const IP_DA_MAQUINA = "192.168.0.12";
   ```

3. Salve — o Expo recarrega sozinho.

Celular e PC na mesma rede Wi-Fi. Se não conectar, normalmente é o Firewall do Windows
bloqueando a porta 8080.

---

## 9. Como testar a integração

1. **Suba o backend** e confirme <http://localhost:8080/ocorrencias> devolvendo JSON.
2. **Suba o app** e abra na web (`w`) ou no emulador (`a`).
3. **Lista:** abre com as 4 ocorrências da carga inicial. Os contadores **Abertas** e
   **Em Análise** no cabeçalho vêm de **duas chamadas extras**, disparadas junto com a
   listagem por `Promise.all`.
4. **Cadastro:** toque em *＋ Nova Ocorrência*, preencha e envie. A faixa verde mostra
   o **id gerado pelo banco** e o app abre o detalhe.
5. **Detalhe:** os dados vêm de `GET /ocorrencias/{id}` — do banco, não do formulário.
6. **Fluxo de status:** o botão *Mover para Em Análise* faz `PUT /ocorrencias/{id}`.
7. **Confirme no banco:** <http://localhost:8080/h2-console> → `SELECT * FROM OCORRENCIAS;`
8. **Persistência:** pare e suba o backend de novo. Os registros continuam lá (H2 em arquivo).
9. **Arrastar para atualizar:** puxe a lista para baixo — ela refaz as três chamadas.

---

## 10. O que o app faz se o backend estiver parado

Este cenário está tratado de propósito — é o estado de **erro** pedido na sprint.

Toda chamada passa por `try / catch / finally`:

- **`try`** — chama o serviço;
- **`catch`** — guarda a mensagem no estado `erro`;
- **`finally`** — desliga o `carregando`, dê certo ou não. O app nunca trava no *spinner*.

Com o backend fora do ar, o Axios falha sem `response` e o `erroHttp.ts` traduz isso para:

> ⚠️ **Não consegui carregar**
> Não foi possível falar com o backend em `http://localhost:8080`.
> Suba a API Spring Boot e tente de novo.

e abaixo um botão **Tentar novamente**, que refaz a chamada sem reiniciar o app.

| Tela | Comportamento com o backend parado |
|---|---|
| Lista | Tela de erro com o `BASE_URL` tentado e botão *Tentar novamente* |
| Cadastro | O formulário continua preenchido e aparece a faixa vermelha — nada é perdido |
| Detalhe | Tela de erro com botão *Tentar novamente* |

Outros erros também têm mensagem própria: **timeout** (backend demorando mais de 10s),
**404** (registro não existe mais) e **400** (dados recusados pelo backend).

---

## 11. Backend em camadas

```
br.com.metaindustria.spi
├── SpiApplication.java                   <- classe main
├── model/Ocorrencia.java                 <- entidade JPA (tabela "ocorrencias")
├── repository/OcorrenciaRepository.java  <- JpaRepository
├── service/OcorrenciaService.java        <- regra de negócio
├── controller/OcorrenciaController.java  <- rotas REST + @CrossOrigin
└── config/CargaInicial.java              <- 4 registros na 1ª execução
```

| Camada | Responsabilidade |
|---|---|
| Controller | Recebe HTTP e devolve o status certo |
| Service | Orquestra e prepara o objeto antes de salvar |
| Repository | Acesso ao banco via Spring Data JPA |
| Model | Entidade `ocorrencias` |

---

## 12. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| App mostra "Não foi possível falar com o backend" | Backend não está rodando | `mvn spring-boot:run` em `spi-backend` |
| Erro de CORS no console do navegador | Falta `@CrossOrigin` | Já está no `OcorrenciaController` |
| Funciona na web mas não no emulador Android | `localhost` dentro do emulador é o próprio emulador | Já tratado: o app usa `10.0.2.2` |
| Não funciona no celular físico | `IP_DA_MAQUINA` vazio, redes diferentes ou firewall | Seção 8 |
| `Port 8080 was already in use` | Outra aplicação na porta | Feche a outra ou troque `server.port` (e a `PORTA` em `api.ts`) |
| Lista vazia na primeira vez | Banco já existia vazio | Pare o backend, apague `spi-backend/data/`, suba de novo |
| `npm install axios` deu conflito | Versão incompatível com a SDK | `npx expo install axios` |
| `npx.ps1 não pode ser carregado` (Windows) | Execução de scripts bloqueada | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
