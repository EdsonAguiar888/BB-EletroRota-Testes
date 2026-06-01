import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemCarro from '../assets/Meu BB-EletroRota.png';
import './EditarPerfil.css';

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

  // Mesclagem condicional para os estilos dos inputs dinamicamente
  const obterEstiloInput = (nomeCampo) => {
    return errosCampos[nomeCampo] 
      ? { ...inputStyle, border: '2px solid red' } 
      : {};
  };

  return (
    <div className="containerStyle">
      <div className="cardStyle">

        <div className="imageSectionStyle">
          <img src={imagemCarro} alt="Carro Elétrico" className="imageStyle" />
          <h3>Meu BB EletroRota</h3>
        </div>

        <div className="infoSectionStyle">
          <h2>Configurações de Perfil</h2>

          <form onSubmit={handleUpdate} className="formStyle">

            <div className="inputGroup">
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

            <div className="inputGroup">
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

            <div className="inputGroup">
              <label style={{ fontWeight: 'bold', color: '#2980b9' }}>Selecionar Veículo em Uso:</label>
              <select
                value={veiculoSelecionadoId}
                onChange={handleSelectVeiculo}
                className='selectStyle'
              >
                <option value="">-- Selecione um veículo da sua frota --</option>
                {listaVeiculos.map((v, index) => (
                  <option key={v.idVeiculo || index} value={v.idVeiculo}>
                    {v.marca} ({v.potencia} kW)
                  </option>
                ))}
              </select>
            </div>

            <div className="rowStyle">
              <div className="inputGroup">
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
              <div className="inputGroup">
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

            <div className="inputGroup">
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

            <div className="buttonGroupStyle">
              <button type="submit" className="editButtonStyle">Salvar alterações</button>
              <button type="button" onClick={handleDelete} className="deleteButtonStyle">Excluir conta</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}