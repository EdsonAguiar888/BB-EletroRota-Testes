import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


import "./LoginStyle.css";

export default function Auth({ onLoginSuccess }) {
  const navigate = useNavigate(); // Certifique-se de que está dentro da função
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
        const resp = await fetch('http://localhost:3000/usuarios');   
        //const resp = await fetch('https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios​​​​/:cPu6kVWv_Rs      ');   
        const usuarios = await resp.json();

        const usuarioEncontrado = usuarios.find(u => 
          u.email.toLowerCase().trim() === formData.email.toLowerCase().trim() && 
          u.senha === formData.senha
        );

        if (usuarioEncontrado) {
          // A ORDEM AQUI É CRUCIAL:
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
        // Lógica de Cadastro (POST) - Mantenha como você já tinha
        
        const resp = await fetch('http://localhost:3000/usuarios', {
        //const resp = await fetch('https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios​/:cPu6kVWv_Rs', {
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








 <div class="overlay">

    
    <div div class="modal" class="login-container">
        <div class="login-card">
        <div className="auth-container ">
      <a className="bt-irParaHome" id="cadastro"
        // style={{
                  
        //           marginTop: '10px',
        //           top: 0,
        //           right: 0,
        //           //position: 'absolute',
        //           background:' #ffdf00 ',
        //           color: 'blue',
        //           border: '2px solid #3814da',
        //           width: '70px',
        //           fontWeight: 'bold'


        //         }}

        
          href="/home" >X</a>

          <form onSubmit={handleSubmit} className="auth-card" id="authForm">

              <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>

              <div class="input-group">
                    {!isLogin && <input name="nome" placeholder="Nome" onChange={handleChange} required />}                        
              </div>

              <div class="input-group">
                  <input name="email" type="email" placeholder="E-mail" onChange={handleChange} required />
                        
              </div>

              <div class="input-group">
                  <input name="senha" type="password" placeholder="Senha" onChange={handleChange} required />                        
              </div>



              <button id="btnMain" type="submit">{isLogin ? 'Entrar' : 'Criar'}</button>

              <p id="btnSwitch" class="btn-secondary" onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer', color: 'blue'}}>
                {isLogin ? 'Criar conta' : 'Já tenho possue uma conta'}
              </p>

              {/* <p id="btnSwitch" class="btn-secondary" onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer', color: 'blue'}}>teste </p> */}

              {mensagem.texto && <div className={`message ${mensagem.tipo}`}>{mensagem.texto}</div>}


          </form>
        </div>
    </div>
    </div>
  </div>
  
  
  
);
}
