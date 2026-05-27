import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import './Home.css';
import imagemCarro from '../assets/imagemCarro.png';
import imagemgps from '../assets/imagemgps.png';
import imagemLocal from '../assets/imgLocal.png';
import imagemPlanejar from '../assets/imgPlanejar.png';
import imagemCalculadora from '../assets/imgCalculadora.png';
import imagemCarrinho from '../assets/imgCarrinho.png';

export default function HomeLogado({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const location = useLocation();

  // URL corrigida com as barras explícitas para evitar erros de concatenação
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/usuarios'
    : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios';


  // 🔥 SUBSTITUA O SEU EFFECT ATUAL POR ESTE BLOCO ATUALIZADO:
  useEffect(() => {
    const buscarDadosHome = async () => {
      if (!usuario?.id) return;

      try {
        const response = await fetch(`${API_URL}/${usuario.id}`);
        if (response.ok) {
          const dadosApi = await response.json();

          // Compara se o veículo ativo mudou de marca ou de bateria em relação ao estado atual
          const mudouMarca = dadosApi.veiculo?.marca !== usuario?.veiculo?.marca;
          const mudouPotencia = dadosApi.veiculo?.potencia !== usuario?.veiculo?.potencia;
          const mudouBateria = dadosApi.veiculo?.bateriaAtual !== usuario?.veiculo?.bateriaAtual;
          const mudouQuantidade = dadosApi.veiculos?.length !== usuario?.veiculos?.length;

          // Se houver qualquer divergência real com o GerenciarVeiculos, força a atualização instantânea
          if (mudouMarca || mudouPotencia || mudouBateria || mudouQuantidade) {
            setUsuario(dadosApi);
            localStorage.setItem('usuarioLogado', JSON.stringify(dadosApi));
          }
        }
      } catch (err) {
        console.error("Erro ao sincronizar dados da HomeLogado:", err);
      }
    };

    buscarDadosHome();
  }, [usuario?.id, usuario?.veiculo?.marca, usuario?.veiculo?.bateriaAtual, usuario?.veiculos?.length]);
  // 👆 Monitorando propriedades primitivas (strings/numbers), o React nunca entra em loop e atualiza instantaneamente!


  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    navigate('/');
  };

  const alterarBateria = async () => {
    if (!usuario) return;

    // Pega o valor atual direto do objeto global do usuário
    const bateriaAtual = usuario.veiculo?.bateriaAtual || 0;
    const novoValor = Math.max(0, parseInt(bateriaAtual) - 10);

    // Monta o objeto perfeitamente atualizado para salvar
    const usuarioAtualizado = {
      ...usuario,
      veiculo: {
        ...usuario.veiculo,
        bateriaAtual: novoValor
      },
      veiculos: Array.isArray(usuario?.veiculos)
        ? usuario.veiculos.map(v => v.idVeiculo === usuario.veiculo?.idVeiculo ? { ...v, bateriaAtual: novoValor } : v)
        : []
    };

    try {
      const response = await fetch(`${API_URL}/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioAtualizado)
      });

      if (response.ok) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        setUsuario(usuarioAtualizado);
      }
    } catch (error) {
      console.error('Erro ao atualizar a bateria:', error);
    }
  };

  if (!usuario) return <p>Carregando...</p>;


  const veiculo = usuario?.veiculo;
  const bateria = veiculo?.bateriaAtual ?? 0;

  const getBateriaClasse = (pct) => {
    if (pct > 50) return 'bb-battery-fill';
    if (pct > 20) return 'bb-battery-fill medium';
    return 'bb-battery-fill low';
  };

  const getBateriaLabel = (pct) => {
    if (pct > 50) return 'Carga boa';
    if (pct > 20) return 'Carga média';
    return 'Carga baixa';
  };


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
        <a className="card" id="estacoes">
          <h3>
            <img src={imagemLocal} alt="Ícone Estações" className="card-icon" />
            Encontre Estações de Carga
          </h3>
          <div className="divider"></div>
          <p>Veja os pontos de recarga próximos.</p>
        </a>

        <a className="card" id="autonomia">
          <h3>
            <img src={imagemCalculadora} alt="Ícone Autonomia" className="card-icon" />
            Calculadora de Autonomia
          </h3>
          <div className="divider"></div>
          <p>Calcule até onde você pode chegar.</p>
        </a>

        <a className="card" id="viagem">
          <h3>
            <img src={imagemPlanejar} alt="Ícone Viagem" className="card-icon" />
            Planejar Viagem
          </h3>
          <div className="divider"></div>
          <p>Planeje sua rota com paradas.</p>
        </a>

        <a className="card" id="cadastro" href="/gerenciar">
          <h3>
            <img src={imagemCarrinho} alt="Ícone Cadastro" className="card-icon" />
            Cadastro do Meu Carro
          </h3>
          <div className="divider"></div>
          <p>Salve seu veículo.</p>
        </a>
      </section>

      {/* Containers de Conteúdo Inferior */}
      <div className="painel-container">

        {/* Bloco 1: Busca Eletroposto */}
        <div className="station-container">
          <div className="station-title">Estação Recomendada Mais Próxima</div>

          <div className="station-card">
            <div className="map-wrapper">
              <div className="map-placeholder">
                <img src={imagemgps} alt="Mapa GPS" className="map-img" />
              </div>
            </div>

            <div className="details-wrapper">
              <div className="station-name">Eletroposto Central</div>

              <div className="info-grid">
                <div className="info-item">
                  <span className="icon">🔌</span>
                  <strong>3</strong> Carregadores Disponíveis
                </div>
                <div className="info-item">
                  <span className="icon">⏱</span>
                  <strong>2 Min</strong> de Espera Estimada
                </div>
                <div className="info-item">
                  <span className="icon">📍</span>
                  <strong>5,2 km</strong> Distância até o local
                </div>

                <div className="action-wrapper">
                  <button className="btn-navigate">
                    Navegar até a Estação <span className="arrow">&gt;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                  {veiculo?.marca ? 'Ativo' : 'Sem veículo'}
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
                    {veiculo?.potencia ? `${veiculo.potencia} kW` : 'N/A'}
                  </span>
                </div>
                <div className="bb-info-item full-width">
                  <span className="bb-info-label">Marca / Modelo</span>
                  <span className="bb-info-value">
                    {veiculo?.marca ?? 'Nenhum veículo ativo'}
                  </span>
                </div>
              </div>

              <div className="bb-battery-section">
                <div className="bb-battery-header">
                  <span className="bb-battery-label">
                    Bateria atual
                  </span>
                  <span className="bb-battery-pct">{bateria}%</span>
                </div>
                <div className="bb-battery-track">
                  <div
                    className={getBateriaClasse(bateria)}
                    style={{ width: `${bateria}%` }}
                  />
                </div>
                <p className="bb-battery-status">{getBateriaLabel(bateria)}</p>
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





