export const VELOCIDADE_MEDIA_KMH = 45;
export const CAPACIDADE_BATERIA_KWH = 60;
export const CARGA_ALVO_PERCENTUAL = 100;

export const postosRecarga = [
  {
    nome: 'Eletroposto Recife Antigo',
    lat: -8.0631,
    lng: -34.8711,
    potencia: '150 kW',
    espera: '5 min',
    distancia: '2,1 km',
    livres: 2,
    total: 4,
    cor: '#16a34a',
    endereco: 'Av. Alfredo Lisboa, 220 - Recife Antigo, Recife - PE, 50030-150',
    comodidades: ['Alimentação', 'Banheiros', 'Wi-Fi', 'Mercado'],
    acesso: 'Público',
    acessoDescricao: 'Disponível para uso público 24 horas.',
    precoAtivacao: 'R$2,00 por ativação',
    precoKwh: 'R$1,70 / kWh',
    telefone: '(81) 3003-1200',
    horario: '24 horas',
    conector: { rede: 'EletroRota Recife', tipo: 'CCS2', conectores: 2, carregadores: 1 }
  },
  {
    nome: 'Eletroposto Boa Vista',
    lat: -8.0589,
    lng: -34.8832,
    potencia: '50 kW',
    espera: '8 min',
    distancia: '3,4 km',
    livres: 1,
    total: 3,
    cor: '#2563eb',
    endereco: 'Rua da Aurora, 980 - Boa Vista, Recife - PE, 50050-000',
    comodidades: ['Café', 'Lojas', 'Banheiros', 'Estacionamento'],
    acesso: 'Público',
    acessoDescricao: 'Entrada liberada pelo estacionamento principal.',
    precoAtivacao: 'R$3,50 por ativação',
    precoKwh: 'R$1,55 / kWh',
    telefone: '(81) 3222-4510',
    horario: '06:00 às 23:00',
    conector: { rede: 'Rede Centro EV', tipo: 'CCS2', conectores: 1, carregadores: 1 }
  },
  {
    nome: 'Shopping Recife',
    lat: -8.1193,
    lng: -34.9045,
    potencia: '22 kW',
    espera: '2 min',
    distancia: '5,8 km',
    livres: 3,
    total: 6,
    cor: '#facc15',
    endereco: 'Rua Padre Carapuceiro, 777 - Boa Viagem, Recife - PE, 51020-900',
    comodidades: ['Alimentação', 'Cinema', 'Banheiros', 'Lojas', 'Wi-Fi'],
    acesso: 'Semi-público',
    acessoDescricao: 'Disponível durante o funcionamento do shopping.',
    precoAtivacao: 'R$4,00 por ativação',
    precoKwh: 'R$1,35 / kWh',
    telefone: '(81) 3464-9000',
    horario: '10:00 às 22:00',
    conector: { rede: 'Shopping Charge', tipo: 'Tipo 2', conectores: 6, carregadores: 3 }
  },
  {
    nome: 'Eletroposto Olinda',
    lat: -8.0137,
    lng: -34.8553,
    potencia: '50 kW',
    espera: '10 min',
    distancia: '6,2 km',
    livres: 2,
    total: 2,
    cor: '#16a34a',
    endereco: 'Av. Ministro Marcos Freire, 1200 - Bairro Novo, Olinda - PE, 53030-000',
    comodidades: ['Parque', 'Café', 'Banheiros'],
    acesso: 'Público',
    acessoDescricao: 'Vagas sinalizadas na área externa.',
    precoAtivacao: 'Informação não disponível',
    precoKwh: 'R$1,60 / kWh',
    telefone: '(81) 3439-7788',
    horario: '07:00 às 22:00',
    conector: { rede: 'Olinda Energia', tipo: 'CCS2', conectores: 2, carregadores: 1 }
  },
  {
    nome: 'Eletroposto Jaboatao',
    lat: -8.1128,
    lng: -35.0147,
    potencia: '50 kW',
    espera: '7 min',
    distancia: '8,9 km',
    livres: 1,
    total: 4,
    cor: '#2563eb',
    endereco: 'Av. Barreto de Menezes, 1845 - Prazeres, Jaboatão dos Guararapes - PE, 54325-000',
    comodidades: ['Mercado', 'Banheiros', 'Caixa eletrônico', 'Wi-Fi'],
    acesso: 'Público',
    acessoDescricao: 'Acesso pelo pátio lateral do centro comercial.',
    precoAtivacao: 'R$2,50 por ativação',
    precoKwh: 'R$1,48 / kWh',
    telefone: '(81) 3476-1900',
    horario: '06:00 às 00:00',
    conector: { rede: 'Jaboatão EV', tipo: 'CCS2', conectores: 4, carregadores: 2 }
  },
  {
    nome: 'Eletroposto Cabo',
    lat: -8.2833,
    lng: -35.0333,
    potencia: '150 kW',
    espera: '4 min',
    distancia: '31 km',
    livres: 2,
    total: 3,
    cor: '#16a34a',
    endereco: 'BR-101 Sul, km 34 - Distrito Industrial, Cabo de Santo Agostinho - PE, 54503-010',
    comodidades: ['Restaurante', 'Banheiros', 'Borracharia', 'Loja'],
    acesso: 'Público',
    acessoDescricao: 'Acesso direto pela rodovia, com área para manobra.',
    precoAtivacao: 'R$5,00 por ativação',
    precoKwh: 'R$1,82 / kWh',
    telefone: '(81) 3521-4420',
    horario: '24 horas',
    conector: { rede: 'Rota Sul Energia', tipo: 'CCS2', conectores: 3, carregadores: 2 }
  },
  {
    nome: 'Eletroposto Paulista',
    lat: -7.9408,
    lng: -34.8731,
    potencia: '22 kW',
    espera: '3 min',
    distancia: '18 km',
    livres: 4,
    total: 5,
    cor: '#facc15',
    endereco: 'Av. Dr. Cláudio José Gueiros Leite, 6400 - Janga, Paulista - PE, 53437-000',
    comodidades: ['Praça de alimentação', 'Farmácia', 'Banheiros'],
    acesso: 'Público',
    acessoDescricao: 'Uso liberado em vagas cobertas.',
    precoAtivacao: 'R$1,50 por ativação',
    precoKwh: 'R$1,28 / kWh',
    telefone: '(81) 3437-6601',
    horario: '08:00 às 21:00',
    conector: { rede: 'Paulista Plug', tipo: 'Tipo 2', conectores: 5, carregadores: 3 }
  },
  {
    nome: 'Eletroposto Vitoria',
    lat: -8.1181,
    lng: -35.2914,
    potencia: '150 kW',
    espera: '6 min',
    distancia: '50 km',
    livres: 2,
    total: 4,
    cor: '#16a34a',
    endereco: 'BR-232, km 45 - Vitória de Santo Antão - PE, 55602-000',
    comodidades: ['Restaurante', 'Mercado', 'Banheiros', 'Wi-Fi'],
    acesso: 'Público',
    acessoDescricao: 'Ponto em posto rodoviário com acesso sinalizado.',
    precoAtivacao: 'R$4,50 por ativação',
    precoKwh: 'R$1,79 / kWh',
    telefone: '(81) 3523-1180',
    horario: '24 horas',
    conector: { rede: 'BR-232 Fast Charge', tipo: 'CCS2', conectores: 4, carregadores: 2 }
  },
  {
    nome: 'Eletroposto Gravata',
    lat: -8.2013,
    lng: -35.5648,
    potencia: '50 kW',
    espera: '9 min',
    distancia: '84 km',
    livres: 1,
    total: 2,
    cor: '#2563eb',
    endereco: 'Av. Cícero Batista de Oliveira, 910 - Gravatá - PE, 55640-000',
    comodidades: ['Café', 'Pousada', 'Banheiros', 'Loja'],
    acesso: 'Semi-público',
    acessoDescricao: 'Disponível para clientes e visitantes cadastrados.',
    precoAtivacao: 'R$3,00 por ativação',
    precoKwh: 'R$1,52 / kWh',
    telefone: '(81) 3533-4022',
    horario: '07:00 às 20:00',
    conector: { rede: 'Serra EV', tipo: 'CCS2', conectores: 2, carregadores: 1 }
  },
  {
    nome: 'Eletroposto Caruaru',
    lat: -8.2846,
    lng: -35.9702,
    potencia: '150 kW',
    espera: '5 min',
    distancia: '135 km',
    livres: 3,
    total: 4,
    cor: '#16a34a',
    endereco: 'Av. Agamenon Magalhães, 1220 - Maurício de Nassau, Caruaru - PE, 55012-290',
    comodidades: ['Alimentação', 'Banheiros', 'Mercado', 'Wi-Fi'],
    acesso: 'Público',
    acessoDescricao: 'Área aberta, próxima à entrada principal.',
    precoAtivacao: 'R$4,90 por ativação',
    precoKwh: 'R$1,76 / kWh',
    telefone: '(81) 3721-7711',
    horario: '24 horas',
    conector: { rede: 'Agreste Charge', tipo: 'CCS2', conectores: 4, carregadores: 2 }
  },
  {
    nome: 'Eletroposto Garanhuns',
    lat: -8.8903,
    lng: -36.4928,
    potencia: '50 kW',
    espera: '12 min',
    distancia: '230 km',
    livres: 2,
    total: 3,
    cor: '#2563eb',
    endereco: 'Av. Rui Barbosa, 670 - Heliópolis, Garanhuns - PE, 55296-300',
    comodidades: ['Café', 'Restaurante', 'Banheiros'],
    acesso: 'Público',
    acessoDescricao: 'Uso liberado mediante cadastro no app.',
    precoAtivacao: 'R$2,00 por ativação',
    precoKwh: 'R$1,49 / kWh',
    telefone: '(87) 3761-8800',
    horario: '06:00 às 22:00',
    conector: { rede: 'Garanhuns Energia', tipo: 'CCS2', conectores: 3, carregadores: 2 }
  },
  {
    nome: 'Eletroposto Joao Pessoa',
    lat: -7.1195,
    lng: -34.8450,
    potencia: '150 kW',
    espera: '5 min',
    distancia: '120 km',
    livres: 2,
    total: 4,
    cor: '#16a34a',
    endereco: 'Av. Epitácio Pessoa, 4100 - Tambaú, João Pessoa - PB, 58039-000',
    comodidades: ['Alimentação', 'Banheiros', 'Hotel', 'Wi-Fi'],
    acesso: 'Público',
    acessoDescricao: 'Estação em área urbana com vigilância.',
    precoAtivacao: 'R$5,00 por ativação',
    precoKwh: 'R$1,80 / kWh',
    telefone: '(83) 3021-4500',
    horario: '24 horas',
    conector: { rede: 'Litoral Norte EV', tipo: 'CCS2', conectores: 4, carregadores: 2 }
  },
  {
    nome: 'Eletroposto Maceio',
    lat: -9.6498,
    lng: -35.7089,
    potencia: '150 kW',
    espera: '8 min',
    distancia: '260 km',
    livres: 1,
    total: 4,
    cor: '#16a34a',
    endereco: 'Av. Álvaro Otacílio, 2991 - Ponta Verde, Maceió - AL, 57035-180',
    comodidades: ['Restaurante', 'Banheiros', 'Loja', 'Wi-Fi'],
    acesso: 'Público',
    acessoDescricao: 'Acesso pela área externa do complexo comercial.',
    precoAtivacao: 'R$4,00 por ativação',
    precoKwh: 'R$1,84 / kWh',
    telefone: '(82) 3311-2030',
    horario: '24 horas',
    conector: { rede: 'Nordeste Ultra', tipo: 'CCS2', conectores: 4, carregadores: 2 }
  },
  {
    nome: 'Eletroposto Natal',
    lat: -5.7945,
    lng: -35.2110,
    potencia: '50 kW',
    espera: '15 min',
    distancia: '285 km',
    livres: 3,
    total: 5,
    cor: '#2563eb',
    endereco: 'Av. Salgado Filho, 2234 - Lagoa Nova, Natal - RN, 59064-000',
    comodidades: ['Alimentação', 'Banheiros', 'Parque', 'Lojas'],
    acesso: 'Público',
    acessoDescricao: 'Disponível em vagas reservadas no térreo.',
    precoAtivacao: 'Informação não disponível',
    precoKwh: 'R$1,58 / kWh',
    telefone: '(84) 3201-7600',
    horario: '05:30 às 23:30',
    conector: { rede: 'Natal Plug', tipo: 'CCS2', conectores: 2, carregadores: 1 }
  }
];

export function numeroDeTexto(valor) {
  return Number(String(valor).replace(',', '.').match(/\d+(\.\d+)?/)?.[0] || 0);
}

export function formatarMinutos(minutos) {
  const valor = Math.max(0, Math.round(minutos));
  if (valor < 60) return `${valor} min`;

  const horas = Math.floor(valor / 60);
  const resto = valor % 60;
  return resto ? `${horas}h ${resto}min` : `${horas}h`;
}

export function distanciaKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

export function calcularTempoPosto(posto, bateria, rotaReal = null) {
  const potenciaKw = numeroDeTexto(posto.potencia);
  const distanciaKmPosto = rotaReal?.distanciaKm || numeroDeTexto(posto.distancia);
  const tempoDeslocamento = rotaReal?.tempoMin || (distanciaKmPosto / VELOCIDADE_MEDIA_KMH) * 60;
  const esperaInformada = numeroDeTexto(posto.espera);
  const carrosNaFila = Math.max(0, posto.total - posto.livres);
  const percentualParaCarregar = Math.max(0, CARGA_ALVO_PERCENTUAL - Number(bateria || 0));
  const energiaNecessaria = CAPACIDADE_BATERIA_KWH * (percentualParaCarregar / 100);
  const tempoCarga = potenciaKw > 0 ? (energiaNecessaria / potenciaKw) * 60 : 0;
  const tempoFilaPorOcupacao = posto.total > 0 ? (carrosNaFila / posto.total) * tempoCarga : 0;
  const tempoFila = esperaInformada + tempoFilaPorOcupacao;

  return {
    potenciaKw,
    distanciaKm: distanciaKmPosto,
    tempoDeslocamento,
    carrosNaFila,
    tempoFila,
    tempoCarga,
    tempoTotal: tempoDeslocamento + tempoFila + tempoCarga
  };
}

export function calcularRotaOtimizadaPosto(bateria, postos = postosRecarga) {
  return postos
    .map((posto) => ({
      posto,
      calculo: calcularTempoPosto(posto, bateria)
    }))
    .sort((a, b) => a.calculo.tempoTotal - b.calculo.tempoTotal)[0];
}

export function calcularTempoViagemComParadas({
  origem,
  destino,
  paradas = [],
  bateria,
  velocidade
}) {
  let tempoTotal = 0;
  let distanciaTotal = 0;
  let pontoAtual = origem;
  const velocidadeUsada = Number(velocidade) || VELOCIDADE_MEDIA_KMH;

  paradas.forEach((posto) => {
    const distanciaAtePosto = distanciaKm(pontoAtual, posto);
    const tempoAtePosto = (distanciaAtePosto / velocidadeUsada) * 60;
    const calculoPosto = calcularTempoPosto(posto, bateria, {
      distanciaKm: distanciaAtePosto,
      tempoMin: tempoAtePosto
    });

    tempoTotal += calculoPosto.tempoTotal;
    distanciaTotal += distanciaAtePosto;
    pontoAtual = posto;
  });

  const distanciaFinal = distanciaKm(pontoAtual, destino);
  distanciaTotal += distanciaFinal;
  tempoTotal += (distanciaFinal / velocidadeUsada) * 60;

  return {
    tempoTotal,
    distanciaTotal
  };
}

export function calcularRotaOtimizadaViagem({
  origem,
  destino,
  bateria,
  velocidade,
  postos = postosRecarga
}) {
  const velocidadeUsada = Number(velocidade) || VELOCIDADE_MEDIA_KMH;

  return postos
    .map((posto) => {
      const distanciaAtePosto = distanciaKm(origem, posto);
      const tempoAtePosto = (distanciaAtePosto / velocidadeUsada) * 60;
      const calculoPosto = calcularTempoPosto(posto, bateria, {
        distanciaKm: distanciaAtePosto,
        tempoMin: tempoAtePosto
      });
      const distanciaAteDestino = distanciaKm(posto, destino);
      const tempoAteDestino = (distanciaAteDestino / velocidadeUsada) * 60;

      return {
        posto,
        calculo: calculoPosto,
        distanciaTotal: distanciaAtePosto + distanciaAteDestino,
        tempoAteDestino,
        tempoTotal: calculoPosto.tempoTotal + tempoAteDestino
      };
    })
    .sort((a, b) => a.tempoTotal - b.tempoTotal)[0];
}
