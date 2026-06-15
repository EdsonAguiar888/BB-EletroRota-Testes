

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemCarro from '../assets/Meu BB-EletroRota.png';
// import './EditarPerfil.css';

// Importando a função específica para validação de perfil unificado
import { validarPerfilVeiculo } from '../components/Validacoes';

export default function EditarPerfil({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');
  
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [veiculoSelecionadoId, setVeiculoSelecionadoId] = useState('');

  const [errosCampos, setErrosCampos] = useState({}); // Para feedback visual nos inputs
  
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    marca: usuario?.veiculo?.marca || '',
    potencia: usuario?.veiculo?.potencia || '',
    bateriaAtual: usuario?.veiculo?.bateriaAtual || ''
  });

  // API SIMULADA MOCKAPAPI E SERVIDOR LOCAL PARA PERSISTÊNCIA DE DADOS
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
    // Limpa a marcação de erro se o usuário voltou a corrigir o input
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
      setErrosCampos({}); // Reseta erros ao trocar de carro para recalcular se necessário
    }
  };



// Função para ATUALIZAR (EDITAR) - Corrigida para forçar a atualização imediata
  const handleUpdate = async (e) => {
    e.preventDefault();
    

    // --- EXECUÇÃO DA VALIDAÇÃO ANTES DE ENVIAR AS ALTERAÇÕES ---
    const errosValida = validarPerfilVeiculo(formData);

    if (Object.keys(errosValida).length > 0) {
      setErrosCampos(errosValida);
      const primeiroErro = Object.values(errosValida)[0];
      setMensagem(`Erro: ${primeiroErro}`);
      
      return; 
    }
    
    setMensagem('Salvando...');

    // Garantindo tipos de dados corretos (Garante número onde deve ser número)
    const marcaFormatada = formData.marca;
    const potenciaFormatada = formData.potencia;
    const bateriaFormatada = formData.bateriaAtual;

    // Atualiza o carro específico dentro da lista geral de veículos
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

    // Montando o objeto exatamente como o estado global do App.jsx e o localStorage esperam
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
        // 1. Atualiza o LocalStorage primeiro
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        
        // 2. Atualiza o estado global do App.jsx para forçar o re-render de todas as páginas
        setUsuario(usuarioAtualizado);
        
        // 3. Força a atualização dos veículos locais da página EditarPerfil
        setListaVeiculos(usuarioAtualizado.veiculos);

        setMensagem('Perfil atualizado com sucesso!');
        setTimeout(() => setMensagem(''), 3000);
        window.scrollTo({ top: 50, behavior: 'smooth' });
        
        
      } else {
        setMensagem('Erro ao salvar as alterações no servidor.');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };


  // Funcao excluir

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

  // Mesclagem condicional para os estilos dos inputs dinamicamente
  const obterEstiloInput = (nomeCampo) => {
    return errosCampos[nomeCampo] 
      ? { ...inputStyle, border: '2px solid red' } 
      : inputStyle;
  };

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
              <input 
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
                maxLength={40} // Bloqueio em 40 caracteres
                style={obterEstiloInput('nome')} 
                required 
              />
            </div>

            <div style={inputGroup}>
              <label>Email:</label>
              <input 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                maxLength={30} // Bloqueio em 30 caracteres
                style={obterEstiloInput('email')} 
                required 
              />
            </div>

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
                <input 
                  name="marca" 
                  value={formData.marca} 
                  onChange={handleChange} 
                  maxLength={20} // Bloqueio de 5 a 20 caracteres
                  style={obterEstiloInput('marca')} 
                  required 
                />
              </div>
              <div style={inputGroup}>
                <label>Potência (kW):</label>
                <input 
                  name="potencia" 
                  value={formData.potencia} 
                  onChange={handleChange} 
                  maxLength={4} // Não deixa digitar mais que 4 caracteres
                  style={obterEstiloInput('potencia')} 
                  required 
                />
              </div>
            </div>

            <div style={inputGroup}>
              <label>Bateria Atual (%):</label>
              <input 
                name="bateriaAtual" 
                value={formData.bateriaAtual} 
                onChange={handleChange} 
                //type="number"
                maxLength={3} // Não deixa digitar mais que 3 caracteres
                style={obterEstiloInput('bateriaAtual')} 
                required 
              />
            </div>

            {mensagem && (
              <p style={{ color: mensagem.includes('Erro') ? 'red' : 'green', fontWeight: 'bold' }}>
                {mensagem}
              </p>
            )}

            <div style={buttonGroupStyle}>
              <button type="submit" style={editButtonStyle}>Salvar Alterações</button>
              <button type="button" onClick={handleDelete} style={deleteButtonStyle}>Excluir My Conta</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

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

