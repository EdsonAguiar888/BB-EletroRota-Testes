import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemCarro from '../assets/Meu BB-EletroRota.png';
import './EditarPerfil.css';

export default function EditarPerfil({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [veiculoSelecionadoId, setVeiculoSelecionadoId] = useState('');

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
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const listaVeiculosAtualizada = listaVeiculos.map(v => {
      if (v.idVeiculo === veiculoSelecionadoId) {
        return { ...v, marca: formData.marca, potencia: formData.potencia, bateriaAtual: formData.bateriaAtual };
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
      veiculos: listaVeiculosAtualizada.length > 0
        ? listaVeiculosAtualizada
        : [{ idVeiculo: Date.now().toString(), marca: formData.marca, potencia: formData.potencia, bateriaAtual: formData.bateriaAtual }]
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
              <input name="nome" value={formData.nome} onChange={handleChange} className="inputStyle" />
            </div>

            <div className="inputGroup">
              <label>Email:</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="inputStyle" />
            </div>

            <div className="inputGroup">
              <label className="labelDestaque">Selecionar Veículo em Uso:</label>
              <select value={veiculoSelecionadoId} onChange={handleSelectVeiculo} className="selectStyle">
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
                <input name="marca" value={formData.marca} onChange={handleChange} className="inputStyle" />
              </div>
              <div className="inputGroup">
                <label>Potência (kW):</label>
                <input name="potencia" value={formData.potencia} onChange={handleChange} className="inputStyle" />
              </div>
            </div>

            <div className="inputGroup">
              <label>Bateria Atual (%):</label>
              <input name="bateriaAtual" type="number" value={formData.bateriaAtual} onChange={handleChange} className="inputStyle" />
            </div>

            {mensagem && <p className="mensagemSucesso">{mensagem}</p>}

            <div className="buttonGroupStyle">
              <button type="submit" className="editButtonStyle">Salvar Alterações</button>
              <button type="button" onClick={handleDelete} className="deleteButtonStyle">Excluir Minha Conta</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}