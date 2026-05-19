
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import './Home.css';
import imagemCarro from '../assets/imagemCarro.png';
import imagemgps from '../assets/imagemgps.png';
import imagemLocal from '../assets/imgLocal.png';
import imagemPlanejar from '../assets/imgPlanejar.png';
import imagemCalculadora from '../assets/imgCalculadora.png';
import imagemCarrinho from '../assets/imgCarrinho.png';


export default function Home({ usuario, setUsuario }) {

  const irParaCadastro = () => {
    // Navega para o login, mas envia um estado interno dizendo "isRegister: true"
    navigate('/login', { state: { screen: 'register' } });
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    navigate('/home');
  };

  return (

    <div>

      {/* Exibição da Imagem */}
      <div style={{}}>
        <img
          src={imagemCarro}
          alt="Carro elétrico do projeto bbEletroRota"
          style={{
            maxWidth: '100%',
            width: '100%',
            height: 'auto',

            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        />
      </div>


      {/* <h1>Deslogado</h1> */}


      <section className="cards">

        <a className="card" id="estacoes" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', textAlign: 'left' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', margin: '0 0 15px 15px', textAlign: 'left', width: '100%' }}>
            <img
              src={imagemLocal}
              alt="Carro elétrico do projeto bbEletroRota"
              style={{
                maxWidth: '15%',
                width: '100%',
                height: 'auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                marginRight: '10px',
                flexShrink: 0
              }}
            />
            Encontre Estações de Carga
          </h3>
          
          {/* Linha Divisória */}
          <div style={{ width: '100%', borderTop: '1px solid #e0e0e0', margin: '0 0 15px 0' }}></div>
          
          {/* Parágrafo Centralizado */}
          <p style={{ margin: 0, textAlign: 'center', width: '100%' }}>
            Veja os pontos de recarga próximos.
          </p>
        </a>

        <a className="card" id="autonomia" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', textAlign: 'left' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', margin: '0 0 15px 15px', textAlign: 'left', width: '100%' }}>
            <img
              src={imagemCalculadora}
              alt="Carro elétrico do projeto bbEletroRota"
              style={{
                maxWidth: '15%',
                width: '100%',
                height: 'auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                marginRight: '10px',
                flexShrink: 0
              }}
            />
            Calculadora de Autonomia
          </h3>
          
          {/* Linha Divisória */}
          <div style={{ width: '100%', borderTop: '1px solid #e0e0e0', margin: '0 0 15px 0' }}></div>
          
          {/* Parágrafo Centralizado */}
          <p style={{ margin: 0, textAlign: 'center', width: '100%' }}>
            Calcule até onde você pode chegar.
          </p>
        </a>

        <a className="card" id="viagem" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', textAlign: 'left' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', margin: '0 0 15px 15px', textAlign: 'left', width: '100%' }}>
            <img
              src={imagemPlanejar}
              alt="Carro elétrico do projeto bbEletroRota"
              style={{
                maxWidth: '20%',
                width: '100%',
                height: 'auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                marginRight: '10px',
                flexShrink: 0
              }}
            />
            Planejar Viagem
          </h3>
          
          {/* Linha Divisória */}
          <div style={{ width: '100%', borderTop: '1px solid #e0e0e0', margin: '0 0 15px 0' }}></div>
          
          {/* Parágrafo Centralizado */}
          <p style={{ margin: 0, textAlign: 'center', width: '100%' }}>
            Planeje sua rota com paradas.
          </p>
        </a>

        <a className="card" id="cadastro" href="/gerenciar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', textAlign: 'left' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', margin: '0 0 15px 15px', textAlign: 'left', width: '100%' }}>
            <img
              src={imagemCarrinho}
              alt="Carro elétrico do projeto bbEletroRota"
              style={{
                maxWidth: '25%',
                width: '100%',
                height: 'auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                marginRight: '10px',
                flexShrink: 0
              }}
            />
            Cadastro do Meu Carro
          </h3>
          
          {/* Linha Divisória */}
          <div style={{ width: '100%', borderTop: '1px solid #e0e0e0', margin: '0 0 15px 0' }}></div>
          
          {/* Parágrafo Centralizado */}
          <p style={{ margin: 0, textAlign: 'center', width: '100%' }}>
            Salve seu veículo.
          </p>
        </a>

      </section>


      <div className="painel-mapa">
        <div className="station">
          <h2>Estação Recomendada Mais Próxima</h2>

          <div className="station-box">
            <div className="map">📍</div>

            <div className="info">
              <h3>Eletroposto Central</h3>
              <p>🔌 3 carregadores disponíveis</p>
              <p>⏱ 2 min de espera</p>
              <p>📏 5,2 km de distância</p>
              <button >Navegar até a estação</button>
            </div>
          </div>
        </div>


        <div className='station' style={{ fontFamily: 'sans-serif' }}>
          <h2>Painel Principal</h2>
          <div className="station-box">
            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: '0', color: '#333' }}>Informações do Veículo</h3>

              <p><strong>Usuário:</strong> </p>
              <p><strong>Marca/Modelo:</strong></p>
              <p><strong>Potência:</strong></p>
              <p><strong>Bateria Atual:</strong> </p>

              <button

                style={{
                  backgroundColor: '#3498db',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}
              >
                Simular Consumo (-10% bateria)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




