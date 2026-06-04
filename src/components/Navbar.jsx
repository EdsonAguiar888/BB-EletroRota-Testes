import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoImg from '../assets/LogoEletroRota.svg';
import BarraBusca from './Busca';
import './Navbar.css';

function BotaoLogin() {
  return (
    <Link to="/login" className="bb-account-btn">
      <i className="fas fa-user"></i>
      <span className='acessar-desktop'>Acessar a sua conta</span>
      <span className='acessar-mobile'>Login</span>
    </Link>
  );
}


function formatarNome(nomeCompleto) {
  const partes = nomeCompleto.split(' ');
  const primeiro = partes[0];
  const segundo = partes[1];
  
  if (segundo) {
    return `${primeiro} ${segundo[0].toUpperCase()}.`;
  }
  return primeiro;
}

// aqui é para exibir o nome do usuário logado, formatando para mostrar apenas o primeiro nome e a inicial do segundo nome (se houver). Exemplo: "João Silva" vira "João S." e "Maria" permanece "Maria".
function UsuarioLogado({ usuario, onLogout }) {
  return (
    <>
      <Link className="bb-user-name" to="/editarPerfil">
        Bem vindo, <strong className="usuario">{formatarNome(usuario.nome)}</strong>
      </Link>
      <button className="bb-logout-btn" onClick={onLogout}>Sair</button>
    </>
  );
}

export default function Navbar({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    navigate('/', { replace: true });
    setAberto(false);
  };

  return (
    <header className="bb-navebar-header">
      <div className="bb-topbar">

        {/*  Desktop */}
        <div className="bb-logo-area">
          <img src={LogoImg} alt="Logo BB EletroRota" className="bb-logo-img" />
        </div>

        <nav className="bb-topnav">
          <Link to="/">Início</Link>
          <Link to="/gerenciar">Gerenciar Veículos</Link>
          <Link to="/otimizador">Mapas</Link>
        </nav>
        <div className="bb-topbar-right">
          <BarraBusca />
          {usuario
            ? <UsuarioLogado usuario={usuario} onLogout={handleLogout} />
            : <BotaoLogin />}
        </div>

        {/*  Mobile: toprow */}
        <div className="bb-mobile-toprow">
          <button
            className="bb-hamburger"
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
          >
            <i className="fas fa-bars"></i>
          </button>

          <img src={LogoImg} alt="Logo BB EletroRota" className="bb-logo-img" /> 

              {usuario && (
                <span 
                  className="bb-user-name-mobile" 
                  to="/editarPerfil"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <i className="fas fa-user"></i> {formatarNome(usuario.nome)}
                </span>
              )}
        </div>

        {aberto && (
          <div className="bb-drawer-overlay" onClick={() => setAberto(false)} />
        )}

        {/* Drawer lateral */}
        <div className={`bb-drawer${aberto ? ' aberto' : ''}`}>

          {/* Cabeçalho do drawer */}
          <div className="bb-drawer-header">
            <div className="bb-drawer-avatar">
              <i className="fas fa-user"></i>
          </div>
          <span className="bb-drawer-greeting">
            {usuario ? (
              <>Bem vindo, <strong className="usuario">{formatarNome(usuario.nome)}</strong></>
            ) : 'Bem vindo, visitante!'}
          </span>
            <button
              className="bb-drawer-close"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Navegação */}
          <nav className="bb-drawer-nav">
            <Link to="/" onClick={() => setAberto(false)}>
              <i className="fas fa-home"></i> Início
            </Link>
            <Link to="/gerenciar" onClick={() => setAberto(false)}>
              <i className="fas fa-car"></i> Gerenciar Veículos
            </Link>
            <Link to="/mapas" onClick={() => setAberto(false)}>
              <i className="fas fa-map-marker-alt"></i> Mapas
            </Link>
            {usuario && (
              <Link to="/editarPerfil" onClick={() => setAberto(false)}>
                <i className="fas fa-user-edit"></i> Meu Perfil
              </Link>
            )}
          </nav>

          {/* Rodapé: login ou sair */}
          <div className="bb-drawer-footer">
            {usuario
              ? (
                <button className="bb-drawer-logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Sair
                </button>
              )
              : <BotaoLogin />}
          </div>

        </div>
      </div>
    </header>
  );
}