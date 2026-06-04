







import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../styles/bbEletroRota.css';
import {
  calcularTempoPosto,
  distanciaKm,
  formatarMinutos,
  numeroDeTexto,
  postosRecarga,
  VELOCIDADE_MEDIA_KMH
} from '../utils/rotaOtimizada';

const postos = postosRecarga;

export default function MapaEletropostos({
  bateriaUsuario = 65,
  onRotaOtimizadaChange,
  rotaOtimizadaSolicitada = 0
}) {
  const mapRef = useRef(null);
  const map = useRef(null);
  const routeLayer = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const rotaRequestRef = useRef(0);
  
  // Guardas de estado para travar o loop de renderização do Pai
  const ultimoPostoNotificadoRef = useRef('');
  const onRotaOtimizadaChangeRef = useRef(onRotaOtimizadaChange);

  // Sincroniza a ref da prop para evitar stale closures sem disparar o useEffect
  useEffect(() => {
    onRotaOtimizadaChangeRef.current = onRotaOtimizadaChange;
  }, [onRotaOtimizadaChange]);

  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [postoSelecionado, setPostoSelecionado] = useState('');
  const [filtroVelocidade, setFiltroVelocidade] = useState('todos');
  const [abaDetalhes, setAbaDetalhes] = useState('conectores');
  const [, setForçarRender] = useState(0);

  const origem = useMemo(() => {
    return localizacaoAtual ? [localizacaoAtual.lat, localizacaoAtual.lng] : [-8.0712, -34.8850];
  }, [localizacaoAtual]);

  const origemAtual = useMemo(() => ({
    lat: origem[0],
    lng: origem[1]
  }), [origem]);

  const pointsFiltered = useMemo(() => {
    if (filtroVelocidade === 'todos') return postos;
    return postos.filter((posto) => numeroDeTexto(posto.potencia) === Number(filtroVelocidade));
  }, [filtroVelocidade]);

  const calcularPostoComOrigemAtual = useCallback((posto) => {
    const distanciaAtual = distanciaKm(origemAtual, posto);
    return calcularTempoPosto(posto, () => bateriaUsuario, {
      distanciaKm: distanciaAtual,
      tempoMin: (distanciaAtual / VELOCIDADE_MEDIA_KMH) * 60
    });
  }, [bateriaUsuario, origemAtual]);

  const pontosFiltradosComCalculo = useMemo(() => {
    return pointsFiltered.map((posto) => ({
      posto,
      calculo: calcularPostoComOrigemAtual(posto)
    }));
  }, [calcularPostoComOrigemAtual, pointsFiltered]);

  const postoAtual = useMemo(() => {
    if (!postoSelecionado) return null;
    return pointsFiltered.find((posto) => posto.nome === postoSelecionado) || null;
  }, [pointsFiltered, postoSelecionado]);

  const rotasOtimizadasFiltradas = useMemo(() => {
    return [...pontosFiltradosComCalculo].sort((a, b) => a.calculo.tempoTotal - b.calculo.tempoTotal);
  }, [pontosFiltradosComCalculo]);

  const rotaOtimizada = rotasOtimizadasFiltradas[0] || null;

  // Trava de segurança definitiva baseada em string primitiva gerada pelo cálculo
  const notificarPaiSobreRota = useCallback((postoAlvo, dadosCalculo) => {
    if (!onRotaOtimizadaChangeRef.current || !dadosCalculo) return;

    const tempoMaisRapido = rotaOtimizada?.calculo.tempoTotal || dadosCalculo.tempoTotal;
    const economiaCalculada = Math.max(0, dadosCalculo.tempoTotal - tempoMaisRapido);

    const tempoTotalFormatado = formatarMinutos(dadosCalculo.tempoTotal);
    const economiaFormatada = formatarMinutos(economiaCalculada);

    // Cria uma assinatura única do estado atual da rota baseada em valores primitivos
    const assinaturaRota = `${postoAlvo.nome}-${tempoTotalFormatado}-${economiaFormatada}-${bateriaUsuario}`;

    // Se os dados resultantes forem estritamente idênticos aos últimos enviados, aborta para bloquear o loop
    if (ultimoPostoNotificadoRef.current === assinaturaRota) {
      return;
    }

    ultimoPostoNotificadoRef.current = assinaturaRota;

    onRotaOtimizadaChangeRef.current({
      nome: postoAlvo.nome,
      tempoTotal: tempoTotalFormatado,
      economiaMinutos: economiaCalculada,
      economia: economiaFormatada,
      mensagem: economiaCalculada > 0
        ? `Você economiza cerca de ${economiaFormatada} usando a rota recomendada.`
        : 'Este é o ponto mais rápido para carregar agora.'
    });
  }, [rotaOtimizada, bateriaUsuario]);

  const limparRota = useCallback(() => {
    if (routeLayer.current && map.current) {
      map.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }
    ultimoPostoNotificadoRef.current = '';
    setForçarRender(prev => prev + 1);
  }, []);

  const desenharRota = useCallback(async (posto, forçarNotificacaoPai = false) => {
    const L = window.L;
    if (!L || !map.current) return;

    const requestAtual = ++rotaRequestRef.current;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origem[1]},${origem[0]};${posto.lng},${posto.lat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes?.[0] || requestAtual !== rotaRequestRef.current) return;

      const rota = data.routes[0];
      const coords = rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

      if (routeLayer.current && map.current) {
        map.current.removeLayer(routeLayer.current);
      }

      routeLayer.current = L.polyline(coords, {
        color: '#0038a8',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map.current);

      map.current.fitBounds(routeLayer.current.getBounds(), { padding: [45, 45] });

      const dadosRotaOSRM = {
        nome: posto.nome,
        distanciaKm: rota.distance / 1000,
        tempoMin: rota.duration / 60
      };

      const calculoFinalCompleto = calcularTempoPosto(posto, bateriaUsuario, dadosRotaOSRM);

      if (forçarNotificacaoPai) {
        notificarPaiSobreRota(posto, calculoFinalCompleto);
      }

      setForçarRender(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao traçar rota OSRM:', error);
    }
  }, [origem, bateriaUsuario, notificarPaiSobreRota]);

  useEffect(() => {
    const L = window.L;
    if (!L || !mapRef.current || map.current) return;

    map.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([-8.0631, -34.8711], 8);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map.current);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocalizacaoAtual({ lat, lng });

          if (userMarkerRef.current && map.current) map.current.removeLayer(userMarkerRef.current);

          userMarkerRef.current = L.circleMarker([lat, lng], {
            radius: 11,
            color: '#ffffff',
            weight: 4,
            fillColor: '#0038a8',
            fillOpacity: 1
          }).addTo(map.current).bindPopup('Sua localização atual');
          map.current.setView([lat, lng], 10);
        },
        () => console.log('Geolocalização recusada.')
      );
    }

    markersRef.current = postos.map((posto) => {
      const marker = L.circleMarker([posto.lat, posto.lng], {
        radius: 12,
        color: '#ffffff',
        weight: 4,
        fillColor: posto.cor,
        fillOpacity: 1
      }).addTo(map.current);

      marker.bindPopup(`<strong>${posto.nome}</strong><br/>Potência: ${posto.potencia}`);
      marker.on('click', () => {
        setPostoSelecionado(posto.nome);
        setAbaDetalhes('conectores');
      });

      return marker;
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Monitora alterações de seleção para traçar rota e notificar
  useEffect(() => {
    if (!map.current) return;
    if (!postoAtual) {
      limparRota();
      return;
    }
    desenharRota(postoAtual, true);
  }, [postoAtual, desenharRota, limparRota]);

  // Monitora solicitações vindas do botão de ação externa do Pai
  useEffect(() => {
    if (!rotaOtimizadaSolicitada || !rotaOtimizada) return;
    setPostoSelecionado(rotaOtimizada.posto.nome);
    desenharRota(rotaOtimizada.posto, true);
  }, [rotaOtimizadaSolicitada, rotaOtimizada, desenharRota]);

  const selecionarPosto = (nome) => {
    setPostoSelecionado(nome);
    setAbaDetalhes('conectores');
  };

  const alterarFiltroVelocidade = (valor) => {
    setFiltroVelocidade(valor);
    setPostoSelecionado('');
    limparRota();
    ultimoPostoNotificadoRef.current = '';
    onRotaOtimizadaChangeRef.current?.(null);
  };

  const informacoesPosto = postoAtual ? [
    { titulo: 'Endereço', conteudo: postoAtual.endereco },
    { titulo: 'Comodidades', chips: postoAtual.comodidades || [] },
    { titulo: 'Acesso', destaque: postoAtual.acesso, conteudo: postoAtual.acessoDescricao },
    { titulo: 'Preço para ativar', conteudo: postoAtual.precoAtivacao },
    { titulo: 'Preço por kWh', conteudo: postoAtual.precoKwh },
    { titulo: 'Telefone', conteudo: postoAtual.telefone },
    { titulo: 'Horário de funcionamento', conteudo: postoAtual.horario }
  ] : [];

  const conectorAtual = postoAtual?.conector || {};
  const rotaSelecionada = postoAtual ? calcularPostoComOrigemAtual(postoAtual) : null;

  return (
    <div className="bb-map-column">
      <section className="bb-map-card">
        <div className="bb-map-head">
          <h2>Otimizador de rota</h2>
          <div className="bb-map-controls">
            <select
              className="bb-search"
              value={filtroVelocidade}
              onChange={(e) => alterarFiltroVelocidade(e.target.value)}
            >
              <option value="todos">Todas as velocidades</option>
              <option value="150">Carregamento rápido - 150 kW</option>
              <option value="50">Carregamento médio - 50 kW</option>
              <option value="22">Carregamento lento - 22 kW</option>
            </select>
          </div>
        </div>

        <div className="bb-map-options">
          <div className="bb-field">
            <label className="bb-label">Escolher ponto de recarga</label>
            <select
              className="bb-select"
              value={postoAtual?.nome || ''}
              onChange={(e) => selecionarPosto(e.target.value)}
            >
              <option value="">Selecione um ponto de recarga</option>
              {pontosFiltradosComCalculo.map(({ posto, calculo }) => (
                <option key={posto.nome} value={posto.nome}>
                  {posto.nome} - {posto.potencia} - {calculo.distanciaKm.toFixed(1).replace('.', ',')} km
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bb-map-layout">
          <div className="bb-map-area">
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </div>

          <aside className={postoAtual ? 'bb-route-info' : 'bb-route-info bb-route-info-list-only'}>
            <div className="bb-points-list bb-points-list-top">
              <h4>Todos os pontos de recarga</h4>
              {pontosFiltradosComCalculo.map(({ posto, calculo }) => (
                <button
                  type="button"
                  key={posto.nome}
                  className={posto.nome === postoAtual?.nome ? 'bb-point-button active' : 'bb-point-button'}
                  onClick={() => selecionarPosto(posto.nome)}
                >
                  <strong>{posto.nome}</strong>
                  <span>{posto.potencia} - {calculo.distanciaKm.toFixed(1).replace('.', ',')} km - {posto.livres}/{posto.total} livres - {formatarMinutos(calculo.tempoTotal)}</span>
                </button>
              ))}
            </div>

            {postoAtual && rotaSelecionada ? (
              <div className="bb-station-details">
                <span className="bb-badge">Selecionado</span>
                <h3>{postoAtual.nome}</h3>
                <p>
                  Potência: {postoAtual.potencia}<br />
                  Carregadores livres: {postoAtual.livres} de {postoAtual.total}<br />
                  Fila estimada: {formatarMinutos(rotaSelecionada.tempoFila)}<br />
                  Carros considerados na fila: {rotaSelecionada.carrosNaFila}<br />
                  Distância aproximada: {rotaSelecionada.distanciaKm.toFixed(1).replace('.', ',')} km<br />
                  Tempo até o posto: {formatarMinutos(rotaSelecionada.tempoDeslocamento || rotaSelecionada.tempoTotal)}<br />
                  Tempo para carregar: {formatarMinutos(rotaSelecionada.tempoCarga)}<br />
                  Bateria atual: {bateriaUsuario}%
                </p>

                <section className="bb-station-tabs-card">
                  <div className="bb-station-tabs" role="tablist" aria-label="Detalhes do eletroposto">
                    <button type="button" className={abaDetalhes === 'conectores' ? 'active' : ''} onClick={() => setAbaDetalhes('conectores')}>Conectores</button>
                    <button type="button" className={abaDetalhes === 'informacoes' ? 'active' : ''} onClick={() => setAbaDetalhes('informacoes')}>Informações</button>
                  </div>

                  <section className={`bb-info-card bb-connector-card bb-station-tab-panel ${abaDetalhes === 'conectores' ? 'active' : ''}`} role="tabpanel">
                    <div className="bb-info-card-head">
                      <span className="bb-info-icon">C</span>
                      <div>
                        <h4>Conectores</h4>
                        <p>{conectorAtual.conectores} conectores · {conectorAtual.carregadores} carregador(es)</p>
                      </div>
                    </div>
                    <div className="bb-connector-network">
                      <span>Rede</span>
                      <strong>{conectorAtual.rede}</strong>
                    </div>
                    <div className="bb-connector-row">
                      <div className="bb-connector-symbol" aria-hidden="true">
                        <span />
                      </div>
                      <strong>{conectorAtual.tipo}</strong>
                      <em>{conectorAtual.conectores} conector(es)</em>
                    </div>
                  </section>

                  <section className={`bb-info-card bb-station-extra-info bb-station-tab-panel ${abaDetalhes === 'informacoes' ? 'active' : ''}`} role="tabpanel">
                    <div className="bb-info-card-head">
                      <span className="bb-info-icon">i</span>
                      <div>
                        <h4>Informações</h4>
                        <p>Dados úteis para decidir sua parada.</p>
                      </div>
                    </div>
                    <div className="bb-info-list">
                      {informacoesPosto.map((item) => (
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
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* Bloco condicional inferior para layouts responsivos móveis */}
      {postoAtual && rotaSelecionada && (
        <section className="bb-station-tabs-card bb-station-details-below">
          <div className="bb-station-tabs" role="tablist" aria-label="Detalhes do eletroposto">
            <button type="button" className={abaDetalhes === 'conectores' ? 'active' : ''} onClick={() => setAbaDetalhes('conectores')}>Conectores</button>
            <button type="button" className={abaDetalhes === 'informacoes' ? 'active' : ''} onClick={() => setAbaDetalhes('informacoes')}>Informações</button>
          </div>

          <section className={`bb-info-card bb-connector-card bb-station-tab-panel ${abaDetalhes === 'conectores' ? 'active' : ''}`} role="tabpanel">
            <div className="bb-info-card-head">
              <span className="bb-info-icon">C</span>
              <div>
                <h4>Conectores</h4>
                <p>{conectorAtual.conectores} conectores · {conectorAtual.carregadores} carregador(es)</p>
              </div>
            </div>
            <div className="bb-connector-network">
              <span>Rede</span>
              <strong>{conectorAtual.rede}</strong>
            </div>
            <div className="bb-connector-row">
              <div className="bb-connector-symbol" aria-hidden="true">
                <span />
              </div>
              return <strong>{conectorAtual.tipo}</strong>
              <em>{conectorAtual.conectores} conector(es)</em>
            </div>
          </section>

          <section className={`bb-info-card bb-station-extra-info bb-station-tab-panel ${abaDetalhes === 'informacoes' ? 'active' : ''}`} role="tabpanel">
            <div className="bb-info-card-head">
              <span className="bb-info-icon">i</span>
              <div>
                <h4>Informações</h4>
                <p>Dados úteis para decidir sua parada.</p>
              </div>
            </div>
            <div className="bb-info-list">
              {informacoesPosto.map((item) => (
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
      )}
    </div>
  );
} 
