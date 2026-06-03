import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Auth from './pages/Login';
import Home from './pages/Home';
import HomeLogado from './pages/HomeLogado';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import EditarPerfil from './pages/EditarPerfil';
import Layout from './components/Layout';
import Busca from './pages/BuscaPag'

function App() {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuarioLogado');
    return salvo ? JSON.parse(salvo) : null;
  });

  const handleLogin = (dados) => {
    localStorage.setItem('usuarioLogado', JSON.stringify(dados));
    setUsuario(dados);
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
            element={usuario ? <HomeLogado usuario={usuario} /> : <Home />} 
          />
          
          {/* Rotas protegidas */}
          <Route 
            path="/gerenciar" 
            element={usuario ? <GerenciarUsuarios /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/editarPerfil" 
            element={usuario ? <EditarPerfil usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" replace />} 
          />
          
        </Route>

        {/* Redirecionamento para rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;