import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroEletroRota from '../components/HeroEletroRota';
import MapaEletropostos from '../components/MapaEletropostos';
import '../styles/bbEletroRota.css';

function numeroSeguro(valor, padrao) {
  const numero = Number(String(valor ?? '').replace(',', '.').match(/\d+(\.\d+)?/)?.[0]);
  return Number.isFinite(numero) && numero >= 0 ? numero : padrao;
}

function normalizarVeiculos(usuario) {
  const lista = Array.isArray(usuario?.veiculos) ? usuario.veiculos : [];
  const veiculoAtivo = usuario?.veiculo ? [usuario.veiculo] : [];
  const vistos = new Set();

  return [...lista, ...veiculoAtivo].filter((veiculo, index) => {
    if (!veiculo) return false;

    const chave = veiculo.idVeiculo || `${veiculo.marca || 'veiculo'}-${veiculo.potencia || ''}-${veiculo.bateriaAtual || ''}-${index}`;
    if (vistos.has(chave)) return false;

    vistos.add(chave);
    return true;
  });
}

function criarRotuloVeiculo(veiculo, index) {
  const nome = veiculo?.marca || `Veículo ${index + 1}`;
  const potencia = veiculo?.potencia ? ` - ${veiculo.potencia} kW` : '';
  const bateria = veiculo?.bateriaAtual ? ` - ${veiculo.bateriaAtual}%` : '';

  return `${nome}${potencia}${bateria}`;
}

export default function Mapa() {
  const usuarioInicial = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  const [usuarioSalvo, setUsuarioSalvo] = useState(usuarioInicial);
  const veiculos = useMemo(() => normalizarVeiculos(usuarioSalvo), [usuarioSalvo]);
  const [veiculoSelecionadoIndex, setVeiculoSelecionadoIndex] = useState(0);
  const veiculoSelecionado = veiculos[veiculoSelecionadoIndex] || veiculos[0] || usuarioSalvo?.veiculo || null;
  const bateriaInicial = numeroSeguro(veiculoSelecionado?.bateriaAtual, 65);
  const [bateria, setBateria] = useState(bateriaInicial);
  const [rotaOtimizada, setRotaOtimizada] = useState(null);
  const [rotaOtimizadaSolicitada, setRotaOtimizadaSolicitada] = useState(0);
  const modelo = usuarioSalvo?.veiculo?.marca || 'Veículo elétrico cadastrado';
  const autonomiaTotal = numeroSeguro(veiculoSelecionado?.autonomia || veiculoSelecionado?.potencia, 300);
  const autonomiaDisponivel = Math.round((Number(autonomiaTotal) * Number(bateria)) / 100);

  useEffect(() => {
    const idUsuario = usuarioInicial?.id;
    if (!idUsuario) return;

    const apiLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const apiUrl = apiLocal
      ? 'http://localhost:3000/usuarios'
      : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios';

    fetch(`${apiUrl}/${idUsuario}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((dadosAtualizados) => {
        if (!dadosAtualizados) return;

        const veiculosAtualizados = normalizarVeiculos(dadosAtualizados);
        const usuarioAtualizado = { ...dadosAtualizados, veiculos: veiculosAtualizados };

        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        setUsuarioSalvo(usuarioAtualizado);
      })
      .catch(() => {});
  }, [usuarioInicial?.id]);

  useEffect(() => {
    if (veiculoSelecionadoIndex < veiculos.length) return;

    setVeiculoSelecionadoIndex(0);
  }, [veiculoSelecionadoIndex, veiculos.length]);

  useEffect(() => {
    if (!veiculoSelecionado) return;

    setBateria(numeroSeguro(veiculoSelecionado.bateriaAtual, 65));
  }, [veiculoSelecionado?.idVeiculo, veiculoSelecionado?.marca, veiculoSelecionado?.bateriaAtual]);

  const atualizarRotaOtimizada = useCallback((dados) => {
    if (dados === null) {
      setRotaOtimizada(null);
      return;
    }

    if (!dados?.calculada) return;

    setRotaOtimizada(dados);
  }, []);

  const atualizarBateria = (valor) => {
    setBateria(valor);
    setRotaOtimizada(null);
  };

  const selecionarVeiculo = (indice) => {
    const novoIndice = Number(indice);
    const novoVeiculo = veiculos[novoIndice];

    setVeiculoSelecionadoIndex(novoIndice);
    setBateria(numeroSeguro(novoVeiculo?.bateriaAtual, 65));
    setRotaOtimizada(null);
  };

  return (
    <div className="bb-page">
      <HeroEletroRota />

      <nav className="bb-tabs-nav">
        <Link className="active" to="/otimizador">Otimizador de rota</Link>
        <Link to="/planejador">Planejador de viagem</Link>
        <Link to="/calculadora">Calculadora de autonomia</Link>
      </nav>

      <main className="bb-main">
        <aside className="bb-sidebar">
          <section className="bb-card bb-route-ready-card">
            <div className="bb-card-body">
              <span className="bb-badge">Localização atual</span>
              <h3>Rota otimizada pronta</h3>
              <p>Use sua localização atual para comparar distância, fila, velocidade de carregamento e bateria.</p>
              <button
                className="bb-yellow-action"
                type="button"
                onClick={() => setRotaOtimizadaSolicitada((valor) => valor + 1)}
              >
                Calcular rota otimizada
              </button>
            </div>
          </section>

          <section className="bb-card bb-optimized-card">
            <div className="bb-card-header">
              <h2 className="bb-card-title">Rota otimizada</h2>
            </div>

            {rotaOtimizada ? (
              <div className="bb-card-body">
                <p className="bb-optimized-text"><strong>{rotaOtimizada.nome}</strong></p>
                {rotaOtimizada.calculada && (
                  <>
                    <p className="bb-optimized-text">Tempo total estimado: {rotaOtimizada.tempoTotal}</p>
                    <p className="bb-optimized-text">Economia estimada: {rotaOtimizada.economia}</p>
                    <p className="bb-optimized-text">{rotaOtimizada.mensagem}</p>

                    <button
                      className="bb-yellow-action"
                      type="button"
                      onClick={() => setRotaOtimizadaSolicitada((valor) => valor + 1)}
                    >
                      Usar rota otimizada
                    </button>
                  </>
                )}

              </div>
            ) : (
              <div className="bb-card-body bb-optimized-empty" aria-hidden="true" />
            )}
          </section>

          <section className="bb-card bb-vehicle-card">
            <div className="bb-card-header">
              <h2 className="bb-card-title">Meu Veículo</h2>
            </div>

            <div className="bb-mini-tabs"><span className="active">Veículo cadastrado</span></div>

            <div className="bb-card-body">
              <div className="bb-field">
                <label className="bb-label">Meu carro</label>
                <select className="bb-select" value={veiculoSelecionadoIndex} onChange={(e) => selecionarVeiculo(e.target.value)}>
                  {veiculos.length > 0 ? (
                    veiculos.map((veiculo, index) => (
                      <option key={veiculo.idVeiculo || `${veiculo.marca}-${index}`} value={index}>
                        {criarRotuloVeiculo(veiculo, index)}
                      </option>
                    ))
                  ) : (
                    <option value={0}>{modelo}</option>
                  )}
                </select>
              </div>

              <label className="bb-label">Bateria atual</label>
              <div className="bb-battery">{bateria}%</div>

              <div className="bb-range-row">
                <input type="range" min="0" max="100" value={bateria} onChange={(e) => atualizarBateria(e.target.value)} />
                <strong>{bateria}%</strong>
              </div>

              <div className="bb-progress">
                <div className="bb-progress-fill" style={{ width: `${bateria}%` }} />
              </div>

              <p style={{ color: '#5c6f8f', fontSize: 13 }}>
                Autonomia disponível no mapa: {autonomiaDisponivel} km.
              </p>

              <Link className="bb-link" to="/gerenciar">
                Gerenciar veículo
              </Link>
            </div>
          </section>

        </aside>

        <MapaEletropostos
          bateriaUsuario={bateria}
          onRotaOtimizadaChange={atualizarRotaOtimizada}
          rotaOtimizadaSolicitada={rotaOtimizadaSolicitada}
        />
      </main>
    </div>
  );
}
