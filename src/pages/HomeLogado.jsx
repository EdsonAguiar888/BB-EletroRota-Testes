
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import './Home.css';
import imagemCarro from '../assets/imagemCarro.png';
import imagemgps from '../assets/imagemgps.png';
import imagemLocal from '../assets/imgLocal.png';
import imagemPlanejar from '../assets/imgPlanejar.png';
import imagemCalculadora from '../assets/imgCalculadora.png';
import imagemCarrinho from '../assets/imgCarrinho.png';




export default function HomeLogado({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [bateria, setBateria] = useState(usuario.veiculo?.bateriaAtual || 0);

  const irParaCadastro = () => {
    // Navega para o login, mas envia um estado interno dizendo "isRegister: true"
    navigate('/login', { state: { screen: 'register' } });
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    navigate('/');
  };

  if (!usuario) return null;

  //Display dados e botao inserir bateria atual

  const alterarBateria = async () => {
    // Exemplo: Simula o consumo da bateria reduzindo 10%, com limite mínimo em 0%
    const novoValor = Math.max(0, parseInt(bateria) - 10);

    // Atualiza o estado visual
    setBateria(novoValor);

    // Prepara o objeto atualizado do usuário
    const usuarioAtualizado = {
      ...usuario,
      veiculo: {
        ...usuario.veiculo,
        bateriaAtual: novoValor
      }
    };

    try {
      // 1. Atualiza o JSON Server via método PUT




      await fetch(window.location.hostname === 'localhost'
        ? 'http://localhost:3000/usuarios'
        : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios/${usuario.id}', {



        // await fetch(`https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios/${usuario.id}`, {
        // await fetch(`http://localhost:3001/usuarios/${usuario.id}`, {

          
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioAtualizado)
      });

      // 2. Atualiza o localStorage para persistir após F5
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));

      // 3. Atualiza o estado global no App para refletir na Navbar
      setUsuario(usuarioAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar a bateria:', error);
    }
  };

  // Se por algum motivo o usuário não existir na memória
  if (!usuario) return <p>Carregando...</p>;


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
       <div className="station">
         <h2>Painel Principal</h2>
         <div className="station-box info-veiculo">
           <div style={{ width: '100%' }}>
             <h3 className="painel-v-title">Informações do Veículo</h3>
             <p><strong>Usuário:</strong> Usuario</p>
             <p><strong>Marca/Modelo:</strong> Modelo</p>
             <p><strong>Potência:</strong> kW</p>
             <p><strong>Bateria Atual:</strong> 0%</p>
             <button>Simular Consumo (-10% bateria)</button>
           </div>
         </div>
       </div>
 
     </div>
   </div>
 );
 }



