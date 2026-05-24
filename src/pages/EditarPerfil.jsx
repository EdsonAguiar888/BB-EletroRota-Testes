


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemCarro from '../assets/Meu BB-EletroRota.png';

export default function EditarPerfil({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');

  // Estado para armazenar a lista completa de veículos vinda da API
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [veiculoSelecionadoId, setVeiculoSelecionadoId] = useState('');

  // Estado para os campos de edição do formulário
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

  // BUSCA ATIVA: Alimenta os dados do perfil direto da API ao carregar o componente
  useEffect(() => {
    const buscarDadosAtualizados = async () => {
      if (!usuario?.id) return;

      try {
        const response = await fetch(`${API_URL}/${usuario.id}`);
        if (response.ok) {
          const dadosApi = await response.json();

          // 1. Atualiza o formulário com o que está na API de verdade
          setFormData({
            nome: dadosApi.nome || '',
            email: dadosApi.email || '',
            marca: dadosApi.veiculo?.marca || '',
            potencia: dadosApi.veiculo?.potencia || '',
            bateriaAtual: dadosApi.veiculo?.bateriaAtual || ''
          });

          // 2. Alimenta a lista de veículos do select box
          const nVeiculos = Array.isArray(dadosApi.veiculos) ? dadosApi.veiculos : [];
          setListaVeiculos(nVeiculos);

          // 3. Sincroniza o select box com o veículo em uso atual
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
  }, [usuario?.id]); // Executa sempre que o ID do usuário for validado

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função disparada ao trocar de carro no select box
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
    }
  };

  // Função para ATUALIZAR (EDITAR)
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Atualiza o carro específico dentro da lista geral de veículos
    const listaVeiculosAtualizada = listaVeiculos.map(v => {
      if (v.idVeiculo === veiculoSelecionadoId) {
        return {
          ...v,
          marca: formData.marca,
          potencia: formData.potencia,
          bateriaAtual: formData.bateriaAtual
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
        marca: formData.marca,
        potencia: formData.potencia,
        bateriaAtual: formData.bateriaAtual
      },
      veiculos: listaVeiculosAtualizada.length > 0 ? listaVeiculosAtualizada : [{ idVeiculo: Date.now().toString(), marca: formData.marca, potencia: formData.potencia, bateriaAtual: formData.bateriaAtual }]
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
        setMensagem('Perfil atualizado com sucesso!');
        setTimeout(() => setMensagem(''), 3000);
      }
    } catch (error) {
      setMensagem('Erro ao atualizar perfil.');
    }
  };

  // Função para EXCLUIR conta
  const handleDelete = async () => {
    if (!window.confirm('TEM CERTEZA? Isso excluirá sua conta permanentemente.'))
      return;

    try {
      const response = await fetch(`${API_URL}/${usuario.id}`, {
        method: 'DELETE'
      });

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

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        {/* Lado Esquerdo: Imagem */}
        <div style={imageSectionStyle}>
          <img src={imagemCarro} alt="Carro Elétrico" style={imageStyle} />
          <h3 style={{ color: '#2c3e50', marginTop: '20px' }}>Meu BB EletroRota</h3>
        </div>

        {/* Lado Direito: Informações e Formulário */}
        <div style={infoSectionStyle}>
          <h2>Configurações de Perfil</h2>

          <form onSubmit={handleUpdate} style={formStyle}>
            <div style={inputGroup}>
              <label>Nome:</label>
              <input name="nome" value={formData.nome} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label>Email:</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} style={inputStyle} />
            </div>

            {/* CAIXA DE SELEÇÃO DINÂMICA ALIMENTADA PELA API */}
            <div style={inputGroup}>
              <label style={{ fontWeight: 'bold', color: '#2980b9' }}>Selecionar Veículo em Uso:</label>
              <select
                value={veiculoSelecionadoId}
                onChange={handleSelectVeiculo}
                style={selectStyle}
              >
                <option value="">-- Selecione um veículo da sua frota --</option>
                {listaVeiculos.map((v, index) => (
                  <option key={v.idVeiculo || index} value={v.idVeiculo}>
                    {v.marca} ({v.potencia} kW)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={inputGroup}>
                <label>Modelo:</label>
                <input name="marca" value={formData.marca} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label>Potência (kW):</label>
                <input name="potencia" value={formData.potencia} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={inputGroup}>
              <label>Bateria Atual (%):</label>
              <input name="bateriaAtual" type="number" value={formData.bateriaAtual} onChange={handleChange} style={inputStyle} />
            </div>

            {mensagem && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensagem}</p>}

            <div style={buttonGroupStyle}>
              <button type="submit" style={editButtonStyle}>Salvar Alterações</button>
              <button type="button" onClick={handleDelete} style={deleteButtonStyle}>Excluir Minha Conta</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

// ESTILOS (Mantidos conforme o seu padrão original)
const containerStyle = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const cardStyle = { display: 'flex', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden', maxWidth: '1000px', width: '100%' };
const imageSectionStyle = { flex: 1, background: '#f8f9fa', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #eee' };
const imageStyle = { width: '100%', maxWidth: '350px', height: 'auto', borderRadius: '15px' };
const infoSectionStyle = { flex: 1.2, padding: '40px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' };
const buttonGroupStyle = { display: 'flex', gap: '15px', marginTop: '20px' };
const editButtonStyle = { flex: 1, padding: '12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const deleteButtonStyle = { padding: '12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const selectStyle = { padding: '10px', borderRadius: '8px', border: '2px solid #3498db', fontSize: '1rem', backgroundColor: '#fdfefe', cursor: 'pointer', color: '#2c3e50', fontWeight: '600' };




