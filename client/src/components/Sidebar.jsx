import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  // Estado para controlar se o menu está aberto ou recolhido
  const [menuAberto, setMenuAberto] = useState(true);
  const location = useLocation();

  const itensMenu = [
    { path: '/', label: 'Painel', icon: '📊' },
    { path: '/chamados', label: 'Chamados', icon: '🎫' },
    { path: '/usuarios', label: 'Usuários', icon: '👥' },
    { path: '/agentes', label: 'Agentes', icon: '🎧' },
  ];

  return (
    <>
      {/* Botão com 3 Linhas (Hamburger) */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        title={menuAberto ? "Recuar Menu" : "Expandir Menu"}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          backgroundColor: '#1E222D',
          color: '#FFFFFF',
          border: '1px solid #374151',
          borderRadius: '6px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        ☰
      </button>

      {/* Painel do Menu Lateral (Sidebar) */}
      <aside
        style={{
          width: '240px',
          height: '100vh',
          backgroundColor: '#1E222D',
          color: '#FFFFFF',
          padding: '70px 16px 24px 16px', // Espaço no topo para não cobrir o botão de 3 linhas
          position: 'fixed',
          top: 0,
          left: menuAberto ? '0px' : '-240px', // Oculta/Recua o menu jogando para fora da tela
          transition: 'left 0.3s ease-in-out', // Animação suave ao abrir/recuar
          boxSizing: 'border-box',
          zIndex: 999,
          boxShadow: menuAberto ? '4px 0 12px rgba(0,0,0,0.3)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        {/* Título do Sistema */}
        <div style={{ marginBottom: '28px', paddingLeft: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#4E88F9', fontWeight: 'bold' }}>E-Tech Chamados</h2>
          <span style={{ fontSize: '0.75rem', color: '#8E95A5' }}>Gerente de Chamados</span>
        </div>

        {/* Links de Navegação para as Páginas */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {itensMenu.map((item) => {
            const ativo = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  color: ativo ? '#FFFFFF' : '#9CA3AF',
                  backgroundColor: ativo ? '#2D3548' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: ativo ? 'bold' : 'normal',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s ease',
                  borderLeft: ativo ? '4px solid #4E88F9' : '4px solid transparent'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}