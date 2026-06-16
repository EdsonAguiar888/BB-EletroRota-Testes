import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemCarro from '../assets/Meu BB-EletroRota.png';

import { validarPerfilVeiculo } from '../components/Validacoes';

// ===================== HOOK DE BREAKPOINT =====================
function useBreakpoint() {
  const [largura, setLargura] = useState(window.innerWidth);

  useEffect(() => {
    const aoRedimensionar = () => setLargura(window.innerWidth);
    window.addEventListener('resize', aoRedimensionar);
    return () => window.removeEventListener('resize', aoRedimensionar);
  }, []);

  if (largura <= 767) return 'smartphone';
  if (largura <= 1024) return 'tablet';
  return 'desktop';
}

// ===================== CORES =====================
const cores = {
  azul: '#3498db',
  azulMeiaBoca: '#2980b9',
  azulCinzaEscuro: '#2c3e50',
  delete: '#e74c3c',
  perigo: '#c0392b',
  sucesso: '#008000',
  branco: '#ffffff',
  fundo: '#f8f9fa',
  borda: '#eeeeee',
  bordaInput: '#cccccc',
  sombraCard: '0 10px 30px #0000001a'
};

// ===================== ESTILOS COM BREAKPOINTS =====================

const containerStyle = (bp) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: bp === 'smartphone' ? '20px 16px' : '20px'
});

const cardStyle = (bp) => ({
  display: 'flex',
  flexDirection: 'row',
  background: cores.branco,
  borderRadius: bp === 'smartphone' ? 0 : '20px',
  boxShadow: bp === 'smartphone' ? 'none' : cores.sombraCard,
  overflow: 'hidden',
  maxWidth: '1000px',
  width: '100%',
  minHeight: bp === 'smartphone' ? 'calc(100vh - 64px)' : 'auto',
  justifyContent: bp === 'smartphone' ? 'center' : 'flex-start'
});

const imageSectionStyle = (bp) => ({
  flex: 1,
  background: cores.fundo,
  padding: bp === 'smartphone' ? 0 : bp === 'tablet' ? '30px' : '40px',
  display: bp === 'smartphone' ? 'none' : 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: `1px solid ${cores.borda}`,
  overflow: 'hidden'
});

const imageStyle = {
  width: '100%',
  maxWidth: '350px',
  height: 'auto',
  borderRadius: '15px',
  objectFit: 'contain',
  objectPosition: 'center'
};

const infoSectionStyle = (bp) => ({
  flex: 1.2,
  padding: bp === 'smartphone' ? '30px 15px 15px' : bp === 'tablet' ? '30px' : '40px'
});

const tituloInfoSectionStyle = (bp) => ({
  color: cores.azulCinzaEscuro,
  marginBottom: '25px',
  textAlign: 'center'   // igual ao antigo: sempre centralizado
});

const formStyle = (bp) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: bp === 'smartphone' ? '10px' : '15px',
  marginTop: bp === 'smartphone' ? '10px' : '20px'
});

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  flex: 1,
  alignItems: 'center'  // centraliza label + input como no antigo
};

const labelStyle = {
  color: cores.azulCinzaEscuro,
  textAlign: 'center',
  width: '100%'         // label ocupa toda a largura para o texto centrar
};

const inputStyle = (bp) => ({
  padding: bp === 'smartphone' ? '8px' : '10px',
  borderRadius: '8px',
  border: `1px solid ${cores.bordaInput}`,
  fontSize: bp === 'smartphone' ? '0.9rem' : '1rem',
  width: '100%',
  boxSizing: 'border-box',
  color: '#333',
  marginBottom: bp === 'smartphone' ? '8px' : 0,
  marginTop: bp === 'smartphone' ? '3px' : 0
});

const selectStyle = (bp) => ({
  ...inputStyle(bp),
  border: `2px solid ${cores.azul}`,
  backgroundColor: '#fdfefe',
  cursor: 'pointer',
  color: cores.azulCinzaEscuro,
  fontWeight: 600
});

const rowStyle = (bp) => ({
  display: 'flex',
  gap: bp === 'smartphone' ? '8px' : '15px'
});

const labelDestaqueStyle = {
  fontWeight: 'bold',
  color: cores.azulMeiaBoca,
  textAlign: 'center',
  width: '100%'
};

const buttonGroupStyle = (bp) => ({
  display: 'flex',
  gap: bp === 'smartphone' ? '10px' : '15px',
  marginTop: bp === 'smartphone' ? '12px' : '20px',
  justifyContent: 'center'  // botões centralizados como no antigo
});

const editButtonStyle = (bp) => ({
  padding: bp === 'smartphone' ? '10px 24px' : '12px 32px',
  background: cores.azul,
  color: cores.branco,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: bp === 'smartphone' ? '0.85rem' : '1rem'
});

const deleteButtonStyle = (bp) => ({
  padding: bp === 'smartphone' ? '10px 16px' : '12px 24px',
  background: cores.delete,
  color: cores.branco,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: bp === 'smartphone' ? '0.8rem' : '1rem'
});

// ===================== COMPONENTE =====================

export default function EditarPerfil({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const bp = useBreakpoint();

  const [mensagem, setMensagem] = useState('');
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [veiculoSelecionadoId, setVeiculoSelecionadoId] = useState('');
  const [errosCampos, setErrosCampos] = useState({});

  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    marca: usuario?.veiculo?.marca || '',
    potencia: usuario?.veiculo?.potencia || '',
    bateriaAtual: usuario?.veiculo?.bateriaAtual || ''
  });

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/usuarios'
    : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios';

  useEffect(() => {
    const buscarDadosAtualizados = async () => {
      if (!usuario?.id) return;

      try {
        const response = await fetch(`${API_URL}/${usuario.id}`);
        if (response.ok) {
          const dadosApi = await response.json();

          setFormData({
            nome: dadosApi.nome || '',
            email: dadosApi.email || '',
            marca: dadosApi.veiculo?.marca || '',
            potencia: dadosApi.veiculo?.potencia || '',
            bateriaAtual: dadosApi.veiculo?.bateriaAtual || ''
          });

          const nVeiculos = Array.isArray(dadosApi.veiculos) ? dadosApi.veiculos : [];
          setListaVeiculos(nVeiculos);

          if (dadosApi.veiculo?.idVeiculo) {
            setVeiculoSelecionadoId(dadosApi.veiculo.idVeiculo);
          } else if (dadosApi.veiculo?.marca) {
            const encontrado = nVeiculos.find(v => v.marca === dadosApi.veiculo.marca);
            if (encontrado) setVeiculoSelecionadoId(encontrado.idVeiculo);
          }
        }
      } catch (err) {
        console.error("Erro ao sincronizar EditarPerfil com a API:", err);
      }
    };

    buscarDadosAtualizados();
  }, [usuario?.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errosCampos[e.target.name]) {
      setErrosCampos({ ...errosCampos, [e.target.name]: null });
    }
  };

  const handleSelectVeiculo = (e) => {
    const idEscolhido = e.target.value;
    setVeiculoSelecionadoId(idEscolhido);

    const carroCarregado = listaVeiculos.find(v => v.idVeiculo === idEscolhido);

    if (carroCarregado) {
      setFormData(prev => ({
        ...prev,
        marca: carroCarregado.marca,
        potencia: carroCarregado.potencia,
        bateriaAtual: carroCarregado.bateriaAtual
      }));
      setErrosCampos({});
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const errosValida = validarPerfilVeiculo(formData);

    if (Object.keys(errosValida).length > 0) {
      setErrosCampos(errosValida);
      const primeiroErro = Object.values(errosValida)[0];
      setMensagem(`Erro: ${primeiroErro}`);
      return;
    }

    setMensagem('Salvando...');

    const marcaFormatada = formData.marca;
    const potenciaFormatada = formData.potencia;
    const bateriaFormatada = formData.bateriaAtual;

    const listaVeiculosAtualizada = listaVeiculos.map(v => {
      if (v.idVeiculo === veiculoSelecionadoId) {
        return {
          ...v,
          marca: marcaFormatada,
          potencia: potenciaFormatada,
          bateriaAtual: bateriaFormatada
        };
      }
      return v;
    });

    const usuarioAtualizado = {
      ...usuario,
      nome: formData.nome,
      email: formData.email,
      veiculo: {
        idVeiculo: veiculoSelecionadoId,
        marca: marcaFormatada,
        potencia: potenciaFormatada,
        bateriaAtual: bateriaFormatada
      },
      veiculos: listaVeiculosAtualizada.length > 0
        ? listaVeiculosAtualizada
        : [{ idVeiculo: Date.now().toString(), marca: marcaFormatada, potencia: potenciaFormatada, bateriaAtual: bateriaFormatada }]
    };

    try {
      const response = await fetch(`${API_URL}/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioAtualizado)
      });

      if (response.ok) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        setUsuario(usuarioAtualizado);
        setListaVeiculos(usuarioAtualizado.veiculos);
        setMensagem('Perfil atualizado com sucesso!');
        setTimeout(() => setMensagem(''), 3000);
        window.scrollTo({ top: 80, behavior: 'smooth' });
      } else {
        setMensagem('Erro ao salvar as alterações no servidor.');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('TEM CERTEZA? Isso excluirá sua conta permanentemente.')) return;

    try {
      const response = await fetch(`${API_URL}/${usuario.id}`, { method: 'DELETE' });

      if (response.ok) {
        localStorage.removeItem('usuarioLogado');
        setUsuario(null);
        navigate('/');
      }
    } catch (error) {
      alert('Erro ao excluir conta.');
    }
  };

  if (!usuario) return null;

  const obterEstiloInput = (nomeCampo) => {
    const base = inputStyle(bp);
    return errosCampos[nomeCampo]
      ? { ...base, border: '2px solid red' }
      : base;
  };

  return (
    <div style={containerStyle(bp)}>
      <div style={cardStyle(bp)}>

        {/* Lado Esquerdo: Imagem */}
        <div style={imageSectionStyle(bp)}>
          <img src={imagemCarro} alt="Carro Elétrico" style={imageStyle} />
          <h3 style={{ color: cores.azulCinzaEscuro, marginTop: '20px' }}>Meu BB EletroRota</h3>
        </div>

        {/* Lado Direito: Informações e Formulário */}
        <div style={infoSectionStyle(bp)}>
          <h2 style={tituloInfoSectionStyle(bp)}>Configurações de Perfil</h2>

          <form onSubmit={handleUpdate} style={formStyle(bp)}>
            <div style={inputGroup}>
              <label style={labelStyle}>Nome:</label>
              <input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                maxLength={40}
                style={obterEstiloInput('nome')}
                required
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Email:</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={30}
                style={obterEstiloInput('email')}
                required
              />
            </div>

            <div style={inputGroup}>
              <label style={labelDestaqueStyle}>Selecionar Veículo em Uso:</label>
              <select
                value={veiculoSelecionadoId}
                onChange={handleSelectVeiculo}
                style={selectStyle(bp)}
              >
                <option value="">-- Selecione um veículo da sua frota --</option>
                {listaVeiculos.map((v, index) => (
                  <option key={v.idVeiculo || index} value={v.idVeiculo}>
                    {v.marca} ({v.potencia} kW)
                  </option>
                ))}
              </select>
            </div>

            <div style={rowStyle(bp)}>
              <div style={inputGroup}>
                <label style={labelStyle}>Modelo:</label>
                <input
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  maxLength={20}
                  style={obterEstiloInput('marca')}
                  required
                />
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Potência (kW):</label>
                <input
                  name="potencia"
                  value={formData.potencia}
                  onChange={handleChange}
                  maxLength={4}
                  style={obterEstiloInput('potencia')}
                  required
                />
              </div>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Bateria Atual (%):</label>
              <input
                name="bateriaAtual"
                value={formData.bateriaAtual}
                onChange={handleChange}
                maxLength={3}
                style={obterEstiloInput('bateriaAtual')}
                required
              />
            </div>

            {mensagem && (
              <p style={{
                color: mensagem.includes('Erro') ? cores.perigo : cores.sucesso,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {mensagem}
              </p>
            )}

            <div style={buttonGroupStyle(bp)}>
              <button type="submit" style={editButtonStyle(bp)}>Salvar Alterações</button>
              <button type="button" onClick={handleDelete} style={deleteButtonStyle(bp)}>Excluir Minha Conta</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}