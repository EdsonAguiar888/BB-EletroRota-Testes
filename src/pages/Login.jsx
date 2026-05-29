import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./LoginStyle.css";
// Importando a nova função de validação
import { validarAuth } from '../components/Validacoes'; 

export default function Auth({ onLoginSuccess }) {
  const navigate = useNavigate(); 
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [errosCampos, setErrosCampos] = useState({}); // Para feedback visual nos inputs
  const location = useLocation();
  const apiUsuariosUrl = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:3000/usuarios'
    : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios';

  const handleChange = (e) => {
    // Mantém a atualização controlada do estado
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Limpa o erro do input atual enquanto o usuário digita
    if (errosCampos[e.target.name]) {
      setErrosCampos({ ...errosCampos, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- EXECUÇÃO DA VALIDAÇÃO ANTES DE SALVAR / LOGAR ---
    const errosValida = validarAuth(formData, isLogin);

    if (Object.keys(errosValida).length > 0) {
      setErrosCampos(errosValida);
      // Exibe o primeiro erro encontrado na mensagem do formulário
      const primeiroErro = Object.values(errosValida)[0];
      setMensagem({ texto: primeiroErro, tipo: 'error' });
      return; // Trava o envio para a API aqui
    }

    setMensagem({ texto: 'Validando...', tipo: '' });

    try {
      if (isLogin) {
        const resp = await fetch(apiUsuariosUrl);

        const usuarios = await resp.json();

        const usuarioEncontrado = usuarios.find(u =>
          u.email.toLowerCase().trim() === formData.email.toLowerCase().trim() &&
          u.senha === formData.senha
        );

        if (usuarioEncontrado) {
          setMensagem({ texto: 'Sucesso!', tipo: 'success' });
          onLoginSuccess(usuarioEncontrado); 

          setTimeout(() => {
            navigate('/');
          }, 500);
        } else {
          setMensagem({ texto: 'E-mail ou senha incorretos.', tipo: 'error' });
        }
      } else {
        // Lógica de Cadastro (POST)
        const resp = await fetch(apiUsuariosUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (resp.ok) {
          setMensagem({ texto: 'Criado! Faça login.', tipo: 'success' });
          setIsLogin(true);
          setFormData({ nome: '', email: '', senha: '' }); // Limpa o formulário
        }
      }
    } catch (err) {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'error' });
    }
  };

  return (
    <div className="overlay">
      <div className="login-container">
        <div className="login-card">
          <div className="auth-container">
            <a className="bt-irParaHome" id="cadastro" href="/home">X</a>

            <form onSubmit={handleSubmit} className="auth-card" id="authForm">
              <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>

              <div className="input-group">
                {!isLogin && (
                  <input 
                    name="nome" 
                    value={formData.nome}
                    placeholder="Nome (mínimo 8 caracteres)" 
                    onChange={handleChange} 
                    maxLength={40} // Não deixa digitar mais que 40 caracteres
                    style={errosCampos.nome ? { border: '2px solid red' } : {}}
                    required 
                  />
                )}
              </div>

              <div className="input-group">
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  placeholder="E-mail" 
                  onChange={handleChange} 
                  maxLength={30} // Não deixa digitar mais que 30 caracteres
                  style={errosCampos.email ? { border: '2px solid red' } : {}}
                  required 
                />
              </div>

              <div className="input-group">
                <input 
                  name="senha" 
                  type="password"                  
                  value={formData.senha}
                  placeholder="Senha" 
                  onChange={handleChange} 
                  maxLength={6} // Não deixa digitar mais que 5 caracteres
                  style={errosCampos.senha ? { border: '2px solid red' } : {}}
                  required 
                />
              </div>

              <button id="btnMain" type="submit">{isLogin ? 'Entrar' : 'Criar'}</button>

              <p style={{ margin: '22px 0' }}>Para cadastrar seu veículo faça aqui seu login ou crie sua conta</p>

              <p id="btnSwitch" className="btn-secondary" onClick={() => { setIsLogin(!isLogin); setMensagem({ texto: '', tipo: '' }); setErrosCampos({}); }} style={{ cursor: 'pointer', color: 'blue' }}>
                {isLogin ? 'Criar conta' : 'Já possui uma conta'}
              </p>

              {mensagem.texto && <div className={`message ${mensagem.tipo}`}>{mensagem.texto}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}



































// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';


// import "./LoginStyle.css";

// export default function Auth({ onLoginSuccess }) {
//   const navigate = useNavigate(); // Precisa estar dentro da função
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
//   const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
//   const location = useLocation();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
    
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMensagem({ texto: 'Validando...', tipo: '' });

//     try {
//       if (isLogin) {


//         const resp = await fetch(window.location.hostname === 'localhost'
//           ? 'http://localhost:3000/usuarios'
//           : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios');


//         const usuarios = await resp.json();

//         const usuarioEncontrado = usuarios.find(u =>
//           u.email.toLowerCase().trim() === formData.email.toLowerCase().trim() &&
//           u.senha === formData.senha
//         );

//         if (usuarioEncontrado) {

//           setMensagem({ texto: 'Sucesso!', tipo: 'success' });
//           onLoginSuccess(usuarioEncontrado); // Atualiza o App.jsx

//           // Se o navigate('/') falhar, o window.location funciona como última opção
//           setTimeout(() => {
//             navigate('/');
//           }, 500);
//         } else {
//           setMensagem({ texto: 'E-mail ou senha incorretos.', tipo: 'error' });
//         }
//       } else {
//         // Lógica de Cadastro (POST) 

//         const resp = await fetch(window.location.hostname === 'localhost'
//   ? 'http://localhost:3000/usuarios'
//   : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios', {


//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
//         if (resp.ok) {
//           setMensagem({ texto: 'Criado! Faça login.', tipo: 'success' });
//           setIsLogin(true);
//         }
//       }
//     } catch (err) {
//       setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'error' });
//     }
//   };

//   return (

//     <div className="overlay">
//       <div className="modal" className="login-container" >
//         <div className="login-card">
//           <div className="auth-container ">
//             <a className="bt-irParaHome" id="cadastro" href="/home" >X</a>

//             <form onSubmit={handleSubmit} className="auth-card" id="authForm">

//               <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>

//               <div className="input-group">
//                 {!isLogin && <input name="nome" placeholder="Nome" onChange={handleChange} required />}
//               </div>

//               <div className="input-group">
//                 <input name="email" type="email" placeholder="E-mail" onChange={handleChange} required />

//               </div>

//               <div className="input-group">
//                 <input name="senha" type="password" placeholder="Senha" onChange={handleChange} required />
//               </div>

//               <button id="btnMain" type="submit">{isLogin ? 'Entrar' : 'Criar'}</button>

//               <p style={{ margin: '22px 0' }} >Para cadastrar seu veiculo faça aqui seu login ou crie sua conta</p>

//               <p id="btnSwitch" className="btn-secondary" onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue' }}>
//                 {isLogin ? 'Criar conta' : 'Já tenho possue uma conta'}
//               </p>
              

//               {mensagem.texto && <div className={`message ${mensagem.tipo}`}>{mensagem.texto}</div>}


//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
