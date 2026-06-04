import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import Auth from './pages/Login';
import Home from './pages/Home';
import HomeLogado from './pages/HomeLogado';
import GerenciarVeiculos from './pages/GerenciarVeiculos';
import EditarPerfil from './pages/EditarPerfil';
import Layout from './components/Layout';
import Busca from './pages/BuscaPag'

const Mapa = lazy(() => import('./pages/Mapa.jsx'));
const PlanejadorViagem = lazy(() => import('./pages/PlanejadorViagem.jsx'));
const CalculadoraAutonomia = lazy(() => import('./pages/CalculadoraAutonomia.jsx'));

function App() {
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem('usuarioLogado');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      localStorage.removeItem('usuarioLogado');
      return null;
    }
  });

  const handleLogin = (dados) => {
    localStorage.setItem('usuarioLogado', JSON.stringify(dados));
    setUsuario(dados);
  };

  const rotaProtegida = (pagina) => {
    if (!usuario) return <Navigate to="/login" replace />;

    return (
      <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>Carregando...</div>}>
        {pagina}
      </Suspense>
    );
  };

  return (

    <BrowserRouter>
      <Routes>

        {/* Rota pública de login */}


       



        <Route
          path="/login"
          element={usuario ? <Navigate to="/" replace /> : <Auth onLoginSuccess={handleLogin} />}
        />

        {/* Rotas estruturadas com o Layout */}
        <Route element={<Layout usuario={usuario} setUsuario={setUsuario} />}>

          <Route path="/busca" element={<Busca />} />

          {/* Rota Home com exibição dinâmica */}
          <Route
            path="/"
            element={usuario ? <HomeLogado usuario={usuario} setUsuario={setUsuario} /> : <Home usuario={usuario} setUsuario={setUsuario} />}
          />


          {/* Rotas protegidas */}
          <Route
            path="/gerenciar"
            element={usuario ? <GerenciarVeiculos setUsuario={setUsuario} /> : <Navigate to="/login" replace />}
          />

           {/* <Route
          path="/gerenciar"
          element={<GerenciaVeiculos setUsuario={setUsuario} />}
            /> */}

          <Route
            path="/editarPerfil"
            element={usuario ? <EditarPerfil usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" replace />}
          />

          <Route path="/mapas" element={rotaProtegida(<Mapa />)} />
          <Route path="/mapa" element={rotaProtegida(<Mapa />)} />
          <Route path="/otimizador" element={rotaProtegida(<Mapa />)} />
          <Route path="/planejador" element={rotaProtegida(<PlanejadorViagem />)} />
          <Route path="/planejar" element={rotaProtegida(<PlanejadorViagem />)} />
          <Route path="/calculadora" element={rotaProtegida(<CalculadoraAutonomia />)} />

        </Route>

        {/* Redirecionamento para rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
