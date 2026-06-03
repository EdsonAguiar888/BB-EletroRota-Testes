import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoImg from '../assets/LogoEletroRota.png';
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

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    navigate('/', { replace: true });
  };

  return (
    <header className="bb-header">
      <div className="bb-topbar">

        <div className="bb-logo-area">
          <img src={LogoImg} alt="Logo BB EletroRota" className="bb-logo-img" />
          <span className="bb-logo-text">BB</span>
          <span className="bb-logo-yellow">EletroRota</span>
        </div>

        <nav className="bb-topnav">
          <Link to="/">Início</Link>
          <Link to="/gerenciar">Gerenciar Usuários</Link>
          <Link to="/mapas">Mapas</Link>
        </nav>

        <div className="bb-topbar-right">
          <BarraBusca />
          {usuario
            ? <UsuarioLogado usuario={usuario} onLogout={handleLogout} />
            : <BotaoLogin />
          }
        </div>

      </div>
    </header>
  );
}