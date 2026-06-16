import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { validarAuth, emailJaCadastrado } from '../components/Validacoes';
import "./Login.css";

import logo from '../assets/logo bb transp a.png';

function MensagemErroCampo({ campo, errosCampos }) {
  if (!errosCampos[campo]) return null;
  return (
    <span className="mensagem-erro-campo" role="alert">
      {errosCampos[campo]}
    </span>
  );
}

export default function Auth({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmaSenha: '' });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [errosCampos, setErrosCampos] = useState({});

  const isApiLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const API_URL = isApiLocal
    ? 'http://localhost:3000/usuarios'
    : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errosCampos[name]) {
      setErrosCampos((prev) => ({ ...prev, [name]: null }));
    }
  };

  const aplicarErrosValidacao = (erros) => {
    setErrosCampos(erros);
    const primeiroErro = Object.values(erros)[0];
    if (primeiroErro) {
      setMensagem({ texto: primeiroErro, tipo: 'error' });
    }
    return Object.keys(erros).length === 0;
  };

  const classeInput = (nomeCampo) =>
    errosCampos[nomeCampo] ? 'input-com-erro' : '';

  const estiloMensagem = {
    marginTop: '5px',
    fontSize: '10px',
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
    setErrosCampos({});

    const erros = validarAuth(formData, true);
    if (!aplicarErrosValidacao(erros)) return;

    setMensagem({ texto: 'Validando...', tipo: '' });

    try {
      const resp = await fetch(API_URL);
      if (!resp.ok) {
        setMensagem({
          texto: isApiLocal
            ? 'Servidor indisponível. Inicie o json-server na porta 3000.'
            : 'Servidor indisponível. Tente novamente mais tarde.',
          tipo: 'error',
        });
        return;
      }

      const usuarios = await resp.json();
      const emailLogin = formData.email.toLowerCase().trim();
      const usuarioEncontrado = usuarios.find(
        (u) =>
          (u.email || '').toLowerCase().trim() === emailLogin &&
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
        texto: isApiLocal
          ? 'Erro de conexão. Rode: npx json-server --watch db.json'
          : 'Erro de conexão com o servidor. Verifique sua internet.',
        tipo: 'error',
      });
    }
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    setErrosCampos({});

    const erros = validarAuth(formData, false);
    if (!aplicarErrosValidacao(erros)) return;

    setMensagem({ texto: 'Criando conta...', tipo: '' });

    try {
      const respLista = await fetch(API_URL);
      if (!respLista.ok) {
        setMensagem({
          texto: isApiLocal
            ? 'Servidor indisponível. Inicie o json-server na porta 3000.'
            : 'Servidor indisponível. Tente novamente mais tarde.',
          tipo: 'error',
        });
        return;
      }

      const usuarios = await respLista.json();
      const emailNormalizado = formData.email.toLowerCase().trim();

      if (emailJaCadastrado(emailNormalizado, usuarios)) {
        const msg = 'Este e-mail já está cadastrado. Use outro ou faça login.';
        setErrosCampos({ email: msg });
        setMensagem({ texto: msg, tipo: 'error' });
        return;
      }

      const resp = await fetch(API_URL, {
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

      setErrosCampos({});
      setIsLogin(true);
      setMensagem({
        texto: 'Conta criada! Faça login com seu e-mail e senha.',
        tipo: 'success',
      });
    } catch {
      setMensagem({
        texto: isApiLocal
          ? 'Erro de conexão. Rode: npx json-server --watch db.json'
          : 'Erro de conexão com o servidor. Verifique sua internet.',
        tipo: 'error',
      });
    }
  };

  const toggleToCadastro = () => {
    setIsLogin(false);
    setMensagem({ texto: '', tipo: '' });
    setErrosCampos({});
  };

  const toggleToLogin = () => {
    setIsLogin(true);
    setMensagem({ texto: '', tipo: '' });
    setErrosCampos({});
  };

  return (
    <div className="pagina-login">
      <div className={`container-login ${!isLogin ? 'modo-cadastro' : ''}`}>
        {/* LADO ÁREA DE LOGIN */}
        <section className="area-login">
          <div className="textos-boas-vindas">
            <h1>Bem-vindo de volta</h1>
            <p>Entre com suas credenciais</p>
          </div>

          <form className="formulario-login" onSubmit={handleLoginSubmit}>
            <div className="grupo-input">
              <label htmlFor="email">E-mail</label>
              <div className="input-sem-icone">
                <input type="email" id="email" name="email" className={classeInput('email')} placeholder="seu@email.com" maxLength={30} value={formData.email} onChange={handleChange} required />
              </div>
              <MensagemErroCampo campo="email" errosCampos={errosCampos} />
            </div>

            <div className="grupo-input">
              <label htmlFor="senha">Senha</label>
              <div className="input-sem-icone">
                <input type="password" id="senha" name="senha" className={classeInput('senha')} placeholder="••••••" maxLength={6} value={formData.senha} onChange={handleChange} required />
              </div>
              <MensagemErroCampo campo="senha" errosCampos={errosCampos} />
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

          <div className="seletor-area-login">
            <button type="button" className="btn-inativo" id="btn-cadastro" onClick={toggleToCadastro}>Criar Conta</button>
          </div>
        </section>

        {/* LADO ÁREA DE CADASTRO */}
        <section className="area-cadastro" id="area-cadastro">
          <div className="texto-cadastro">
            <h1>Crie sua conta</h1>
            <p>Preencha os dados abaixo</p>
          </div>

          <form onSubmit={handleCadastroSubmit}>
            <div className="grupo-input2">
              <label htmlFor="nome">Nome completo</label>
              <div className="input-sem-icone">
                <input type="text" id="nome" name="nome" className={classeInput('nome')} placeholder="Seu nome" maxLength={40} value={formData.nome} onChange={handleChange} required />
              </div>
              <MensagemErroCampo campo="nome" errosCampos={errosCampos} />
            </div>

            <div className="grupo-input2">
              <label htmlFor="emailCadastro">E-mail</label>
              <div className="input-sem-icone">
                <input type="email" id="emailCadastro" name="email" className={classeInput('email')} placeholder="seu@email.com" maxLength={30} value={formData.email} onChange={handleChange} required />
              </div>
              <MensagemErroCampo campo="email" errosCampos={errosCampos} />
            </div>

            <div className="grupo-input2">
              <label htmlFor="senhaCadastro">Senha</label>
              <div className="input-sem-icone">
                <input type="password" id="senhaCadastro" name="senha" className={classeInput('senha')} placeholder="••••••" maxLength={6} value={formData.senha} onChange={handleChange} required />
              </div>
              <MensagemErroCampo campo="senha" errosCampos={errosCampos} />
            </div>

            <div className="grupo-input2">
              <label htmlFor="confirma-senha">Confirmar senha</label>
              <div className="input-sem-icone">
                <input type="password" id="confirma-senha" name="confirmaSenha" className={classeInput('confirmaSenha')} placeholder="••••••" maxLength={6} value={formData.confirmaSenha} onChange={handleChange} required />
              </div>
              <MensagemErroCampo campo="confirmaSenha" errosCampos={errosCampos} />
            </div>

            <button type="submit" className="btn-criar-conta">Criar conta</button>
          </form>
          {mensagem.texto && !isLogin && <p style={estiloMensagem}>{mensagem.texto}</p>}

          <div className="seletor-area-cadastro">
            <span className="texto-possui-conta">Já possui uma conta?</span>
            <button type="button" className="btn-inativo" id="voltar-login" onClick={toggleToLogin}>Entrar</button>
          </div>
        </section>

        {/* LADO BRANDING / LOGO */}
        <section className="area-branding">
          <div className="logo">
            <img src={logo} alt="Logo BB EletroRota" className="logo-svg" />
            {/* <span className="logo-texto">BB EletroRota</span> */}
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
        <i className="fas fa-arrow-left"></i> voltar
      </button>
    </div>
  );
}
