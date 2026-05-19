import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemCarro from '../assets/Meu BB-EletroRota.png';

export default function EditarPerfil({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');
  
  // Estado para os campos de edição (Inicia com os dados atuais)
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    marca: usuario?.veiculo?.marca || '',
    potencia: usuario?.veiculo?.potencia || '',
    bateriaAtual: usuario?.veiculo?.bateriaAtual || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para ATUALIZAR (EDITAR)
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const usuarioAtualizado = {
      ...usuario,
      nome: formData.nome,
      email: formData.email,
      veiculo: {
        marca: formData.marca,
        potencia: formData.potencia,
        bateriaAtual: formData.bateriaAtual
      }
    };

    try {
      //const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
      const response = await fetch(`https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios/${usuario.id}`, {
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
    if (!window.confirm('TEM CERTEZA? Isso excluirá sua conta permanentemente.')) return;

    try {
      //const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
      const response = await fetch(`https://69fea0e78c70b15fa3ca9803.mockapi.io/usuarios/usuarios/${usuario.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        localStorage.removeItem('usuarioLogado');
        setUsuario(null);
        navigate('/'); // Volta para a Home estática
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
          <h3 style={{ color: '#2c3e50', marginTop: '20px' }}>Meu bbEletroRota</h3>
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

// ESTILOS (Aesthetic & Clean)
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

// ### O que esta implementação faz:
// 1.  **Layout Profissional:** Divide a tela entre o visual do carro e os controles de dados.
// 2.  **Edição Direta:** Ao clicar em "Salvar", ele atualiza o `db.json` via `PUT`, garantindo que se você sair e voltar, as informações novas estarão lá.
// 3.  **Exclusão Segura:** Ao excluir, ele faz o `DELETE` no banco, limpa o `localStorage` e te joga de volta para a Home pública (onde o botão de login aparece de novo).

// Seu deck de apresentação sobre o "Editar Perfil" já está pronto logo acima. O que achou dessa nova estrutura visual?