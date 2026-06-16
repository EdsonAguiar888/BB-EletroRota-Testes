import { Link } from 'react-router-dom';

import './Home.css';
import imagemCarro from '../assets/imagemCarro.png';
import imagemLocal from '../assets/imgLocal.png';
import imagemPlanejar from '../assets/imgPlanejar.png';
import imagemCalculadora from '../assets/imgCalculadora.png';
import imagemCarrinho from '../assets/imgCarrinho.png';



function getBateriaClasse(pct) {
  if (pct > 50) return 'bb-battery-fill';
  if (pct > 20) return 'bb-battery-fill medium';
  return 'bb-battery-fill low';
}

function getBateriaLabel(pct) {
  if (pct > 50) return 'Carga boa';
  if (pct > 20) return 'Carga média';
  return 'Carga baixa';
}

export default function Home({ usuario }) {
  return (
    <div>
      {/* Exibição da Imagem */}
      <div className="hero-image-container">
        <img
          src={imagemCarro}
          alt="Carro elétrico do projeto bbEletroRota"
          className="hero-image"
        />
      </div>

      {/* Seção de Cards de Menu */}
      <section className="cards">
        <Link to="/otimizador" className="card" id="estacoes">
          <h3>
            <img src={imagemLocal} alt="Ícone Estações" className="card-icon" />
            Encontre Estações de Carga
          </h3>
          <div className="divider"></div>
          <p>Veja os pontos de recarga próximos.</p>
        </Link>

        <Link to="/calculadora" className="card" id="autonomia">
          <h3>
            <img src={imagemCalculadora} alt="Ícone Autonomia" className="card-icon" />
            Calculadora de Autonomia
          </h3>
          <div className="divider"></div>
          <p>Calcule até onde você pode chegar.</p>
        </Link>

        <Link to="/planejador" className="card" id="viagem">
          <h3>
            <img src={imagemPlanejar} alt="Ícone Viagem" className="card-icon" />
            Planejar Viagem
          </h3>
          <div className="divider"></div>
          <p>Planeje sua rota com paradas.</p>
        </Link>

        <Link to="/gerenciar" className="card" id="cadastro">
          <h3>
            <img src={imagemCarrinho} alt="Ícone Cadastro" className="card-icon" />
            Cadastro do Meu Carro
          </h3>
          <div className="divider"></div>
          <p>Salve seu veículo.</p>
        </Link>
      </section>



      {/* Containers de Conteúdo Inferior */}
      <div className="painel-container">

        {/* Bloco 1: Busca Eletroposto */}
        <div className="station-container">
          <div className="station-title">Rota otimizada para recarga</div>

          <Link to="/otimizador" className="station-card optimizer-preview-card" aria-label="Abrir otimizador de rotas">
            
            <img src={imagemgps} style={{ height: '170px',  width: '250px' }} alt="Ícone Estações" className="card-icon" />
            
            {/* <div className="map-wrapper">
              <div className="optimizer-mini-map" aria-hidden="true">
                <span className="mini-map-road mini-map-road-main" />
                <span className="mini-map-road mini-map-road-cross" />
                <span className="mini-route-line mini-route-line-a" />
                <span className="mini-route-line mini-route-line-b" />
                <span className="mini-route-line mini-route-line-c" />
                <span className="mini-marker mini-origin" />
                <span className="mini-marker mini-station" />
                <span className="mini-marker mini-destination" />
              </div>
            </div> */}

            <div className="details-wrapper">
              <div className="station-name">Prévia do otimizador de rota</div>
              <p className="optimizer-preview-copy">
                Compare os postos próximos e veja qual rota tende a carregar seu carro mais rápido.
              </p>

              <div className="optimizer-preview-panel">
                <div className="optimizer-preview-top">
                  <span className="optimizer-badge">Localização atual</span>
                  <strong>Rota otimizada pronta</strong>
                </div>

                <div className="optimizer-metrics">
                  <span><strong>Posto sugerido</strong>Eletroposto Recife Antigo</span>
                  <span><strong>Tempo total</strong>20 min</span>
                  <span><strong>Economia</strong>22 min</span>
                </div>

                <div className="optimizer-criteria">
                  <span>Distância</span>
                  <span>Fila</span>
                  <span>Potência</span>
                  <span>Bateria</span>
                </div>
              </div>

              <div className="action-wrapper">
                <span className="btn-navigate">
                  Abrir otimizador de rota <span className="arrow">&gt;</span>
                </span>
              </div>
            </div>
          </Link>
        </div>









        {/* Bloco 2: Painel Principal do Veículo */}

        <div className="bb-panel">
          <div className="bb-header">
            <div className="bb-header-text">
              <span className="bb-section-label">BB EletroRota</span>
              <h2 className="bb-section-title">Veículo logado atual</h2>
            </div>
          </div>

          <div className="bb-card">
            <div className="bb-card-stripe" />
            <div className="bb-card-body">

              <div className="bb-card-header">
                <p className="bb-card-title">
                  <span className="bb-title-icon" aria-hidden="true">&#9650;</span>
                  Informações do veículo
                </p>
                <span className="bb-status-badge">
                  <span className="bb-status-dot" />
                  {/* 🔥 CORRIGIDO: Agora verifica de forma segura se o usuário tem veículo */}
                  {usuario?.veiculo?.marca ? 'Ativo' : 'Sem veículo'}
                </span>
              </div>

              <div className="bb-info-grid">
                <div className="bb-info-item">
                  <span className="bb-info-label">Usuário</span>
                  <span className="bb-info-value">{usuario?.nome ?? '—'}</span>
                </div>
                <div className="bb-info-item">
                  <span className="bb-info-label">Potência</span>
                  <span className="bb-info-value">
                    {/* 🔥 CORRIGIDO: Puxa a potência direto do usuário logado */}
                    {usuario?.veiculo?.potencia ? `${usuario.veiculo.potencia} kW` : 'N/A'}
                  </span>
                </div>
                <div className="bb-info-item full-width">
                  <span className="bb-info-label">Marca / Modelo</span>
                  <span className="bb-info-value">
                    {/* 🔥 CORRIGIDO: Puxa a marca/modelo direto do usuário logado */}
                    {usuario?.veiculo?.marca ?? 'Nenhum veículo ativo'}
                  </span>
                </div>
              </div>

              <div className="bb-battery-section">
                <div className="bb-battery-header">
                  <span className="bb-battery-label">
                    Bateria atual
                  </span>
                  {/* 🔥 CORRIGIDO: Usa o valor do estado global ou 0 caso esteja deslogado */}
                  <span className="bb-battery-pct">{usuario?.veiculo?.bateriaAtual ?? 0}%</span>
                </div>
                <div className="bb-battery-track">
                  <div
                    className={getBateriaClasse(usuario?.veiculo?.bateriaAtual || 0)}
                    style={{ width: `${usuario?.veiculo?.bateriaAtual ?? 0}%` }}
                  />
                </div>
                <p className="bb-battery-status">
                  {getBateriaLabel(usuario?.veiculo?.bateriaAtual || 0)}
                </p>
              </div>

              <div className="bb-footer">
                <span className="bb-footer-icon" aria-hidden="true">&#128337;</span>
                Última atualização: hoje
              </div>

            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
