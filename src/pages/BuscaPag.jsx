import { useSearchParams } from 'react-router-dom';

function Busca() {
  const [searchParams] = useSearchParams();
  const termo = searchParams.get('q');

  return (
    <div style={{ 
      padding: '2rem',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
      }}>
      <h2>Nenhum resultado encontrado para: <strong>"{termo}"</strong></h2>
      <p>A busca ainda está em desenvolvimento.</p>
    </div>
  );
}

export default Busca;