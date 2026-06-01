
import { useState, useEffect } from 'react';
import './GerenciarVeiculos.css'; 
// Importando a função de validação que criamos
import { validarFormularioVeiculo } from '../components/Validacoes'; 


export default function GerenciaVeiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [formData, setFormData] = useState({
    marca: '',
    potencia: '',
    bateriaAtual: ''
  });

  const [editId, setEditId] = useState(null); 
  const [mensagem, setMensagem] = useState('');
  // Estado opcional para você pintar as bordas dos inputs de vermelho se quiser
  const [errosCampos, setErrosCampos] = useState({}); 

 
  useEffect(() => {
    const dadosSessao = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (dadosSessao) {
      setUsuarioLogado(dadosSessao);
      carregarVeiculosDoUsuario(dadosSessao.id);
    } else {
      setMensagem('Erro: Nenhum usuário logado encontrado.');
    }
  }, []);

  const carregarVeiculosDoUsuario = async (idUsuario) => {
    window.scrollTo({ top: 90, behavior: 'smooth' });
    try {
      const response = await fetch(`${API_URL}/${idUsuario}`);
      if (response.ok) {
        const usuarioCompleto = await response.json();
        const listaVeiculos = Array.isArray(usuarioCompleto.veiculos)
          ? usuarioCompleto.veiculos
          : (usuarioCompleto.veiculo ? [{ idVeiculo: "1", ...usuarioCompleto.veiculo }] : []);

        setVeiculos(listaVeiculos);
        const sessaoAtualizada = { ...usuarioCompleto, veiculos: listaVeiculos };
        localStorage.setItem('usuarioLogado', JSON.stringify(sessaoAtualizada));
      }
    } catch (err) {
      console.error('Erro ao conectar com a API:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpa o erro do campo assim que o usuário volta a digitar nele
    if (errosCampos[e.target.name]) {
      setErrosCampos({ ...errosCampos, [e.target.name]: null });
    }
  };

  // CREATE e UPDATE: Onde a validação acontece
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioLogado) return;

    // --- EXECUÇÃO DA VALIDAÇÃO ANTES DE SALVAR ---
    const errosValida = validarFormularioVeiculo(formData);
    
    // Se o objeto de erros tiver alguma chave, significa que falhou
    if (Object.keys(errosValida).length > 0) {
      setErrosCampos(errosValida);
      // Pega o primeiro erro da lista para exibir na mensagem global de status
      const primeiroErro = Object.values(errosValida)[0];
      setMensagem(`Erro: ${primeiroErro}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return; // Bloqueia a requisição HTTP aqui
    }

    setMensagem('Salvando...');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let listaNova = [...veiculos];

    if (editId) {
      listaNova = listaNova.map(v =>
        v.idVeiculo === editId
          ? { idVeiculo: editId, marca: formData.marca, potencia: formData.potencia, bateriaAtual: formData.bateriaAtual }
          : v
      );
    } else {
      const novoVeiculo = {
        idVeiculo: Date.now().toString(),
        marca: formData.marca,
        potencia: formData.potencia,
        bateriaAtual: formData.bateriaAtual
      };
      listaNova.push(novoVeiculo);
    }

    const payload = {
      ...usuarioLogado,
      veiculos: listaNova,
      veiculo: listaNova[0] || null 
    };

    try {
      const response = await fetch(`${API_URL}/${usuarioLogado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMensagem(editId ? 'Veículo atualizado com sucesso!' : 'Novo veículo cadastrado!');
        
        limparFormulario();
        carregarVeiculosDoUsuario(usuarioLogado.id);
        setTimeout(() => setMensagem(''), 3000);
      }
    } catch (err) {
      setMensagem('Erro ao salvar no servidor.');
    }
  };

  const handleEdit = (veiculo) => {
    window.scrollTo({ top: 90, behavior: 'smooth' });
    setEditId(veiculo.idVeiculo);
    setFormData({
      marca: veiculo.marca,
      potencia: veiculo.potencia,
      bateriaAtual: veiculo.bateriaAtual
    });
    setErrosCampos({}); // Limpa erros antigos se houver
  };

  const handleDelete = async (idVeiculoDeletar) => {
    if (!window.confirm('Tem certeza que deseja remover este veículo?')) return;
    if (!usuarioLogado) return;

    const listaFiltrada = veiculos.filter(v => v.idVeiculo !== idVeiculoDeletar);
    const payload = {
      ...usuarioLogado,
      veiculos: listaFiltrada,
      veiculo: listaFiltrada[0] || null
    };

    try {
      const response = await fetch(`${API_URL}/${usuarioLogado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMensagem('Veículo removido com sucesso.');
        carregarVeiculosDoUsuario(usuarioLogado.id);
        limparFormulario();
      }
    } catch (err) {
      setMensagem('Erro ao excluir veículo.');
    }
  };

  const limparFormulario = () => {
    setFormData({
      marca: '',
      potencia: '',
      bateriaAtual: ''
    });
    setEditId(null);
    setErrosCampos({});
  };

  return (
    <div className="gerenciar-container">
      <h2>Gerenciamento de Veículos</h2>
      {usuarioLogado && <p style={{ color: '#555' }}>Olá, <strong>{usuarioLogado.nome}</strong>! Gerencie a frota dos seus veículos elétricos abaixo.</p>}

      <form onSubmit={handleSubmit} className="gerenciar-form">
        <label className="form-label">{editId ? 'Editar Veículo:' : 'Cadastrar Novo Veículo:'}</label>
        
        {/* Adicionado feedback visual simples usando inline styles caso haja erro no input */}
        <input 
          name="marca" 
          value={formData.marca} 
          onChange={handleChange} 
          placeholder="Marca (ex: Tesla, BYD)" 
          maxLength={20} // Bloqueio de 5 a 20 caracteres
          style={errosCampos.marca ? { border: '2px solid red' } : {}}
          required 
        />
        
        <input 
          name="potencia" 
          value={formData.potencia} 
          onChange={handleChange} 
          placeholder="Potência (ex: 200)" 
          maxLength={4} // Não deixa digitar mais que 4 caracteres
          style={errosCampos.potencia ? { border: '2px solid red' } : {}}
          required 
        />
        
        <input 
          name="bateriaAtual" 
          value={formData.bateriaAtual} 
          onChange={handleChange} 
          placeholder="Bateria Atual (ex: 99)" 
          maxLength={3} // Não deixa digitar mais que 3 caracteres
          style={errosCampos.bateria ? { border: '2px solid red' } : {}}
          required 
        />

        <div className="btn-group">
          <button type="submit" className="btn-submit">
            {editId ? 'Atualizar Veículo' : 'Adicionar Veículo'}
          </button>
          {editId && (
            <button type="button" onClick={limparFormulario} className="btn-cancel">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {mensagem && (
        <p className={`mensagem-status ${mensagem.includes('Erro') ? 'mensagem-erro' : 'mensagem-sucesso'}`}>
          {mensagem}
        </p>
      )}

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Marca do Veículo</th>
            <th>Potência</th>
            <th>Bateria Atual</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.length > 0 ? (
            veiculos.map((v, index) => (
              <tr key={v.idVeiculo || index}>
                <td data-label="Marca: " style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{v.marca}</td>
                <td data-label="Potência: ">{v.potencia} kW</td>
                <td data-label="Bateria Atual: ">{v.bateriaAtual ? `${v.bateriaAtual}%` : 'N/A'}</td>
                <td>
                  <button onClick={() => handleEdit(v)} className="action-btn btn-edit">Editar</button>
                  <button onClick={() => handleDelete(v.idVeiculo)} className="action-btn btn-delete">Excluir</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                Nenhum veículo cadastrado para esta conta.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
