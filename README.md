<p align="center">
  <img src="./imagens/Banner.png" width="1000">
</p>

# BB EletroRota

> **Plataforma de Localização e Planejamento de Recarga para Veículos Elétricos**

Aplicação web desenvolvida em React que permite ao usuário localizar eletropostos próximos, planejar rotas de viagem com paradas de recarga otimizadas e calcular a autonomia do seu veículo elétrico.

**Deploy:** [bb-eletro-rota-testes.vercel.app](https://bb-eletro-rota-testes.vercel.app)

**Residência tecnológica do Porto Digital**

**Squad:** Senac Squad 2

---

## Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e execução local](#-instalação-e-execução-local)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Integrações externas](#-integrações-externas)
- [Deploy](#-deploy)
- [Paleta de cores](#-paleta-de-cores)

---

## Funcionalidades

- Mapa interativo com localização em tempo real e marcadores de eletropostos;
- Calculadora de autonomia do veículo elétrico;
- Planejador de viagem com paradas de recarga otimizadas;
- Cadastro e gerenciamento de veículos;
- Login, cadastro e edição de perfil de usuário;
- Recomendação inteligente de posto baseada em distância, fila, potência e tempo de carregamento.

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| Node | ^v24.14.1 |
| Npm | ^11.16.0 |
| React | ^19.2.5 |
| React Router DOM | ^7.14.2 |
| Vite | ^8.0.10 |
| Leaflet | 1.9.4 (via CDN) |
| json-server | (via npx) |

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) 18.x ou superior (LTS recomendado);
- npm (incluído com o Node.js).

---

## Instalação e execução local

### 1. Clone o repositório

```bash
git clone https://github.com/EdsonAguiar888/BB-EletroRota-Testes.git
cd BB-EletroRota-Testes
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor local (json-server)

Abra um terminal e execute:

```bash
npx json-server --watch db.json
```

> O servidor ficará disponível em `http://localhost:3000`. Pressione `CTRL+C` para encerrar.

### 4. Inicie a aplicação React

Em um **segundo terminal**, execute:

```bash
npm run dev
```

> A aplicação estará disponível em `http://localhost:5173` (padrão do Vite).

---

### Outros comandos disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run server` | Atalho para iniciar o json-server na porta 3000 |
| `npm run build` | Gera o build de produção na pasta `/dist` |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint no código-fonte |

---

## Estrutura do projeto

```
BB-EletroRota-Testes/
├── public/
├── src/
│   ├── components/
│   │   └── MapaEletropostos.jsx   # Componente de mapa com marcadores e rotas
│   ├── pages/
│   │   ├── Login.jsx              # Autenticação de usuário
│   │   ├── HomeLogado.jsx         # Tela inicial do usuário logado
│   │   ├── Mapa.jsx               # Página do mapa interativo
│   │   ├── PlanejadorViagem.jsx   # Planejamento de rotas com paradas
│   │   ├── CalculadoraAutonomia.jsx # Cálculo de autonomia do veículo
│   │   ├── GerenciarVeiculos.jsx  # CRUD de veículos
│   │   └── EditarPerfil.jsx       # Edição de perfil do usuário
│   ├── utils/
│   │   └── rotaOtimizada.js       # Core do algoritmo de recomendação
│   ├── styles/
│   │   └── bbEletroRota.css       # Estilos globais
│   └── App.jsx                    # Roteamento principal
├── db.json                        # Base de dados local (json-server)
├── index.html                     # Entry point HTML
├── vercel.json                    # Configuração de deploy na Vercel
├── vite.config.js
└── package.json
```

---

## Integrações externas

| Serviço | Uso | URL |
|---|---|---|
| **MockAPI** | Login, cadastro e gerenciamento de usuários/veículos em produção | `https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios` |
| **json-server** | Simulação local do banco de dados via `db.json` | `http://localhost:3000/usuarios` |
| **OSRM** | Cálculo de rotas reais, distância e duração entre pontos | `https://router.project-osrm.org/route/v1/driving/` |
| **Leaflet** | Mapa interativo, marcadores e desenho de rotas | CDN `unpkg.com/leaflet@1.9.4` |
| **CartoDB** | Tiles visuais da camada de mapa (fundo cartográfico) | — |

---

## Deploy

O projeto é hospedado na **Vercel**. O arquivo `vercel.json` garante que as rotas internas do React (SPA) funcionem corretamente em produção:

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Para fazer um novo deploy:

1. Conecte o repositório à sua conta na [Vercel](https://vercel.com);
2. Configure o **Framework Preset** como `Vite`;
3. **Build Command:** `npm run build`;
4. **Output Directory:** `dist`;
5. O `vercel.json` já está configurado no repositório.

---

## Paleta de cores

| Nome | Hex |
|---|---|
| Amarelo | `#FFDF00` |
| Amarelo claro | `#EFD731` |
| Azul escuro | `#003A8F` |
| Azul | `#1A73E8` |
| Azul para nomes | `#2116B8` |

## Desenvolvedores:
- Allany Dias de Oliveira;

- Arthur Andrey Ferreira Paulo;

- Danilo Henrique Basilio da Silva;

- Edson Severino da Silva Aguiar;

- Ericha Tainá da Silva Barbosa;

- Evencio José de Vasconcelos Neto;

- Felipe Mitchell Campos Ramos.
