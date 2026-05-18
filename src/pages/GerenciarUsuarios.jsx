import { useState, useEffect } from 'react';

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    marca: '',
    potencia: '',
    bateriaAtual: ''
  });
  const [editId, setEditId] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const API_URL = 'http://localhost:3000/usuarios';
  //const API_URL = 'https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios';

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // 1. READ: Carrega os usuários
  const carregarUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (err) {
      console.error('Erro ao conectar com a API:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. CREATE e UPDATE: Salva ou Atualiza
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('Salvando...');

    const payload = {
      nome: formData.nome,
      email: formData.email.toLowerCase().trim(),
      senha: formData.senha,
      veiculo: {
        marca: formData.marca,
        potencia: formData.potencia,
        bateriaAtual: formData.bateriaAtual
      }
    };

    try {
      if (editId) {
        // Atualiza (PUT)
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setMensagem('Usuário atualizado com sucesso!');
        }
      } else {
        // Cria (POST)
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setMensagem('Usuário criado com sucesso!');
        }
      }

      limparFormulario();
      carregarUsuarios();
    } catch (err) {
      setMensagem('Erro ao salvar no servidor.');
    }
  };

  // Prepara o formulário para edição
  const handleEdit = (usuario) => {
    setEditId(usuario.id);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      marca: usuario.veiculo?.marca || '',
      potencia: usuario.veiculo?.potencia || '',
      bateriaAtual: usuario.veiculo?.bateriaAtual || ''
    });
    setMensagem('');
  };

  // 3. DELETE: Exclui o usuário
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMensagem('Usuário excluído.');
        carregarUsuarios();
      }
    } catch (err) {
      setMensagem('Erro ao excluir usuário.');
    }
  };

  const limparFormulario = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      marca: '',
      potencia: '',
      bateriaAtual: ''
    });
    setEditId(null);
    setMensagem('');
  };

  return (


    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
   

      <h2>Gerenciamento de Usuários e Veículos</h2>

      {/* Formulário de Cadastro e Edição */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
        <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-mail" required />
        <input name="senha" type="password" value={formData.senha} onChange={handleChange} placeholder="Senha" required />
        
        <label style={{ marginTop: '10px', fontWeight: 'bold' }}>Dados do Veículo:</label>
        <input name="marca" value={formData.marca} onChange={handleChange} placeholder="Marca (ex: Tesla, Chevrolet)" required />
        <input name="potencia" value={formData.potencia} onChange={handleChange} placeholder="Potência (ex: 200 kW)" required />
        <input name="bateriaAtual" value={formData.bateriaAtual} onChange={handleChange} placeholder="Bateria Atual (%)" required />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit">{editId ? 'Atualizar Usuário' : 'Criar Usuário'}</button>
          {editId && <button type="button" onClick={limparFormulario} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancelar</button>}
        </div>
      </form>

      {mensagem && <p style={{ color: mensagem.includes('Erro') ? 'red' : 'green' }}>{mensagem}</p>}

      {/* Tabela de Usuários Registrados */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Marca do Veículo</th>
            <th>Potência</th>
            <th>Bateria Atual</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              {/* Dados do veículo separados em colunas independentes */}
              <td>{u.veiculo?.marca || 'N/A'}</td>
              <td>{u.veiculo?.potencia || 'N/A'}</td>
              <td>{u.veiculo?.bateriaAtual ? `${u.veiculo.bateriaAtual}%` : 'N/A'}</td>
              <td>
                <button onClick={() => handleEdit(u)} style={{ marginRight: '5px' }}>Editar</button>
                <button onClick={() => handleDelete(u.id)} style={{ color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}