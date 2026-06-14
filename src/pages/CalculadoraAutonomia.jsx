import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroEletroRota from '../components/HeroEletroRota';
import './Mapa.css';

function numeroSeguro(valor, padrao) {
  const numero = Number(String(valor ?? '').replace(',', '.').match(/\d+(\.\d+)?/)?.[0]);
  return Number.isFinite(numero) && numero > 0 ? numero : padrao;
}

function formatarDecimal(valor, casas = 1) {
  return Number(valor).toFixed(casas).replace('.', ',');
}

export default function CalculadoraAutonomia() {
  
  const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  const veiculo = usuarioSalvo?.veiculo || {};
  const bateriaInicial = Math.min(100, Math.max(10, numeroSeguro(veiculo.bateriaAtual, 53)));

  const [capacidade, setCapacidade] = useState(70);
  const [bateria, setBateria] = useState(bateriaInicial);
  const [consumo, setConsumo] = useState(17.5);
  const [fatorCondicao, setFatorCondicao] = useState(100);

  const energiaDisponivel = useMemo(() => {
    return (Number(capacidade) * Number(bateria)) / 100;
  }, [capacidade, bateria]);

  const autonomiaEstimada = useMemo(() => {
    const autonomiaBase = consumo > 0 ? (energiaDisponivel / Number(consumo)) * 100 : 0;
    return Math.round(autonomiaBase * (Number(fatorCondicao) / 100));
  }, [energiaDisponivel, consumo, fatorCondicao]);

  const progressoAutonomia = Math.min(100, (autonomiaEstimada / 700) * 100);


  // Estabiliza a pagina na altura dos botoes
  window.scrollTo({ top: 480, behavior: 'smooth' });
  return (
    <div className="bb-page">
      <HeroEletroRota />

      <nav className="bb-tabs-nav">
        <Link to="/otimizador">Otimizador de rota</Link>
        <Link to="/planejador">Planejador de viagem</Link>
        <Link className="active" to="/calculadora">Calculadora de autonomia</Link>
      </nav>

      <main className="bb-calculator-shell">
        <section className="bb-autonomy-panel">
          <div className="bb-autonomy-header">
            <h1>Calculadora de Autonomia</h1>
            <p>Calcule até onde você pode chegar.</p>
          </div>

          <div className="bb-autonomy-metrics">
            <div>
              <span>Autonomia estimada</span>
              <strong>{autonomiaEstimada} km</strong>
            </div>

            <div>
              <span>Energia disponível</span>
              <strong>{formatarDecimal(energiaDisponivel)} kWh</strong>
            </div>

            <div>
              <span>Consumo por 100 km</span>
              <strong>{formatarDecimal(consumo)} kWh</strong>
            </div>
          </div>

          <div className="bb-autonomy-controls">
            <div className="bb-autonomy-control">
              <div className="bb-autonomy-control-head">
                <span>Capacidade da bateria</span>
                <strong>{capacidade} kWh</strong>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
              />
              <div className="bb-autonomy-scale">
                <span>20 kWh</span>
                <span>150 kWh</span>
              </div>
            </div>

            <div className="bb-autonomy-control">
              <div className="bb-autonomy-control-head">
                <span>Nível de carga atual</span>
                <strong>{bateria}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={bateria}
                onChange={(e) => setBateria(e.target.value)}
              />
              <div className="bb-autonomy-scale">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="bb-autonomy-control">
              <div className="bb-autonomy-control-head">
                <span>Consumo médio</span>
                <strong>{formatarDecimal(consumo)} kWh/100 km</strong>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="0.5"
                value={consumo}
                onChange={(e) => setConsumo(e.target.value)}
              />
              <div className="bb-autonomy-scale">
                <span>10 kWh/100 km (eficiente)</span>
                <span>35 kWh/100 km (alto)</span>
              </div>
            </div>

            <div className="bb-autonomy-control">
              <div className="bb-autonomy-control-head">
                <span>Fator de condição</span>
                <strong>{fatorCondicao}%</strong>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={fatorCondicao}
                onChange={(e) => setFatorCondicao(e.target.value)}
              />
              <div className="bb-autonomy-scale">
                <span>60% (frio / ar-condicionado intenso)</span>
                <span>100% (ideal)</span>
              </div>
            </div>
          </div>

          <div className="bb-autonomy-progress">
            <span>Autonomia estimada</span>
            <div>
              <i style={{ width: `${progressoAutonomia}%` }} />
            </div>
            <div className="bb-autonomy-scale">
              <span>0 km</span>
              <span>700 km</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
