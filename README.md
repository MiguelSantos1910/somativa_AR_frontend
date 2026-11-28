# Guia AR — Circuitos Eletrônicos em Realidade Aumentada

Aplicação web de **Realidade Aumentada (WebAR)** voltada à **educação em eletrônica**. Ao apontar a câmera do celular para o marcador de um circuito, o app sobrepõe ao objeto real o **modelo 3D** do circuito, **setas direcionais** indicando suas partes e **alertas visuais** de segurança.

Tudo roda direto no navegador, **sem instalar nenhum aplicativo**.

## Funcionalidades

- **Dashboard** com instruções de uso e botão para iniciar o AR
- **Catálogo de circuitos** com foto, descrição e:
  - **Visualizar modelo**: abre o modelo 3D interativo (girar e aproximar)
  - **Abrir target**: abre a imagem do marcador para imprimir ou exibir em tela
- **Modo AR** (rastreamento por imagem):
  - Modelo 3D (`.glb`) ajustado automaticamente ao tamanho do marcador
  - Setas 3D animadas com rótulos apontando para partes do circuito
  - Alertas visuais em 3D (os de perigo pulsam) e lista de alertas na tela

### Circuitos disponíveis

| # | Circuito | Alertas |
|---|---|---|
| 0 | Ponte Retificadora | Alta tensão na entrada CA · Polaridade da saída |
| 1 | Placa-Mãe | Descarga eletrostática · Desligar da tomada |
| 2 | Regulador de Tensão 7805 | Superfície quente · Tensão mínima de entrada |

## Tecnologias

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/) + [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Three.js](https://threejs.org/) — renderização 3D
- [MindAR](https://hiukim.github.io/mind-ar-js-doc/) — rastreamento de imagem para WebAR
- [json-server](https://github.com/typicode/json-server) — API mock com os dados dos circuitos
- [Lucide](https://lucide.dev/) — ícones

## Como rodar

### Pré-requisitos
- Node.js 20 ou superior
- Celular com câmera, na **mesma rede Wi-Fi** do computador (para testar o AR)

### Instalação

```bash
git clone https://github.com/MiguelSantos1910/somativa_AR_frontend.git
cd somativa_AR_frontend
npm install --ignore-scripts --legacy-peer-deps
```

> O `--ignore-scripts` evita a compilação do pacote nativo `canvas` (dependência do MindAR usada apenas no Node, não no navegador), que falha em versões recentes do Node.

### Execução

Em dois terminais:

```bash
# Terminal 1 — API (json-server na porta 3000)
npm run api

# Terminal 2 — aplicação (HTTPS, acessível na rede)
npm run dev -- --host
```

- **No computador:** `https://localhost:5173`
- **No celular:** use o endereço da linha **Network** mostrada no terminal (ex.: `https://192.168.x.x:5173`)

O navegador mostrará um aviso de certificado (o certificado é autoassinado). Aceite para continuar — o **HTTPS é obrigatório** para o navegador liberar a câmera.

### Testando o AR

1. Abra a página **Circuitos** e clique em **Abrir target** (imprima ou deixe na tela do computador)
2. No celular, toque em **Iniciar AR** na dashboard e permita o acesso à câmera
3. Aponte para o marcador — o modelo, as setas e os alertas aparecem sobre ele

## Estrutura do projeto

```
public/
  imagens/          Fotos dos circuitos (também usadas como marcadores)
  modelos/          Modelos 3D .glb
  targets/          targets.mind (marcadores compilados do MindAR)
src/
  ar/efeitos.js     Criação e animação das setas e alertas 3D
  components/       Navbar, Card e ModelViewer (visualizador 3D)
  routes/index.js   Rotas: /, /circuitos e /ar
  services/mock.json  Dados dos circuitos (servidos pelo json-server)
  views/            Home (dashboard), Circuitos e AR
vite.config.js      HTTPS + proxy /api → json-server
```

A aplicação acessa a API por `/api` (variável `VITE_API_URL` no `.env`). O Vite repassa essas chamadas para o `json-server`, o que permite usar a API no celular pelo mesmo endereço HTTPS.

## Formato dos dados

Cada circuito em `src/services/mock.json`:

```json
{
    "id": "3",
    "titulo": "Regulador de Tensão 7805",
    "descricao": "...",
    "imagem": "/imagens/regulador-7805.jpg",
    "modelo": "/modelos/lm.glb",
    "target": "/imagens/regulador-7805.jpg",
    "alertas": [
        { "tipo": "perigo", "texto": "🔥 Superfície quente: use dissipador" }
    ],
    "setas": [
        { "rotulo": "Entrada", "cor": "#f59e0b", "x": -0.2, "y": -0.3, "z": 0.05 }
    ]
}
```

- **`alertas[].tipo`**: `perigo` (vermelho, pulsa), `atencao` (amarelo) ou `info` (azul)
- **`setas[]`**: posição da **ponta** da seta em relação ao marcador. O marcador vai de `-0.5` a `0.5` em `x` (horizontal) e `y` (vertical), com `0, 0` no centro; `z` é a altura acima do papel.

## Como adicionar um circuito

1. Coloque o modelo em `public/modelos/` e a foto/marcador em `public/imagens/`
2. Adicione o circuito ao final de `src/services/mock.json`
3. Gere novamente o `targets.mind` no [compilador do MindAR](https://hiukim.github.io/mind-ar-js-doc/tools/compile), enviando **todas** as imagens **na mesma ordem** do `mock.json` (o índice do marcador corresponde à posição do circuito na lista)
4. Substitua `public/targets/targets.mind`

**Dicas para bons marcadores:** imagens com bastante detalhe e contraste, sem fundo liso e sem padrões repetidos.

### Otimizando modelos

Modelos grandes deixam o carregamento lento no celular. Para reduzir:

```bash
npx @gltf-transform/cli optimize entrada.glb saida.glb --compress draco
npx @gltf-transform/cli simplify entrada.glb saida.glb --ratio 0.5
```

## Créditos

- **Fotos dos circuitos:** Wikimedia Commons, domínio público (CC0)
- **Modelos 3D:** GrabCad, domínio público (CC0)
