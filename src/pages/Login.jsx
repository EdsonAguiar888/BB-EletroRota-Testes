import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


import "./LoginStyle.css";

export default function Auth({ onLoginSuccess }) {
  const navigate = useNavigate(); // Precisa estar dentro da função
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: 'Validando...', tipo: '' });

    try {
      if (isLogin) {

        const resp = await fetch('https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios');
        //const resp = await fetch('http://localhost:3000/usuarios');
        
        const usuarios = await resp.json();

        const usuarioEncontrado = usuarios.find(u =>
          u.email.toLowerCase().trim() === formData.email.toLowerCase().trim() &&
          u.senha === formData.senha
        );

        if (usuarioEncontrado) {

          setMensagem({ texto: 'Sucesso!', tipo: 'success' });
          onLoginSuccess(usuarioEncontrado); // Atualiza o App.jsx

          // Se o navigate('/') falhar, o window.location funciona como última opção
          setTimeout(() => {
            navigate('/');
          }, 500);
        } else {
          setMensagem({ texto: 'E-mail ou senha incorretos.', tipo: 'error' });
        }
      } else {
        // Lógica de Cadastro (POST) 

        const resp = await fetch('https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios', {
        //const resp = await fetch('http://localhost:3000/usuarios', {
          
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (resp.ok) {
          setMensagem({ texto: 'Criado! Faça login.', tipo: 'success' });
          setIsLogin(true);
        }
      }
    } catch (err) {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'error' });
    }
  };

  return (

    <div className="overlay">
      <div className="modal" className="login-container" >
        <div className="login-card">
          <div className="auth-container ">
            <a className="bt-irParaHome" id="cadastro" href="/home" >X</a>

            <form onSubmit={handleSubmit} className="auth-card" id="authForm">

              <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>

              <div className="input-group">
                {!isLogin && <input name="nome" placeholder="Nome" onChange={handleChange} required />}
              </div>

              <div className="input-group">
                <input name="email" type="email" placeholder="E-mail" onChange={handleChange} required />

              </div>

              <div className="input-group">
                <input name="senha" type="password" placeholder="Senha" onChange={handleChange} required />
              </div>

              <button id="btnMain" type="submit">{isLogin ? 'Entrar' : 'Criar'}</button>

              <p id="btnSwitch" className="btn-secondary" onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue' }}>
                {isLogin ? 'Criar conta' : 'Já tenho possue uma conta'}
              </p>

              {mensagem.texto && <div className={`message ${mensagem.tipo}`}>{mensagem.texto}</div>}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
