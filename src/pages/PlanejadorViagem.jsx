
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroEletroRota from '../components/HeroEletroRota';
import './Mapa.css';

import {
  calcularRotaOtimizadaViagem,
  calcularTempoViagemComParadas,
  formatarMinutos,
  postosRecarga
} from '../utils/rotaOtimizada';

const locais = {
  'Recife - Centro': { lat: -8.0631, lng: -34.8711 },
  'Olinda - Centro Histórico': { lat: -8.0137, lng: -34.8553 },
  'Jaboatão dos Guararapes': { lat: -8.1128, lng: -35.0147 },
  'Cabo de Santo Agostinho': { lat: -8.2833, lng: -35.0333 },
  'Ipojuca - Porto de Galinhas': { lat: -8.5046, lng: -35.0024 },
  'Paulista - Centro': { lat: -7.9408, lng: -34.8731 },
  'Abreu e Lima': { lat: -7.9117, lng: -34.9028 },
  'Carpina - Centro': { lat: -7.8457, lng: -35.2514 },
  'Vitória de Santo Antão': { lat: -8.1181, lng: -35.2914 },
  'Gravatá - Centro': { lat: -8.2013, lng: -35.5648 },
  'Caruaru - Centro': { lat: -8.2846, lng: -35.9702 },
  'Bezerros - Centro': { lat: -8.2343, lng: -35.7966 },
  'Garanhuns - Centro': { lat: -8.8903, lng: -36.4928 },
  'João Pessoa - Centro': { lat: -7.1195, lng: -34.8450 },
  'Maceió - Centro': { lat: -9.6498, lng: -35.7089 },
  'Natal - Centro': { lat: -5.7945, lng: -35.2110 }
};

const eletropostosBase = [
  { nome: 'Eletroposto Recife Antigo', lat: -8.0631, lng: -34.8711 },
  { nome: 'Eletroposto Boa Vista', lat: -8.0589, lng: -34.8832 },
  { nome: 'Eletroposto Shopping Recife', lat: -8.1193, lng: -34.9045 },
  { nome: 'Eletroposto Olinda', lat: -8.0137, lng: -34.8553 },
  { nome: 'Eletroposto Jaboatão', lat: -8.1128, lng: -35.0147 },
  { nome: 'Eletroposto Cabo', lat: -8.2833, lng: -35.0333 },
  { nome: 'Eletroposto Vitória', lat: -8.1181, lng: -35.2914 },
  { nome: 'Eletroposto Gravatá', lat: -8.2013, lng: -35.5648 },
  { nome: 'Eletroposto Bezerros', lat: -8.2343, lng: -35.7966 },
  { nome: 'Eletroposto Caruaru', lat: -8.2846, lng: -35.9702 },
  { nome: 'Eletroposto Garanhuns', lat: -8.8903, lng: -36.4928 },
  { nome: 'Eletroposto João Pessoa', lat: -7.1195, lng: -34.8450 },
  { nome: 'Eletroposto Maceió', lat: -9.6498, lng: -35.7089 },
  { nome: 'Eletroposto Natal', lat: -5.7945, lng: -35.2110 }
];

const eletropostos = postosRecarga.length ? postosRecarga : eletropostosBase;

function distanciaKm(a, b) {
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

function pontoIntermediario(origem, destino, fracao) {
  return {
    lat: origem.lat + (destino.lat - origem.lat) * fracao,
    lng: origem.lng + (destino.lng - origem.lng) * fracao
  };
}

function postoMaisProximo(ponto, usados = []) {
  return eletropostos
    .filter((posto) => !usados.includes(posto.nome))
    .map((posto) => ({
      ...posto,
      distancia: distanciaKm(ponto, posto)
    }))
    .sort((a, b) => a.distancia - b.distancia)[0];
}

function calcularParadasPorAutonomia(origemNome, destinoNome, distanciaKmRota, autonomiaDisponivel) {
  const alcance = Number(autonomiaDisponivel);

  if (!alcance || alcance <= 0 || distanciaKmRota <= alcance) {
    return [];
  }

  const origemCoord = locais[origemNome];
  const destinoCoord = locais[destinoNome];
  const distanciaSegura = Math.max(alcance * 0.85, 20);
  const quantidade = Math.ceil(distanciaKmRota / distanciaSegura) - 1;
  const resultado = [];
  const usados = [];

  for (let i = 1; i <= quantidade; i++) {
    const fracao = i / (quantidade + 1);
    const pontoIdeal = pontoIntermediario(origemCoord, destinoCoord, fracao);
    const posto = postoMaisProximo(pontoIdeal, usados);

    if (posto) {
      usados.push(posto.nome);
      resultado.push({
        ...posto,
        ordem: i
      });
    }
  }

  return resultado;
}

function criarInformacoesPosto(posto) {
  if (!posto) return [];

  return [
    {
      titulo: 'Endereço',
      conteudo: posto.endereco
    },
    {
      titulo: 'Comodidades',
      chips: posto.comodidades || []
    },
    {
      titulo: 'Acesso',
      destaque: posto.acesso,
      conteudo: posto.acessoDescricao
    },
    {
      titulo: 'Preço para ativar',
      conteudo: posto.precoAtivacao
    },
    {
      titulo: 'Preço por kWh',
      conteudo: posto.precoKwh
    },
    {
      titulo: 'Telefone',
      conteudo: posto.telefone
    },
    {
      titulo: 'Horário de funcionamento',
      conteudo: posto.horario
    }
  ];
}

export default function PlanejadorViagem() {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const rotaLayer = useRef([]);
  const requestIdRef = useRef(0);
  const userMarkerRef = useRef(null);

  const [origem, setOrigem] = useState('Recife - Centro');
  const [destino, setDestino] = useState('Olinda - Centro Histórico');
  const [autonomia, setAutonomia] = useState(300);
  const [bateria, setBateria] = useState(65);
  const [velocidade, setVelocidade] = useState(80);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('success');
  const [distanciaRota, setDistanciaRota] = useState(0);
  const [tempoEstimado, setTempoEstimado] = useState(0);
  const [paradas, setParadas] = useState([]);
  const [rotaOtimizadaViagem, setRotaOtimizadaViagem] = useState(null);
  const [historicoRotas, setHistoricoRotas] = useState(() => {
    return JSON.parse(localStorage.getItem('historicoRotasPlanejadas') || '[]');
  });
  const [usarLocalizacaoAtual, setUsarLocalizacaoAtual] = useState(true);
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [abaDetalhesPlanejador, setAbaDetalhesPlanejador] = useState('conectores');

  const autonomiaDisponivel = useMemo(() => {
    return Math.round((Number(autonomia) * Number(bateria)) / 100);
  }, [autonomia, bateria]);

  const postosDetalhesViagem = useMemo(() => {
    if (paradas.length > 0) return paradas;
    if (rotaOtimizadaViagem?.posto) return [{ ...rotaOtimizadaViagem.posto, ordem: 1 }];
    return [];
  }, [paradas, rotaOtimizadaViagem]);
  // window.scrollTo({ top: 480, behavior: 'smooth' });
  
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocalizacaoAtual({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        console.log('Localização não permitida.');
      }
    );
  }, []);


  useEffect(() => {
    const L = window.L;

    if (!L || !mapRef.current || leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([-8.0476, -34.8770], 8);

    
    // mostrar localização atual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (userMarkerRef.current) {
            leafletMap.current.removeLayer(userMarkerRef.current);
          }

          userMarkerRef.current = L.circleMarker([lat, lng], {
            radius: 11,
            color: '#ffffff',
            weight: 4,
            fillColor: '#0038a8',
            fillOpacity: 1
          }).addTo(leafletMap.current);

          userMarkerRef.current.bindPopup('Sua localização atual');

          leafletMap.current.setView([lat, lng], 8);
        },
        () => {
          console.log('Geolocalização não permitida.');
        }
      );
    }


    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(leafletMap.current);

    setTimeout(() => {
      planejarRota();
    }, 300);
  }, []);

  const limparMapa = () => {
    if (!leafletMap.current || !rotaLayer.current) return;

    rotaLayer.current.forEach((layer) => {
      if (leafletMap.current.hasLayer(layer)) {
        leafletMap.current.removeLayer(layer);
      }
    });

    rotaLayer.current = [];
  };

  const salvarNoHistorico = (registro) => {
    const chave = `${registro.origem}-${registro.destino}-${registro.bateria}-${registro.autonomia}`;

    setHistoricoRotas((historicoAtual) => {
      const semDuplicado = historicoAtual.filter((item) => item.chave !== chave);
      const novoHistorico = [{ ...registro, chave }, ...semDuplicado].slice(0, 5);

      localStorage.setItem('historicoRotasPlanejadas', JSON.stringify(novoHistorico));

      return novoHistorico;
    });
  };

  const buscarRotaOSRM = async (pontos) => {
    const coordenadas = pontos.map((ponto) => `${ponto.lng},${ponto.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordenadas}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes?.[0]) {
      throw new Error('Rota não encontrada');
    }

    return data.routes[0];
  };

  async function planejarRota() {
    const L = window.L;

    if (!L || !leafletMap.current) return;

    const requestAtual = ++requestIdRef.current;

    limparMapa();
    setMensagem('Calculando rota atual...');
    setTipoMensagem('success');

    const pontoOrigem = usarLocalizacaoAtual && localizacaoAtual
      ? localizacaoAtual
      : locais[origem];
    const pontoDestino = locais[destino];

    try {
      const rotaBase = await buscarRotaOSRM([pontoOrigem, pontoDestino]);

      if (requestAtual !== requestIdRef.current) return;

      const distanciaBase = rotaBase.distance / 1000;
      const novasParadas = calcularParadasPorAutonomia(
        origem,
        destino,
        distanciaBase,
        autonomiaDisponivel
      );

      const pontosComParadas = [pontoOrigem, ...novasParadas, pontoDestino];
      const rotaFinal = novasParadas.length > 0
        ? await buscarRotaOSRM(pontosComParadas)
        : rotaBase;

      if (requestAtual !== requestIdRef.current) return;

      const rota = rotaFinal.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const distancia = rotaFinal.distance / 1000;
      const tempo = rotaFinal.duration / 60;
      const rotaOtimizadaCalculada = calcularRotaOtimizadaViagem({
        origem: pontoOrigem,
        destino: pontoDestino,
        bateria,
        velocidade,
        postos: eletropostos
      });
      const rotaAtualComRecarga = calcularTempoViagemComParadas({
        origem: pontoOrigem,
        destino: pontoDestino,
        paradas: novasParadas,
        bateria,
        velocidade
      });

      limparMapa();

      const layers = [];

      const linha = L.polyline(rota, {
        color: '#0038a8',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(leafletMap.current);

      layers.push(linha);

      layers.push(
        L.circleMarker([pontoOrigem.lat, pontoOrigem.lng], {
          radius: 10,
          color: '#fff',
          weight: 4,
          fillColor: '#0038a8',
          fillOpacity: 1
        }).addTo(leafletMap.current).bindPopup(origem)
      );

      novasParadas.forEach((posto) => {
        layers.push(
          L.circleMarker([posto.lat, posto.lng], {
            radius: 10,
            color: '#fff',
            weight: 4,
            fillColor: '#ffd600',
            fillOpacity: 1
          }).addTo(leafletMap.current).bindPopup(`${posto.ordem}ª parada: ${posto.nome}`)
        );
      });

      layers.push(
        L.circleMarker([pontoDestino.lat, pontoDestino.lng], {
          radius: 10,
          color: '#fff',
          weight: 4,
          fillColor: '#159947',
          fillOpacity: 1
        }).addTo(leafletMap.current).bindPopup(destino)
      );

      rotaLayer.current = layers;

      leafletMap.current.fitBounds(linha.getBounds(), {
        padding: [50, 50]
      });

      setDistanciaRota(distancia);
      setTempoEstimado(tempo);
      setParadas(novasParadas);
      setRotaOtimizadaViagem({
        ...rotaOtimizadaCalculada,
        economiaMinutos: Math.max(0, rotaAtualComRecarga.tempoTotal - rotaOtimizadaCalculada.tempoTotal),
        tempoReferenciaMinutos: rotaAtualComRecarga.tempoTotal
      });

      const registro = {
        id: Date.now(),
        origem,
        destino,
        autonomia: Number(autonomia),
        bateria: Number(bateria),
        distanciaKm: Number(distancia.toFixed(1)),
        tempoMinutos: Math.round(tempo),
        paradas: novasParadas.map((posto) => posto.nome),
        criadaEm: new Date().toLocaleString('pt-BR')
      };

      salvarNoHistorico(registro);

      if (novasParadas.length === 0) {
        setTipoMensagem('success');
        setMensagem('Com a bateria atual, você consegue chegar sem paradas para recarga.');
      } else {
        setTipoMensagem('warning');
        setMensagem(`Com a bateria atual, recomendamos ${novasParadas.length} parada(s) para recarga.`);
      }
    } catch (error) {
      if (requestAtual !== requestIdRef.current) return;

      console.error('Erro ao buscar rota real:', error);
      limparMapa();
      setParadas([]);
      setRotaOtimizadaViagem(null);
      setDistanciaRota(0);
      setTempoEstimado(0);
      setTipoMensagem('warning');
      setMensagem('Erro ao calcular a rota. Verifique sua conexão.');
    }
  }

  useEffect(() => {
    if (leafletMap.current) {
      planejarRota();
    }
  }, [origem, destino, autonomia, bateria, velocidade]);

  const aplicarRotaOtimizada = async () => {
    const L = window.L;

    if (!L || !leafletMap.current || !rotaOtimizadaViagem) return;

    const requestAtual = ++requestIdRef.current;
    const pontoOrigem = usarLocalizacaoAtual && localizacaoAtual
      ? localizacaoAtual
      : locais[origem];
    const pontoDestino = locais[destino];
    const posto = rotaOtimizadaViagem.posto;

    limparMapa();
    setTipoMensagem('success');
    setMensagem('Aplicando rota otimizada...');

    try {
      const rotaFinal = await buscarRotaOSRM([pontoOrigem, posto, pontoDestino]);

      if (requestAtual !== requestIdRef.current) return;

      const rota = rotaFinal.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const distancia = rotaFinal.distance / 1000;
      const tempo = rotaFinal.duration / 60;
      const layers = [];

      const linha = L.polyline(rota, {
        color: '#0038a8',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(leafletMap.current);

      layers.push(linha);
      layers.push(
        L.circleMarker([pontoOrigem.lat, pontoOrigem.lng], {
          radius: 10,
          color: '#fff',
          weight: 4,
          fillColor: '#0038a8',
          fillOpacity: 1
        }).addTo(leafletMap.current).bindPopup(origem)
      );
      layers.push(
        L.circleMarker([posto.lat, posto.lng], {
          radius: 10,
          color: '#fff',
          weight: 4,
          fillColor: '#ffd600',
          fillOpacity: 1
        }).addTo(leafletMap.current).bindPopup(`Rota otimizada: ${posto.nome}`)
      );
      layers.push(
        L.circleMarker([pontoDestino.lat, pontoDestino.lng], {
          radius: 10,
          color: '#fff',
          weight: 4,
          fillColor: '#159947',
          fillOpacity: 1
        }).addTo(leafletMap.current).bindPopup(destino)
      );

      rotaLayer.current = layers;
      leafletMap.current.fitBounds(linha.getBounds(), {
        padding: [50, 50]
      });

      setDistanciaRota(distancia);
      setTempoEstimado(tempo);
      setParadas([{ ...posto, ordem: 1 }]);
      setMensagem(
        rotaOtimizadaViagem.economiaMinutos > 0
          ? `Rota otimizada aplicada por ${posto.nome}. Economia estimada: ${formatarMinutos(rotaOtimizadaViagem.economiaMinutos)}.`
          : `Rota otimizada aplicada por ${posto.nome}.`
      );
    } catch (error) {
      if (requestAtual !== requestIdRef.current) return;

      console.error('Erro ao aplicar rota otimizada:', error);
      setTipoMensagem('warning');
      setMensagem('Erro ao aplicar a rota otimizada. Verifique sua conexao.');
    }
  };

  const salvarViagem = () => {
    const novaViagem = {
      id: Date.now(),
      origem,
      destino,
      autonomia: Number(autonomia),
      bateria: Number(bateria),
      velocidade: Number(velocidade),
      distanciaKm: Number(distanciaRota.toFixed(1)),
      tempoMinutos: Math.round(tempoEstimado),
      paradas: paradas.map((posto) => posto.nome),
      criadaEm: new Date().toLocaleString('pt-BR')
    };

    const viagensSalvas = JSON.parse(localStorage.getItem('viagensSalvas') || '[]');
    viagensSalvas.push(novaViagem);

    localStorage.setItem('viagensSalvas', JSON.stringify(viagensSalvas));

    setTipoMensagem('success');
    setMensagem('Viagem salva com sucesso.');
  };

  return (
    <div className="bb-page">
      <HeroEletroRota />

      <nav className="bb-tabs-nav">
        <Link to="/otimizador">Otimizador de rota</Link>
        <Link className="active" to="/planejador">Planejador de viagem</Link>
        <Link to="/calculadora">Calculadora de autonomia</Link>
      </nav>

      <main className="bb-planner-shell">
        <aside className="bb-planner-panel">
          <div className="bb-planner-panel-header">
            <h1>Planejador de Viagem</h1>
            <p>Escolha origem, destino, bateria e autonomia para calcular paradas de recarga.</p>
          </div>

          <div className="bb-planner-form">
            {mensagem && (
              <div className={tipoMensagem === 'success' ? 'bb-success' : 'bb-warning'}>
                {mensagem}
              </div>
            )}

            <div className="bb-field">
              <label className="bb-label">Origem</label>
              <select className="bb-select" value={origem} onChange={(e) => setOrigem(e.target.value)}>
                {Object.keys(locais).map((local) => (
                  <option key={local}>{local}</option>
                ))}
              </select>
              <span className="bb-help-text">
                {usarLocalizacaoAtual && localizacaoAtual
                  ? 'Usando sua localização atual como origem.'
                  : 'Selecione uma cidade ou região cadastrada.'}
              </span>
            </div>

            
            <div className="bb-field">
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={usarLocalizacaoAtual}
                  onChange={(e) => setUsarLocalizacaoAtual(e.target.checked)}
                />
                <span>Usar minha localização atual como origem</span>
              </label>
            </div>

            <div className="bb-field">
              <label className="bb-label">Destino</label>
              <select className="bb-select" value={destino} onChange={(e) => setDestino(e.target.value)}>
                {Object.keys(locais).map((local) => (
                  <option key={local}>{local}</option>
                ))}
              </select>
              <span className="bb-help-text">Escolha para onde deseja viajar.</span>
            </div>

            <div className="bb-field">
              <label className="bb-label">Autonomia total do veículo</label>
              <div className="bb-range-row">
                <input type="range" min="50" max="600" value={autonomia} onChange={(e) => setAutonomia(e.target.value)} />
                <strong>{autonomia} km</strong>
              </div>
            </div>

            <div className="bb-field">
              <label className="bb-label">Bateria atual</label>
              <div className="bb-range-row">
                <input type="range" min="0" max="100" value={bateria} onChange={(e) => setBateria(e.target.value)} />
                <strong>{bateria}%</strong>
              </div>
              <span className="bb-help-text">Autonomia disponível agora: {autonomiaDisponivel} km.</span>
            </div>

            <div className="bb-field">
              <label className="bb-label">Velocidade média estimada</label>
              <div className="bb-range-row">
                <input type="range" min="30" max="130" value={velocidade} onChange={(e) => setVelocidade(e.target.value)} />
                <strong>{velocidade} km/h</strong>
              </div>
            </div>

            <button className="bb-btn bb-btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={planejarRota}>
              Planejar viagem
            </button>

            <button className="bb-btn bb-btn-secondary" style={{ width: '100%', marginTop: 12 }} onClick={salvarViagem}>
              Salvar viagem
            </button>

            <div className="bb-trip-summary">
              <h3>Resumo da viagem atual</h3>
              <p><strong>Distância:</strong> {distanciaRota ? `${distanciaRota.toFixed(1)} km` : 'Calculando...'}</p>
              <p><strong>Tempo estimado:</strong> {tempoEstimado ? `${Math.round(tempoEstimado)} min` : 'Calculando...'}</p>
              <p><strong>Autonomia disponível:</strong> {autonomiaDisponivel} km</p>
              <p><strong>Paradas necessárias:</strong> {paradas.length}</p>

              {paradas.length > 0 && (
                <ol className="bb-stop-list">
                  {paradas.map((posto) => (
                    <li key={posto.nome}>{posto.nome}</li>
                  ))}
                </ol>
              )}
            </div>

            {rotaOtimizadaViagem && (
              <div className="bb-trip-summary">
                <h3>Rota otimizada</h3>
                <p><strong>{origem} - {rotaOtimizadaViagem.posto.nome} - {destino}</strong></p>
                <p><strong>Tempo ate o posto:</strong> {formatarMinutos(rotaOtimizadaViagem.calculo.tempoDeslocamento)}</p>
                <p><strong>Fila estimada:</strong> {formatarMinutos(rotaOtimizadaViagem.calculo.tempoFila)}</p>
                <p><strong>Tempo para carregar:</strong> {formatarMinutos(rotaOtimizadaViagem.calculo.tempoCarga)}</p>
                <p><strong>Tempo total otimizado:</strong> {formatarMinutos(rotaOtimizadaViagem.tempoTotal)}</p>
                <p>
                  {rotaOtimizadaViagem.economiaMinutos > 0
                    ? `Economia estimada: ${formatarMinutos(rotaOtimizadaViagem.economiaMinutos)}.`
                    : 'A rota direta/atual continua mais rapida, mas este e o melhor ponto para recarregar no caminho.'}
                </p>

                <button className="bb-yellow-action" type="button" onClick={aplicarRotaOtimizada}>
                  Usar rota otimizada
                </button>
              </div>
            )}

            {historicoRotas.length > 0 && (
              <div className="bb-trip-summary">
                <h3>Últimas rotas consultadas</h3>

                <div className="bb-history-list">
                  {historicoRotas.map((item) => (
                    <div className="bb-history-item" key={item.chave || item.id}>
                      <strong>{item.origem} → {item.destino}</strong>
                      <span>{item.distanciaKm} km · {item.tempoMinutos} min · {item.paradas.length} parada(s)</span>
                      <span>Bateria: {item.bateria}% · Autonomia: {item.autonomia} km</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="bb-planner-map-column">
          <section className="bb-planner-map">
            <div ref={mapRef} style={{ width: '100%', minHeight: 720 }} />
          </section>

          {postosDetalhesViagem.map((posto, index) => {
            const conectorViagem = posto.conector || {};
            const informacoesPostoViagem = criarInformacoesPosto(posto);
            const ordemParada = posto.ordem || index + 1;

            return (
              <section className="bb-station-tabs-card bb-station-details-below bb-trip-stop-details" key={`${posto.nome}-${ordemParada}`}>
                <div className="bb-trip-stop-title">
                  <span>{ordemParada}ª parada</span>
                  <h3>{posto.nome}</h3>
                </div>

                <div className="bb-station-tabs" role="tablist" aria-label={`Detalhes de ${posto.nome}`}>
                  <button
                    type="button"
                    className={abaDetalhesPlanejador === 'conectores' ? 'active' : ''}
                    onClick={() => setAbaDetalhesPlanejador('conectores')}
                  >
                    Conectores
                  </button>
                  <button
                    type="button"
                    className={abaDetalhesPlanejador === 'informacoes' ? 'active' : ''}
                    onClick={() => setAbaDetalhesPlanejador('informacoes')}
                  >
                    Informações
                  </button>
                </div>

                <section className={`bb-info-card bb-connector-card bb-station-tab-panel ${abaDetalhesPlanejador === 'conectores' ? 'active' : ''}`} role="tabpanel">
                  <div className="bb-info-card-head">
                    <span className="bb-info-icon">C</span>
                    <div>
                      <h4>Conectores</h4>
                      <p>{conectorViagem.conectores} conectores · {conectorViagem.carregadores} carregador(es)</p>
                    </div>
                  </div>

                  <div className="bb-connector-network">
                    <span>Rede</span>
                    <strong>{conectorViagem.rede}</strong>
                  </div>

                  <div className="bb-connector-row">
                    <div className="bb-connector-symbol" aria-hidden="true">
                      <span />
                    </div>
                    <strong>{conectorViagem.tipo}</strong>
                    <em>{conectorViagem.conectores} conector(es)</em>
                  </div>
                </section>

                <section className={`bb-info-card bb-station-extra-info bb-station-tab-panel ${abaDetalhesPlanejador === 'informacoes' ? 'active' : ''}`} role="tabpanel">
                  <div className="bb-info-card-head">
                    <span className="bb-info-icon">i</span>
                    <div>
                      <h4>Informações</h4>
                      <p>Dados úteis para decidir sua parada.</p>
                    </div>
                  </div>

                  <div className="bb-info-list">
                    {informacoesPostoViagem.map((item) => (
                      <div className="bb-info-row" key={item.titulo}>
                        <div>
                          <strong>{item.titulo}</strong>
                          {item.destaque && <span className="bb-access-pill">{item.destaque}</span>}
                          {item.chips ? (
                            <div className="bb-chip-list">
                              {item.chips.map((chip) => (
                                <span key={chip}>{chip}</span>
                              ))}
                            </div>
                          ) : (
                            <p>{item.conteudo || 'Informação não disponível'}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
