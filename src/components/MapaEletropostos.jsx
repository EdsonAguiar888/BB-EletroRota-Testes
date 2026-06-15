import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../pages/Mapa.css';


import {
  calcularTempoPosto,
  distanciaKm,
  formatarMinutos,
  numeroDeTexto,
  postosRecarga,
  VELOCIDADE_MEDIA_KMH
} from '../utils/rotaOtimizada';

const postos = postosRecarga;

function criarInformacoesPosto(posto) {
  if (!posto) return [];
  return [
    { titulo: 'Endereço', conteudo: posto.endereco },
    { titulo: 'Comodidades', chips: posto.comodidades || [] },
    { titulo: 'Acesso', destaque: posto.acesso, conteudo: posto.acessoDescricao },
    { titulo: 'Preço para ativar', conteudo: posto.precoAtivacao },
    { titulo: 'Preço por kWh', conteudo: posto.precoKwh },
    { titulo: 'Telefone', conteudo: posto.telefone },
    { titulo: 'Horário de funcionamento', conteudo: posto.horario }
  ];
}

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
<<<<<<< HEAD
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);

=======

  const ultimoPostoNotificadoRef = useRef('');
  const onRotaOtimizadaChangeRef = useRef(onRotaOtimizadaChange);

  useEffect(() => {
    onRotaOtimizadaChangeRef.current = onRotaOtimizadaChange;
  }, [onRotaOtimizadaChange]);

  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
  const [postoSelecionado, setPostoSelecionado] = useState('');
  const [filtroVelocidade, setFiltroVelocidade] = useState('todos');
  const [rotaReal, setRotaReal] = useState(null);
  const [abaDetalhes, setAbaDetalhes] = useState('conectores');

  const origem = useMemo(() => {
<<<<<<< HEAD
    if (localizacaoAtual) {
      return [localizacaoAtual.lat, localizacaoAtual.lng];
    }
    return [-8.0712, -34.8850];
=======
    return localizacaoAtual ? [localizacaoAtual.lat, localizacaoAtual.lng] : [-8.0712, -34.8850];
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
  }, [localizacaoAtual]);

  const origemAtual = useMemo(() => ({
    lat: origem[0],
    lng: origem[1]
  }), [origem]);

  const pontosFiltrados = useMemo(() => {
    if (filtroVelocidade === 'todos') return postos;
    return postos.filter((posto) => numeroDeTexto(posto.potencia) === Number(filtroVelocidade));
  }, [filtroVelocidade]);

  const calcularPostoComOrigemAtual = useCallback((posto) => {
    
    const distanciaAtual = distanciaKm(origemAtual, posto);
<<<<<<< HEAD

=======
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
    return calcularTempoPosto(posto, bateriaUsuario, {
      distanciaKm: distanciaAtual,
      tempoMin: (distanciaAtual / VELOCIDADE_MEDIA_KMH) * 60
    });
  }, [bateriaUsuario, origemAtual]);

  const pontosFiltradosComCalculo = useMemo(() => {
    return pontosFiltrados.map((posto) => ({
      posto,
      calculo: calcularPostoComOrigemAtual(posto)
    }));
  }, [calcularPostoComOrigemAtual, pontosFiltrados]);

  const postoAtual = useMemo(() => {
    if (!postoSelecionado) return null;
    return pontosFiltrados.find((posto) => posto.nome === postoSelecionado) || null;
  }, [pontosFiltrados, postoSelecionado]);

  const rotaSelecionada = useMemo(() => {
    if (!postoAtual) return null;
    const rotaDoPosto = rotaReal?.nome === postoAtual.nome ? rotaReal : null;
    return rotaDoPosto
      ? calcularTempoPosto(postoAtual, batteryValue => bateriaUsuario, rotaDoPosto)
      : calcularPostoComOrigemAtual(postoAtual);
  }, [bateriaUsuario, calcularPostoComOrigemAtual, postoAtual, rotaReal]);

  const rotasOtimizadasFiltradas = useMemo(() => {
<<<<<<< HEAD
    return [...pontosFiltradosComCalculo]
      .sort((a, b) => a.calculo.tempoTotal - b.calculo.tempoTotal);
=======
    return [...pontosFiltradosComCalculo].sort((a, b) => a.calculo.tempoTotal - b.calculo.tempoTotal);
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
  }, [pontosFiltradosComCalculo]);

  const rotaOtimizada = rotasOtimizadasFiltradas[0] || null;

<<<<<<< HEAD
  const economiaMinutos = rotaSelecionada
    ? Math.max(0, rotaSelecionada.tempoTotal - (rotaOtimizada?.calculo.tempoTotal || 0))
    : 0;
=======
  const economyMinutos = useMemo(() => {
    if (!rotaOtimizada) return 0;
    const rotaReferencia = (postoAtual && postoAtual.nome !== rotaOtimizada.posto.nome) ? rotaSelecionada : null;
    const segundaMelhorRota = rotasOtimizadasFiltradas.find((r) => r.posto.nome !== rotaOtimizada.posto.nome);
    const tempoReferencia = rotaReferencia?.tempoTotal || segundaMelhorRota?.calculo.tempoTotal || rotaOtimizada.calculo.tempoTotal;
    
    return Math.max(0, tempoReferencia - rotaOtimizada.calculo.tempoTotal);
  }, [rotaOtimizada, postoAtual, rotaSelecionada, rotasOtimizadasFiltradas]);

  const montarResumoRotaOtimizada = useCallback(() => {
    if (!rotaOtimizada) return null;

    return {
      calculada: true,
      nome: rotaOtimizada.posto.nome,
      conector: rotaOtimizada.posto.conector,
      informacoes: criarInformacoesPosto(rotaOtimizada.posto),
      tempoTotal: formatarMinutos(rotaOtimizada.calculo.tempoTotal),
      economiaMinutos: economyMinutos,
      economia: formatarMinutos(economyMinutos),
      mensagem: economyMinutos > 0
        ? `Você economiza cerca de ${formatarMinutos(economyMinutos)} indo até o posto sugerido.`
        : 'Este é o ponto mais rápido para carregar dentro do filtro selecionado.'
    };
  }, [rotaOtimizada, economyMinutos]);

  const notificarPaiSeguro = useCallback((dadosResumo) => {
    if (!onRotaOtimizadaChangeRef.current) return;
    if (!dadosResumo) {
      onRotaOtimizadaChangeRef.current(null);
      return;
    }

    const assinatura = `${dadosResumo.nome}-${dadosResumo.tempoTotal}-${dadosResumo.calculada}-${bateriaUsuario}`;
    if (ultimoPostoNotificadoRef.current === assinatura) return;
    
    ultimoPostoNotificadoRef.current = assinatura;
    onRotaOtimizadaChangeRef.current(dadosResumo);
  }, [bateriaUsuario]);

  const selecionarRotaOtimizada = useCallback(() => {
    if (!rotaOtimizada?.posto) return;

    setPostoSelecionado(rotaOtimizada.posto.nome);
    const resumo = montarResumoRotaOtimizada();
    notificarPaiSeguro(resumo);
    
    const L = window.L;
    if (L && map.current) {
      const url = `https://router.project-osrm.org/route/v1/driving/${origem[1]},${origem[0]};${rotaOtimizada.posto.lng},${rotaOtimizada.posto.lat}?overview=full&geometries=geojson`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (!data.routes?.[0]) return;
          const rota = data.routes[0];
          const coords = rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

          if (routeLayer.current) map.current.removeLayer(routeLayer.current);

          routeLayer.current = L.polyline(coords, {
            color: '#0038a8',
            weight: 6,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map.current);

          map.current.fitBounds(routeLayer.current.getBounds(), { padding: [45, 45] });

          setRotaReal({
            nome: rotaOtimizada.posto.nome,
            distanciaKm: rota.distance / 1000,
            tempoMin: rota.duration / 60
          });
        }).catch(err => console.error("Erro na rota automatica:", err));
    }
  }, [rotaOtimizada, montarResumoRotaOtimizada, notificarPaiSeguro, origem]);
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8

  const limparRota = useCallback(() => {
    if (routeLayer.current && map.current) {
      map.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }
<<<<<<< HEAD

=======
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
    setRotaReal(null);
    ultimoPostoNotificadoRef.current = '';
  }, []);

  const desenharRota = useCallback(async (posto, forçarNotificacao = false) => {
    const L = window.L;
<<<<<<< HEAD

=======
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
    if (!L || !map.current) return;

    const requestAtual = ++rotaRequestRef.current;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origem[1]},${origem[0]};${posto.lng},${posto.lat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes?.[0] || requestAtual !== rotaRequestRef.current) return;

      const rota = data.routes[0];
      const coords = rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

      if (routeLayer.current) {
        map.current.removeLayer(routeLayer.current);
      }

      routeLayer.current = L.polyline(coords, {
        color: '#0038a8',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map.current);

<<<<<<< HEAD
      map.current.fitBounds(routeLayer.current.getBounds(), {
        padding: [45, 45]
      });
=======
      map.current.fitBounds(routeLayer.current.getBounds(), { padding: [45, 45] });
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8

      setRotaReal({
        nome: posto.nome,
        distanciaKm: rota.distance / 1000,
        tempoMin: rota.duration / 60
      });

      if (forçarNotificacao) {
        const resumo = montarResumoRotaOtimizada();
        if (resumo) notificarPaiSeguro(resumo);
      }
    } catch (error) {
      console.error('Erro ao traçar rota:', error);
    }
  }, [origem, montarResumoRotaOtimizada, notificarPaiSeguro]);

  useEffect(() => {
    const L = window.L;
<<<<<<< HEAD

=======
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
    if (!L || !mapRef.current || map.current) return;

    map.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([-8.0631, -34.8711], 8);

<<<<<<< HEAD
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(map.current);

    L.circleMarker([-8.0712, -34.8850], {
      radius: 9,
      color: '#ffffff',
      weight: 4,
      fillColor: '#0038a8',
      fillOpacity: 1
    }).addTo(map.current).bindPopup('Sua localizacao');
=======
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map.current);
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
<<<<<<< HEAD

          setLocalizacaoAtual({ lat, lng });

          if (userMarkerRef.current) {
            map.current.removeLayer(userMarkerRef.current);
          }
=======
          setLocalizacaoAtual({ lat, lng });

          if (userMarkerRef.current) map.current.removeLayer(userMarkerRef.current);
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8

          userMarkerRef.current = L.circleMarker([lat, lng], {
            radius: 11,
            color: '#ffffff',
            weight: 4,
            fillColor: '#0038a8',
            fillOpacity: 1
<<<<<<< HEAD
          }).addTo(map.current);

          userMarkerRef.current.bindPopup('Sua localizacao atual');
          map.current.setView([lat, lng], 10);
        },
        () => {
          console.log('Geolocalizacao nao permitida.');
        }
=======
          }).addTo(map.current).bindPopup('Sua localização atual');
          map.current.setView([lat, lng], 10);
        },
        () => console.log('Geolocalização não permitida.')
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
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

<<<<<<< HEAD
      marker.bindPopup(`
        <strong>${posto.nome}</strong><br/>
        Potência: ${posto.potencia}<br/>
        Livres: ${posto.livres} de ${posto.total}<br/>
        Espera: ${posto.espera}<br/>
        Distância: ${posto.distancia}
      `);

      marker.on('click', () => {
        setPostoSelecionado(posto.nome);
=======
      marker.bindPopup(`<strong>${posto.nome}</strong><br/>Potência: ${posto.potencia}`);
      marker.on('click', () => {
        setPostoSelecionado(posto.nome);
        setAbaDetalhes('conectores');
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
      });

      return marker;
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
    if (!postoAtual) {
<<<<<<< HEAD
      const id = window.setTimeout(() => {
        limparRota();
      }, 0);

      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      desenharRota(postoAtual);
    }, 0);

    return () => window.clearTimeout(id);
  }, [desenharRota, limparRota, postoAtual]);
=======
      limparRota();
      return;
    }
    desenharRota(postoAtual, true);
  }, [desenharRota, limparRota, postoAtual]);

  useEffect(() => {
    if (!rotaOtimizadaSolicitada || !rotaOtimizada) return;
    selecionarRotaOtimizada();
  }, [rotaOtimizadaSolicitada, rotaOtimizada, selecionarRotaOtimizada]);
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8

  const selecionarPosto = (nome) => {
    setPostoSelecionado(nome);
    setAbaDetalhes('conectores');
<<<<<<< HEAD
    onRotaOtimizadaChange?.(null);
=======
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
  };

  const alterarFiltroVelocidade = (valor) => {
    setFiltroVelocidade(valor);
    setPostoSelecionado('');
    limparRota();
<<<<<<< HEAD
    onRotaOtimizadaChange?.(null);
  };

  const montarResumoRotaOtimizada = useCallback(() => {
    if (!rotaOtimizada) return null;

    const rotaReferencia = postoAtual?.nome !== rotaOtimizada.posto.nome
      ? rotaSelecionada
      : null;
    const segundaMelhorRota = rotasOtimizadasFiltradas.find((rota) => rota.posto.nome !== rotaOtimizada.posto.nome);
    const tempoReferencia = rotaReferencia?.tempoTotal || segundaMelhorRota?.calculo.tempoTotal || rotaOtimizada.calculo.tempoTotal;
    const economiaCalculada = Math.max(0, tempoReferencia - rotaOtimizada.calculo.tempoTotal);

    return {
      calculada: true,
      nome: rotaOtimizada.posto.nome,
      conector: rotaOtimizada.posto.conector,
      informacoes: criarInformacoesPosto(rotaOtimizada.posto),
      tempoTotal: formatarMinutos(rotaOtimizada.calculo.tempoTotal),
      economiaMinutos: economiaCalculada,
      economia: formatarMinutos(economiaCalculada),
      mensagem: economiaCalculada > 0
        ? `Você economiza cerca de ${formatarMinutos(economiaCalculada)} indo até o posto sugerido.`
        : 'Este é o ponto mais rápido para carregar dentro do filtro selecionado.'
    };
  }, [postoAtual, rotaOtimizada, rotaSelecionada, rotasOtimizadasFiltradas]);

  const selecionarRotaOtimizada = useCallback(() => {
    if (!rotaOtimizada?.posto) return;

    setPostoSelecionado(rotaOtimizada.posto.nome);
    onRotaOtimizadaChange?.(montarResumoRotaOtimizada());
    desenharRota(rotaOtimizada.posto);
  }, [desenharRota, montarResumoRotaOtimizada, onRotaOtimizadaChange, rotaOtimizada]);

  useEffect(() => {
    if (!onRotaOtimizadaChange || !rotaOtimizada) return;

    onRotaOtimizadaChange({
      nome: rotaOtimizada.posto.nome,
      tempoTotal: formatarMinutos(rotaOtimizada.calculo.tempoTotal),
      economiaMinutos,
      economia: formatarMinutos(economiaMinutos),
      mensagem: economiaMinutos > 0
        ? `Você economiza cerca de ${formatarMinutos(economiaMinutos)} usando esta rota.`
        : postoAtual
          ? 'Este já é o ponto mais rápido para carregar agora.'
          : 'Este é o ponto mais rápido para carregar agora.'
    });
  }, [economiaMinutos, onRotaOtimizadaChange, postoAtual, rotaOtimizada]);

  useEffect(() => {
    if (!rotaOtimizadaSolicitada) return;
    const id = window.setTimeout(() => {
      selecionarRotaOtimizada();
    }, 0);

    return () => window.clearTimeout(id);
  }, [rotaOtimizadaSolicitada, selecionarRotaOtimizada]);

  const informacoesPosto = postoAtual ? [
    {
      titulo: 'Endereço',
      conteudo: postoAtual.endereco
    },
    {
      titulo: 'Comodidades',
      chips: postoAtual.comodidades || []
    },
    {
      titulo: 'Acesso',
      destaque: postoAtual.acesso,
      conteudo: postoAtual.acessoDescricao
    },
    {
      titulo: 'Preço para ativar',
      conteudo: postoAtual.precoAtivacao
    },
    {
      titulo: 'Preço por kWh',
      conteudo: postoAtual.precoKwh
    },
    {
      titulo: 'Telefone',
      conteudo: postoAtual.telefone
    },
    {
      titulo: 'Horário de funcionamento',
      conteudo: postoAtual.horario
    }
  ] : [];

=======
    notificarPaiSeguro(null);
  };

  const informacoesPosto = useMemo(() => criarInformacoesPosto(postoAtual), [postoAtual]);
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
  const conectorAtual = postoAtual?.conector || {};

  return (
    <div className="bb-map-column">
      <section className="bb-map-card">
<<<<<<< HEAD
      <div className="bb-map-head">
        <h2>Otimizador de rota</h2>

        <div className="bb-map-controls">
          <select
            className="bb-search"
            value={filtroVelocidade}
            onChange={(e) => alterarFiltroVelocidade(e.target.value)}
            aria-label="Filtrar por velocidade de carregamento"
          >
            <option value="todos">Todas as velocidades</option>
            <option value="150">Carregamento rapido - 150 kW</option>
            <option value="50">Carregamento medio - 50 kW</option>
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

            {pontosFiltradosComCalculo.map(({ posto, calculo }) => {
              return (
=======
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
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
                <button
                  type="button"
                  key={posto.nome}
                  className={posto.nome === postoAtual?.nome ? 'bb-point-button active' : 'bb-point-button'}
                  onClick={() => selecionarPosto(posto.nome)}
                >
                  <strong>{posto.nome}</strong>
                  <span>{posto.potencia} - {calculo.distanciaKm.toFixed(1).replace('.', ',')} km - {posto.livres}/{posto.total} livres - {formatarMinutos(calculo.tempoTotal)}</span>
                </button>
<<<<<<< HEAD
              );
            })}
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
                Tempo até o posto: {formatarMinutos(rotaSelecionada.tempoDeslocamento)}<br />
                Tempo para carregar: {formatarMinutos(rotaSelecionada.tempoCarga)}<br />
                Bateria atual: {bateriaUsuario}%
              </p>

              <section className="bb-station-tabs-card">
                <div className="bb-station-tabs" role="tablist" aria-label="Detalhes do eletroposto">
                  <button
                    type="button"
                    className={abaDetalhes === 'conectores' ? 'active' : ''}
                    onClick={() => setAbaDetalhes('conectores')}
                  >
                    Conectores
                  </button>
                  <button
                    type="button"
                    className={abaDetalhes === 'informacoes' ? 'active' : ''}
                    onClick={() => setAbaDetalhes('informacoes')}
                  >
                    Informações
                  </button>
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

      {postoAtual && rotaSelecionada && (
        <section className="bb-station-tabs-card bb-station-details-below">
          <div className="bb-station-tabs" role="tablist" aria-label="Detalhes do eletroposto">
            <button
              type="button"
              className={abaDetalhes === 'conectores' ? 'active' : ''}
              onClick={() => setAbaDetalhes('conectores')}
            >
              Conectores
            </button>
            <button
              type="button"
              className={abaDetalhes === 'informacoes' ? 'active' : ''}
              onClick={() => setAbaDetalhes('informacoes')}
            >
              Informações
            </button>
          </div>

          <section className={`bb-info-card bb-connector-card bb-station-tab-panel ${abaDetalhes === 'conectores' ? 'active' : ''}`} role="tabpanel">
=======
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
                  Tempo até o posto: {formatarMinutos(rotaSelecionada.tempoDeslocamento)}<br />
                  Tempo para carregar: {formatarMinutos(rotaSelecionada.tempoCarga)}<br />
                  Bateria atual: {bateriaUsuario}%
                </p>

                <section className="bb-station-tabs-card">
                  <div className="bb-station-tabs" role="tablist">
                    <button type="button" className={abaDetalhes === 'conectores' ? 'active' : ''} onClick={() => setAbaDetalhes('conectores')}>Conectores</button>
                    <button type="button" className={abaDetalhes === 'informacoes' ? 'active' : ''} onClick={() => setAbaDetalhes('informacoes')}>Informações</button>
                  </div>

                  <section className={`bb-info-card bb-connector-card bb-station-tab-panel ${abaDetalhes === 'conectores' ? 'active' : ''}`}>
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
                      <div className="bb-connector-symbol"><span /></div>
                      <strong>{conectorAtual.tipo}</strong>
                      <em>{conectorAtual.conectores} conector(es)</em>
                    </div>
                  </section>

                  <section className={`bb-info-card bb-station-extra-info bb-station-tab-panel ${abaDetalhes === 'informacoes' ? 'active' : ''}`}>
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
                                {item.chips.map((chip) => <span key={chip}>{chip}</span>)}
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

      {/* Bloco responsivo inferior móvel - CORRIGIDO: setAbaDetalhes perfeitamente mapeado */}
      {postoAtual && rotaSelecionada && (
        <section className="bb-station-tabs-card bb-station-details-below">
          <div className="bb-station-tabs" role="tablist">
            <button type="button" className={abaDetalhes === 'conectores' ? 'active' : ''} onClick={() => setAbaDetalhes('conectores')}>Conectores</button>
            <button type="button" className={abaDetalhes === 'informacoes' ? 'active' : ''} onClick={() => setAbaDetalhes('informacoes')}>Informações</button>
          </div>

          <section className={`bb-info-card bb-connector-card bb-station-tab-panel ${abaDetalhes === 'conectores' ? 'active' : ''}`}>
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
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
<<<<<<< HEAD
              <div className="bb-connector-symbol" aria-hidden="true">
                <span />
              </div>
=======
              <div className="bb-connector-symbol"><span /></div>
>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
              <strong>{conectorAtual.tipo}</strong>
              <em>{conectorAtual.conectores} conector(es)</em>
            </div>
          </section>

          <section className={`bb-info-card bb-station-extra-info bb-station-tab-panel ${abaDetalhes === 'informacoes' ? 'active' : ''}`}>
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
                        {item.chips.map((chip) => <span key={chip}>{chip}</span>)}
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
<<<<<<< HEAD
=======

>>>>>>> 8a503452e9a64281b8103ecb869f6af8d429d9a8
