# Registro de prompt: calculadora de autonomia

## Objetivo

Criar uma calculadora de autonomia para estimar até onde o veículo pode chegar com base na bateria e no consumo informado.

## Contexto

A aplicação já possuía cadastro de veículo, controle de bateria e telas voltadas para mapa e planejamento de viagem. Era necessário criar uma tela específica para cálculo de autonomia e integrá-la à navegação principal do sistema.

## Prompt utilizado

Desenvolva uma calculadora de autonomia para um carro elétrico no padrão visual do BB EletroRota.

A tela deve receber capacidade da bateria, nível de carga atual, consumo médio e fator de condição. Com esses dados, calcule a energia disponível e a autonomia estimada. A solução deve manter navegação para otimizador de rota e planejador de viagem, usando a mesma identidade visual da aplicação.

## Arquivos alterados

- `src/pages/CalculadoraAutonomia.jsx`
- `src/App.jsx`
- `src/pages/Home.jsx`
- `src/pages/HomeLogado.jsx`
- `src/styles/bbEletroRota.css`

## Data

2026-05-27

## Responsável

Ericha Barbosa

## Resultado

Foi adicionada uma página de calculadora com controles para capacidade da bateria, nível de carga atual, consumo médio e fator de condição.

A funcionalidade passou a apresentar autonomia estimada, energia disponível e consumo por 100 km, ajudando o usuário a entender o alcance aproximado do veículo antes de planejar uma rota.
