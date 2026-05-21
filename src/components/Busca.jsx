import { useNavigate } from 'react-router-dom';  
import { useState } from 'react';  

function BarraBusca() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');

  const handleBusca = (e) => {
    e.preventDefault();
    if (busca.trim()) navigate(`/busca?q=${busca}`);
  };

  return (
    <form className="bb-search-form" onSubmit={handleBusca}>
      <div className="bb-search-inner">
        <i className="fas fa-search"></i>
        <input
          type="text"
          className="bb-search-input"
          placeholder="Busque no site"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </form>
  );
}

export default BarraBusca;