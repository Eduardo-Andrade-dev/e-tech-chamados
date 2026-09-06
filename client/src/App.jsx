import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Chamados from './pages/Chamados';
import Usuarios from './pages/Usuarios';
import Agentes from './pages/Agentes';
import AbrirChamado from './pages/AbrirChamado';

function LayoutComSidebar() {
  const [menuAberto, setMenuAberto] = useState(false); // Começa fechado por padrão
  const location = useLocation();

  // Rotas onde a Sidebar e o Botão NÃO devem aparecer
  const rotasPublicas = ['/abrir-chamado'];
  const eRotaPublica = rotasPublicas.includes(location.pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Exibe a Sidebar e o botão de menu apenas se NÃO for rota pública */}
      {!eRotaPublica && (
        <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
      )}

      {/* Conteúdo principal com margem adequada para o botão de 3 linhas */}
      <main
        style={{
          flex: 1,
          // Se for público, padding normal; se for no painel, dá espaço no topo (60px) e recuo à esquerda (60px) para não cobrir com o botão
          padding: eRotaPublica ? '20px' : '20px 24px 20px 64px',
          // Quando o menu abre, empurra levemente o conteúdo (ou mantém fixo se fechar)
          marginLeft: !eRotaPublica && menuAberto ? '240px' : '0px',
          transition: 'margin-left 0.3s ease-in-out',
          boxSizing: 'border-box'
        }}
      >
        <Routes>
          {/* Rotas Administrativas */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/chamados" element={<Chamados />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/agentes" element={<Agentes />} />

          {/* Rota Pública do Cliente */}
          <Route path="/abrir-chamado" element={<AbrirChamado />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <LayoutComSidebar />;
}