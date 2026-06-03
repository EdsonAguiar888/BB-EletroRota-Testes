# Registro de prompt: definição da rota otimizada

## Objetivo

Definir a lógica de recomendação da rota otimizada para indicar o eletroposto mais vantajoso ao usuário.

## Contexto

A aplicação BB EletroRota possuía um mapa com pontos de recarga cadastrados, dados fictícios de fila, potência dos carregadores, distância aproximada até cada ponto e nível atual de bateria do veículo. A funcionalidade precisava recomendar automaticamente o melhor ponto de recarga sem exigir que o usuário definisse um destino final.

## Prompt utilizado

Analise a aplicação BB EletroRota e proponha uma regra de rota otimizada que compare os eletropostos disponíveis considerando distância, tempo até o posto, tempo de fila, velocidade de carregamento, quantidade de carros na fila e bateria atual do veículo.

A resposta deve indicar quais dados entram no cálculo, como calcular o tempo total estimado, como escolher o eletroposto recomendado e como apresentar ao usuário a economia de tempo em relação às demais opções.

## Arquivos alterados

- `src/utils/rotaOtimizada.js`
- `src/pages/Mapa.jsx`
- `src/components/MapaEletropostos.jsx`
- `src/styles/bbEletroRota.css`

## Data

2026-05-25

## Responsável

Ericha Barbosa

## Resultado

Foi criada uma regra algorítmica para comparar eletropostos e recomendar a opção com menor tempo total estimado. O cálculo passou a considerar deslocamento, fila, velocidade de carregamento, bateria atual e tempo necessário para recarga.

O usuário passou a visualizar o posto sugerido, o tempo total estimado e a economia aproximada ao usar a rota recomendada.
