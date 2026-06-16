import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemCarro from '../assets/Meu BB-EletroRota.png';
import './EditarPerfil.css'; 

export default function EditarPerfil({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');
  
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
      const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
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
      const response = await fetch(`http://localhost:3001/usuarios/${usuario.id}`, {
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
    <div className="perfil-container">
      <div className="perfil-card">
        
        {/* Lado Esquerdo: Imagem */}
        <div className="perfil-image-section">
          <img src={imagemCarro} alt="Carro Elétrico" className="perfil-image" />
          <h3>Meu bbEletroRota</h3>
        </div>

        {/* Lado Direito: Informações e Formulário */}
        <div className="perfil-info-section">
          <h2>Configurações de Perfil</h2>
          
          <form onSubmit={handleUpdate} className="perfil-form">
            <div className="perfil-input-group">
              <label>Nome:</label>
              <input name="nome" value={formData.nome} onChange={handleChange} className="perfil-input" />
            </div>

            <div className="perfil-input-group">
              <label>Email:</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="perfil-input" />
            </div>

            <div className="perfil-row">
               <div className="perfil-input-group">
                <label>Modelo:</label>
                <input name="marca" value={formData.marca} onChange={handleChange} className="perfil-input" />
              </div>
              <div className="perfil-input-group">
                <label>Potência (kW):</label>
                <input name="potencia" value={formData.potencia} onChange={handleChange} className="perfil-input" />
              </div>
            </div>

            <div className="perfil-input-group">
              <label>Bateria Atual (%):</label>
              <input name="bateriaAtual" type="number" value={formData.bateriaAtual} onChange={handleChange} className="perfil-input" />
            </div>

            {mensagem && <p className="perfil-msg-sucesso">{mensagem}</p>}

            <div className="perfil-btn-group">
              <button type="submit" className="perfil-btn-edit">Salvar Alterações</button>
              <button type="button" onClick={handleDelete} className="perfil-btn-delete">Excluir Minha Conta</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

// Estilos inline legados — mantidos para referência, substituídos pelo EditarPerfil.css
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
