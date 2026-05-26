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

function UsuarioLogado({ usuario, onLogout }) {
  return (
    <>
      <Link className="bb-user-name" to="/editarPerfil">
        Bem vindo, <strong className="usuario">{usuario.nome}</strong>
      </Link>
      <button className="bb-logout-btn" onClick={onLogout}>
        Sair
      </button>
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
  };

  return (
    <header className="bb-header">
      <div className="bb-topbar">

        {/* ── Desktop / Notebook / Tablet grande ── */}
        <div className="bb-logo-area">
          <img src={LogoImg} alt="Logo BB EletroRota" className="bb-logo-img" />
        </div>

        <nav className="bb-topnav">
          <Link to="/">Início</Link>
          <Link to="/gerenciar">Gerenciar Veículos</Link>
          <Link to="/mapas">Mapas</Link>
        </nav>

        <div className="bb-topbar-right">
          <BarraBusca />
          {usuario
            ? <UsuarioLogado usuario={usuario} onLogout={handleLogout} />
            : <BotaoLogin />
          }
        </div>

        {/* ── Tablet pequeno / Celular: toprow com logo + hambúrguer ── */}
        <div className="bb-mobile-toprow">
          <div className="bb-logo-area">
            <img src={LogoImg} alt="Logo BB EletroRota" className="bb-logo-img" />
          </div>

          <button
            className="bb-hamburger"
            onClick={() => setAberto(!aberto)}
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          >
            <i className={`fas ${aberto ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* ── Tablet pequeno / Celular: menu dropdown ── */}
        <div className={`bb-mobile-menu${aberto ? ' aberto' : ''}`}>

          {/* Bem-vindo (só se logado) */}
          {usuario && (
            <Link
              className="bb-user-name"
              to="/editarPerfil"
              onClick={() => setAberto(false)}
            >
              Bem vindo, <strong className="usuario">{usuario.nome}</strong>
            </Link>
          )}

          {/* Busca */}
          <div className="bb-search-wrapper">
            <BarraBusca />
          </div>

          {/* Navegação */}
          <nav className="bb-mobile-nav">
            <Link to="/" onClick={() => setAberto(false)}>Início</Link>
            <Link to="/gerenciar" onClick={() => setAberto(false)}>Gerenciar Veículos</Link>
            <Link to="/mapas" onClick={() => setAberto(false)}>Mapas</Link>
          </nav>

          {/* Sair ou Login dentro do menu */}
          <div className="bb-mobile-actions">
            {usuario
              ? (
                <button className="bb-logout-btn" onClick={handleLogout}>
                  Sair
                </button>
              )
              : <BotaoLogin />
            }
          </div>

        </div>

      </div>
    </header>
  );
}