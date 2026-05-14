import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./Login.css";
import logo from "../assets/BBEletroRota-Logo.svg";
import { getUsuariosCollectionUrl } from "../api/usuariosApi.js";
export default function Auth({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmaSenha: '' });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: 'Validando...', tipo: '' });

    try {
      if (isLogin) {
        const resp = await fetch(getUsuariosCollectionUrl());
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
        if (formData.senha !== formData.confirmaSenha) {
          setMensagem({ texto: 'Senhas não coincidem.', tipo: 'error' });
          return;
        }
        const resp = await fetch(getUsuariosCollectionUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: formData.nome, email: formData.email, senha: formData.senha })
        });
        if (resp.ok) {
          await resp.json();
          setFormData((prev) => ({
            ...prev,
            nome: '',
            confirmaSenha: ''
          }));
          setIsLogin(true);
          setMensagem({
            texto: 'Conta criada! Entre com seu e-mail e senha abaixo.',
            tipo: 'success'
          });
        } else {
          let detalhe = 'Não foi possível cadastrar.';
          try {
            const errBody = await resp.json();
            if (errBody?.message) detalhe = errBody.message;
          } catch {
            /* ignore */
          }
          setMensagem({ texto: detalhe, tipo: 'error' });
        }
      }
    } catch (err) {
      const textoBase = 'Erro de conexão com o servidor.';
      const dicaDev =
        import.meta.env.DEV &&
        ' A API mock (json-server) precisa estar na porta 3000 — use `npm run dev`, que sobe o front e a API juntos.';
      setMensagem({ texto: textoBase + (dicaDev || ''), tipo: 'error' });
    }
  };

  const toggleToCadastro = () => {
    setIsLogin(false);
  };

  const toggleToLogin = () => {
    setIsLogin(true);
  };

  return (
    <main className={`container-login ${!isLogin ? 'modo-cadastro' : ''}`}>
      {/* LADO ÁREA DE LOGIN */}
      <section className="area-login">
        {/* Seletor superior (Entrar / Criar Conta) */}
        <div className="seletor-superior">
          <button className="btn-ativo" id="btn-login">Entrar</button>
          <button className="btn-inativo" id="btn-cadastro" onClick={toggleToCadastro}>Criar Conta</button>
        </div>

        {/* Títulos */}
        <div className="textos-boas-vindas">
          <h1>Bem-vindo de volta</h1>
          <p>Entre com suas credenciais</p>
        </div>

        {/* Formulário */}
        <form className="formulario-login" onSubmit={handleSubmit}>
          {/* Campo de E-mail */}
          <div className="grupo-input">
            <label htmlFor="email">E-mail</label>
            <div className="input-com-icone">
              <i className="fa-regular fa-envelope icone-esq"></i>
              <input type="email" id="email" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          {/* Campo de Senha */}
          <div className="grupo-input">
            <label htmlFor="senha">Senha</label>
            <div className="input-com-icone">
              <i className="fa-solid fa-lock icone-esq"></i>
              <input type="password" id="senha" name="senha" placeholder="••••••" value={formData.senha} onChange={handleChange} required />
              <i className="fa-regular fa-eye olho"></i>
            </div>
          </div>

          {/* Links extras: Lembrar e Esqueci a senha */}
          <div className="opcoes-extras">
            <label className="lembrar-mim">
              <input type="checkbox" /> Lembrar de mim
            </label>
            <a href="#" className="link-esqueceu">Esqueceu a senha?</a>
          </div>

          {/* Botão principal de Entrar */}
          <button type="submit" className="btn-enter">
            Entrar <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
        {mensagem.texto && <p className={mensagem.tipo}>{mensagem.texto}</p>}
      </section>

      {/* LADO ÁREA DE CADASTRO */}
      <section className="area-cadastro" id="area-cadastro">
        <div className="seletor-superior">
          <button className="btn-inativo" id="voltar-login" onClick={toggleToLogin}>Entrar</button>
          <button className="btn-ativo">Criar Conta</button>
        </div>

        <div className="texto-cadastro">
          <h1>Crie sua conta</h1>
          <p>Preencha os dados abaixo</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grupo-input2">
            <label htmlFor="nome">Nome completo</label>
            <div className="input-com-icone">
              <i className="fa-regular fa-user icone-user"></i>
              <input type="text" id="nome" name="nome" placeholder="Seu nome" value={formData.nome} onChange={handleChange} required />
            </div>
          </div>

          <div className="grupo-input2">
            <label htmlFor="emailCadastro">E-mail</label>
            <div className="input-com-icone">
              <i className="fa-regular fa-envelope icone-enve"></i>
              <input type="email" id="emailCadastro" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="grupo-input2">
            <label htmlFor="senhaCadastro">Senha</label>
            <div className="input-com-icone">
              <i className="fa-solid fa-lock icone-cadeado"></i>
              <input type="password" id="senhaCadastro" name="senha" placeholder="••••••••" value={formData.senha} onChange={handleChange} required />
              <i className="fa-regular fa-eye olho"></i>
            </div>
          </div>

          <div className="grupo-input2">
            <label htmlFor="confirma-senha">Confirmar senha</label>
            <div className="input-com-icone">
              <i className="fa-solid fa-lock icone-cadeado"></i>
              <input type="password" id="confirma-senha" name="confirmaSenha" placeholder="••••••••" value={formData.confirmaSenha} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-criar-conta">
            Criar conta <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
        {mensagem.texto && <p className={mensagem.tipo}>{mensagem.texto}</p>}
      </section>

      {/* LADO BRANDING / LOGO */}
      <section className="area-branding">
        {/* Espaço para a Logo exportada do Figma */}
        <div className="logo">
          <img src={logo} alt="Logo BBEletroRota" className="logo-svg" />
          <span className="logo-texto">BB EletroRota</span>
        </div>

        {/* Textos da direita */}
        <div className="textos-branding">
          <h2>Gerencie sua mobilidade elétrica</h2>
          <p>Planejamento de rotas inteligente para veículos elétricos com a confiança do Banco do Brasil</p>
        </div>

        {/* Rodapé da direita */}
        <footer className="rodape-branding">
          <span>© 2026 Banco do Brasil</span>
          <div className="links-rodape">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </footer>
      </section>
    </main>
  );
}