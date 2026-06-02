import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./Login.css";
import logo from "../assets/BBEletroRota-Logo.svg";

export default function Auth({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmaSenha: '' });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const estiloMensagem = {
    marginTop: '12px',
    fontSize: '14px',
    fontWeight: 600,
    color:
      mensagem.tipo === 'error'
        ? '#dc2626'
        : mensagem.tipo === 'success'
          ? '#16a34a'
          : '#374151',
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: 'Validando...', tipo: '' });

    try {
      // const resp = await fetch('https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios');
      const resp = await fetch('http://localhost:3000/usuarios');
      if (!resp.ok) {
        setMensagem({ texto: 'Servidor indisponível. Inicie o json-server na porta 3000.', tipo: 'error' });
        return;
      }

      const usuarios = await resp.json();
      const usuarioEncontrado = usuarios.find(u =>
        u.email.toLowerCase().trim() === formData.email.toLowerCase().trim() &&
        u.senha === formData.senha
      );

      if (usuarioEncontrado) {
        setMensagem({ texto: 'Sucesso!', tipo: 'success' });
        onLoginSuccess(usuarioEncontrado);
        setTimeout(() => navigate('/'), 500);
      } else {
        setMensagem({ texto: 'E-mail ou senha incorretos.', tipo: 'error' });
      }
    } catch {
      setMensagem({
        texto: 'Erro de conexão. Rode: npx json-server --watch db.json',
        tipo: 'error',
      });
    }
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: 'Criando conta...', tipo: '' });

    if (formData.senha !== formData.confirmaSenha) {
      setMensagem({ texto: 'Senhas não coincidem.', tipo: 'error' });
      return;
    }

    try {
      // const resp = await fetch('https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios', {
      const resp = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          email: formData.email.toLowerCase().trim(),
          senha: formData.senha,
        }),
      });

      if (!resp.ok) {
        let detalhe = 'Não foi possível cadastrar.';
        try {
          const errBody = await resp.json();
          if (errBody?.message) detalhe = errBody.message;
        } catch {
          /* ignore */
        }
        setMensagem({ texto: detalhe, tipo: 'error' });
        return;
      }

      const novoUsuario = await resp.json();
      if (!novoUsuario?.id) {
        setMensagem({ texto: 'Resposta inválida do servidor.', tipo: 'error' });
        return;
      }

      const emailCadastrado = formData.email.toLowerCase().trim();

      setFormData({
        nome: '',
        email: emailCadastrado,
        senha: '',
        confirmaSenha: '',
      });

      setIsLogin(true);
      setMensagem({
        texto: 'Conta criada! Faça login com seu e-mail e senha.',
        tipo: 'success',
      });
    } catch {
      setMensagem({
        texto: 'Erro de conexão. Rode: npx json-server --watch db.json',
        tipo: 'error',
      });
    }
  };

  const toggleToCadastro = () => {
    setIsLogin(false);
    setMensagem({ texto: '', tipo: '' });
  };

  const toggleToLogin = () => {
    setIsLogin(true);
    setMensagem({ texto: '', tipo: '' });
  };

  return (
    <>
      <div className={`container-login ${!isLogin ? 'modo-cadastro' : ''}`}>
        {/* LADO ÁREA DE LOGIN */}
        <section className="area-login">
          <div className="seletor-area-login">
            <button type="button" className="btn-inativo" id="btn-cadastro" onClick={toggleToCadastro}>Criar Conta</button>
          </div>

          <div className="textos-boas-vindas">
            <h1>Bem-vindo de volta</h1>
            <p>Entre com suas credenciais</p>
          </div>

          <form className="formulario-login" onSubmit={handleLoginSubmit}>
            <div className="grupo-input">
              <label htmlFor="email">E-mail</label>
              <div className="input-sem-icone">
                <input type="email" id="email" name="email" placeholder="seu@email.com" maxLength="254" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grupo-input">
              <label htmlFor="senha">Senha</label>
              <div className="input-sem-icone">
                <input type="password" id="senha" name="senha" placeholder="••••••" value={formData.senha} onChange={handleChange} required />
              </div>
            </div>

            <div className="opcoes-extras">
              <label className="lembrar-mim">
                <input type="checkbox" /> Lembrar de mim
              </label>
              <a href="#" className="link-esqueceu">Esqueceu a senha?</a>
            </div>

            <button type="submit" className="btn-enter">Entrar</button>
          </form>
          {mensagem.texto && isLogin && <p style={estiloMensagem}>{mensagem.texto}</p>}
        </section>

        {/* LADO ÁREA DE CADASTRO */}
        <section className="area-cadastro" id="area-cadastro">
          {/* TEXTO ADICIONADO DIRETAMENTE AQUI LADO A LADO COM O BOTÃO */}
          <div className="seletor-area-cadastro">
            <span className="texto-possui-conta">Já possui uma conta?</span>
            <button type="button" className="btn-inativo" id="voltar-login" onClick={toggleToLogin}>Entrar</button>
          </div>

          <div className="texto-cadastro">
            <h1>Crie sua conta</h1>
            <p>Preencha os dados abaixo</p>
          </div>

          <form onSubmit={handleCadastroSubmit}>
            <div className="grupo-input2">
              <label htmlFor="nome">Nome completo</label>
              <div className="input-sem-icone">
                <input type="text" id="nome" name="nome" placeholder="Seu nome" value={formData.nome} onChange={handleChange} required />
              </div>
            </div>

            <div className="grupo-input2">
              <label htmlFor="emailCadastro">E-mail</label>
              <div className="input-sem-icone">
                <input type="email" id="emailCadastro" name="email" placeholder="seu@email.com" maxLength="254" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grupo-input2">
              <label htmlFor="senhaCadastro">Senha</label>
              <div className="input-sem-icone">
                <input type="password" id="senhaCadastro" name="senha" placeholder="••••••••" value={formData.senha} onChange={handleChange} required />
              </div>
            </div>

            <div className="grupo-input2">
              <label htmlFor="confirma-senha">Confirmar senha</label>
              <div className="input-sem-icone">
                <input type="password" id="confirma-senha" name="confirmaSenha" placeholder="••••••••" value={formData.confirmaSenha} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn-criar-conta">Criar conta</button>
          </form>
          {mensagem.texto && !isLogin && <p style={estiloMensagem}>{mensagem.texto}</p>}
        </section>

        {/* LADO BRANDING / LOGO */}
        <section className="area-branding">
          <div className="logo">
            <img src={logo} alt="Logo BBEletroRota" className="logo-svg" />
            <span className="logo-texto">BBEletroRota</span>
          </div>

          <div className="textos-branding">
            <h2>Gerencie sua mobilidade elétrica</h2>
            <p>Planejamento de rotas inteligente para veículos elétricos com a confiança do Banco do Brasil</p>
          </div>

          <footer className="rodape-branding">
            <span>© 2026 Banco do Brasil</span>
            <div className="links-rodape">
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
            </div>
          </footer>
        </section>
      </div>

      <button 
        type="button" 
        className="btn-voltar-home" 
        onClick={() => navigate('/')}
        aria-label="Voltar para a Home"
      >
        ✕ Voltar para Home
      </button>
    </>
  );
}