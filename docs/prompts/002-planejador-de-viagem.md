# Registro de prompt: planejador de viagem

## Objetivo

Adaptar o planejador de viagem para sugerir paradas de recarga entre uma origem e um destino escolhidos pelo usuário.

## Contexto

O usuário informa origem, destino, autonomia total do veículo, bateria atual e velocidade média estimada. A aplicação precisa calcular se a viagem pode ser concluída com a bateria disponível ou se será necessário realizar uma ou mais paradas de recarga no trajeto.

## Prompt utilizado

Com base nos dados de origem, destino, bateria atual, autonomia do veículo e lista de eletropostos disponíveis, desenhe uma solução para planejar uma viagem com paradas de recarga.

A lógica deve recomendar os postos necessários no trajeto, calcular distância, tempo estimado, tempo de fila, tempo de carregamento e exibir as informações de cada parada em ordem. A solução também deve apresentar um resumo da viagem com distância total, tempo previsto, autonomia disponível e quantidade de paradas recomendadas.

## Arquivos alterados

- `src/pages/PlanejadorViagem.jsx`
- `src/utils/rotaOtimizada.js`
- `src/styles/bbEletroRota.css`

## Data

2026-05-26

## Responsável

Ericha Barbosa

## Resultado

O planejador passou a calcular paradas recomendadas de recarga no caminho entre origem e destino. A tela passou a exibir o resumo da viagem e as informações dos eletropostos necessários para concluir o trajeto.

As paradas passaram a ser apresentadas em ordem, permitindo ao usuário entender onde recarregar e quanto tempo será gasto em cada etapa.
