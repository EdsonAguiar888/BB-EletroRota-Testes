
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';


export default function Navbar({ usuario, setUsuario }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    navigate('/home', { replace: true });
  };


  return (
    <nav style={{
      padding: '15px 30px', 
      background: '#ffdf00', 
      color: '#2116b8', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      height: '60px'
    }}>

      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>BB EletroRota</h1>
      
      <ul style={{ display: 'flex', gap: '25px', listStyle: 'none', margin: 0, padding: 0 }}>
        <li>
          <Link to="/" style={{ color: '#2116b8', textDecoration: 'none', fontWeight: '500' }}>Início</Link>
        </li>
        <li>
          <Link to="/gerenciar" style={{ color: '#2116b8', textDecoration: 'none', fontWeight: '500' }}>Gerenciar Usuários</Link>
        </li>
        <li>
          <Link to="#" style={{ color: '#2116b8', textDecoration: 'none', fontWeight: '500' }}>Mapas</Link>
        </li>
      </ul>
      
      <div className='usuarioLogado-container'  style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
  
        {usuario ? (
          <>
            <Link className='usuarioLogado' to="/editarPerfil" style={{ color: '#2116b8', width: '250px;', textDecoration: 'none', fontWeight: '500' }}>Bem vindo, <strong>{usuario?.nome}</strong></Link>
        
        <button className='btn-logout'>
          <Link
          onClick={handleLogout} 
          // style={{
          //   background: '#1a73e8', 
          //   color: '#fff', 
          //   border: 'none', 
          //   padding: '8px 15px', 
          //   borderRadius: '5px', 
          //   cursor: 'pointer',
          //   fontWeight: 'bold',
          //   margin: 'auto'

          // }}
        >
          Sair
          </Link>
        </button>

          
          </>
        ) : (<button className='btn-login'>
          <Link 
             to="/login" 
            // style={{
            // background: '#1a73e8', 
            // color: '#fff', 
            // border: 'none', 
            // padding: '8px 15px', 
            // borderRadius: '5px', 
            // cursor: 'pointer',
            // fontWeight: 'bold',
            // margin: 'auto'
              
            // }}
          >
            Login
          </Link>
          </button>
        )}

      </div>
    </nav>
  );
}