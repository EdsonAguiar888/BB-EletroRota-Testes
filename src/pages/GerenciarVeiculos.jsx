import { useState, useEffect } from 'react';
import './GerenciarVeiculos.css'; // Mantém o seu arquivo de estilo existente




export default function GerenciaVeiculos() {
  // Estado para armazenar os veículos específicos do usuário logado
  const [veiculos, setVeiculos] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [formData, setFormData] = useState({
    marca: '',
    potencia: '',
    bateriaAtual: ''
  });

  const [editId, setEditId] = useState(null); // ID do veículo sendo editado
  const [mensagem, setMensagem] = useState('');

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/usuarios'
    : 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios';

  useEffect(() => {
    // 1. Identifica o usuário que está logado no sistema
    const dadosSessao = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (dadosSessao) {
      setUsuarioLogado(dadosSessao);
      carregarVeiculosDoUsuario(dadosSessao.id);
    } else {
      setMensagem('Erro: Nenhum usuário logado encontrado.');
    }
  }, []);

  // READ: Carrega apenas os veículos do usuário atual
  const carregarVeiculosDoUsuario = async (idUsuario) => {
    window.scrollTo({ top: 90, behavior: 'smooth' });


    try {
      const response = await fetch(`${API_URL}/${idUsuario}`);
      if (response.ok) {
        const usuarioCompleto = await response.json();

        // Garante que se 'veiculos' não existir no banco ainda, vire um array vazio
        const listaVeiculos = Array.isArray(usuarioCompleto.veiculos)
          ? usuarioCompleto.veiculos
          : (usuarioCompleto.veiculo ? [{ idVeiculo: "1", ...usuarioCompleto.veiculo }] : []);

        setVeiculos(listaVeiculos);


        // Atualiza o localStorage para manter sincronizado
        const sessaoAtualizada = { ...usuarioCompleto, veiculos: listaVeiculos };
        localStorage.setItem('usuarioLogado', JSON.stringify(sessaoAtualizada));

      }
    } catch (err) {
      console.error('Erro ao conectar com a API:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CREATE e UPDATE: Adiciona um novo veículo ou altera um existente na lista
  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!usuarioLogado) return;

    setMensagem('Salvando...');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let listaNova = [...veiculos];

    if (editId) {
      // Modo de Edição: Atualiza o veículo correspondente dentro da lista
      listaNova = listaNova.map(v =>
        v.idVeiculo === editId
          ? { idVeiculo: editId, marca: formData.marca, potencia: formData.potencia, bateriaAtual: formData.bateriaAtual }
          : v
      );
    } else {
      // Modo de Criação: Adiciona um novo veículo gerando um ID único simples
      const novoVeiculo = {
        idVeiculo: Date.now().toString(),
        marca: formData.marca,
        potencia: formData.potencia,
        bateriaAtual: formData.bateriaAtual
      };
      listaNova.push(novoVeiculo);
    }







// const payload = {
//   ...usuarioLogado,
//   // Se o carro editado for o mesmo que está ativo na Home, atualiza ele também!
//   veiculo: usuarioLogado.veiculo?.idVeiculo === editId || listaVeiculosAtualizada.length === 1
//     ? { idVeiculo: editId || novoId, marca: formData.marca, potencia: formData.potencia, bateriaAtual: formData.bateriaAtual }
//     : usuarioLogado.veiculo,
//   veiculos: listaVeiculosAtualizada
// };























    // Monta o payload mantendo os dados intactos do usuário e atualizando a lista de veículos
    const payload = {

      ...usuarioLogado,
      veiculos: listaNova,
      veiculo: listaNova[0] || null // Mantém compatibilidade com páginas antigas usando o primeiro veículo
    };



















    try {
      const response = await fetch(`${API_URL}/${usuarioLogado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMensagem(editId ? 'Veículo atualizado com sucesso!' : 'Novo veículo cadastrado!');

        if (typeof setUsuario === 'function') {
          setUsuario(payload);
        }

        // Atualiza também o localStorage para segurança
        localStorage.setItem('usuarioLogado', JSON.stringify(payload));

        // Atualiza o estado global no App.jsx imediatamente
        if (typeof setUsuario === 'function') {
          setUsuario(payload);
        }


        limparFormulario();
        carregarVeiculosDoUsuario(usuarioLogado.id);
        setTimeout(() => setMensagem(''), 3000);
      }
    } catch (err) {
      setMensagem('Erro ao salvar no servidor.');
    }
  };

  // Prepara o formulário com os dados do veículo selecionado para edição
  const handleEdit = (veiculo) => {
    window.scrollTo({ top: 90, behavior: 'smooth' });
    setEditId(veiculo.idVeiculo);
    setFormData({
      marca: veiculo.marca,
      potencia: veiculo.potencia,
      bateriaAtual: veiculo.bateriaAtual

    });


    //setMensagem('');
  };

  // DELETE: Remove o veículo selecionado da lista do usuário
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
    // setMensagem('');
  };

  return (
    <div className="gerenciar-container">
      <h2>Gerenciamento de Veículos</h2>
      {usuarioLogado && <p style={{ color: '#555' }}>Olá, <strong>{usuarioLogado.nome}</strong>! Gerencie a frota dos seus veículos elétricos abaixo.</p>}

      {/* Formulário focado estritamente em dados de veículos */}
      <form onSubmit={handleSubmit} className="gerenciar-form">
        <label className="form-label">{editId ? 'Editar Veículo:' : 'Cadastrar Novo Veículo:'}</label>
        <input name="marca" value={formData.marca} onChange={handleChange} placeholder="Marca (ex: Tesla, BYD, Chevrolet)" required />
        <input name="potencia" value={formData.potencia} onChange={handleChange} placeholder="Potência (ex: 200 kW)" required />
        <input name="bateriaAtual" value={formData.bateriaAtual} onChange={handleChange} placeholder="Bateria Atual (%)" required />

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

      {/* Tabela exibindo apenas a frota de veículos cadastrados pelo ID logado */}
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
                <td style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{v.marca}</td>
                <td>{v.potencia}W</td>
                <td>{v.bateriaAtual ? `${v.bateriaAtual}%` : 'N/A'}</td>
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