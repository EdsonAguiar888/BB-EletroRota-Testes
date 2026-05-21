import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ usuario, setUsuario }) {

  return (

    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff'
    }}>

      {/* Navbar no topo */}
      <Navbar usuario={usuario} setUsuario={setUsuario} />

      {/* Área dinâmica que preenche o restante da tela */}
      <main style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>

        <Outlet />
      </main>
    </div>
  );
}

