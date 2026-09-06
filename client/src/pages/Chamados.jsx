import { useState, useEffect } from 'react';

export default function Chamados() {
  const [chamados, setChamados] = useState([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  const carregarChamados = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/chamados');
      if (res.ok) {
        const dados = await res.json();
        setChamados(dados);
      }
    } catch (err) {
      console.error('Erro ao buscar chamados:', err);
    }
  };

  useEffect(() => {
    carregarChamados();
    const interval = setInterval(carregarChamados, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '24px', fontFamily: 'Segoe UI, Roboto, Arial, sans-serif', color: '#1f2937' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Lista de Chamados</h1>
        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Clique em qualquer linha para ver os detalhes completos</p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>#ID</th>
              <th style={{ padding: '12px 16px' }}>Título / Assunto</th>
              <th style={{ padding: '12px 16px' }}>Solicitante</th>
              <th style={{ padding: '12px 16px' }}>Prioridade</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {chamados.length > 0 ? (
              chamados.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setChamadoSelecionado(c)}
                  style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', fontSize: '14px' }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>#{c.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '500', color: '#111827' }}>{c.titulo}</td>
                  <td style={{ padding: '14px 16px', color: '#4b5563' }}>{c.solicitante || 'Não informado'}</td>
                  <td style={{ padding: '14px 16px' }}>{c.prioridade || 'Média'}</td>
                  <td style={{ padding: '14px 16px' }}>{c.status || 'Aberto'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  Nenhum chamado encontrado no banco.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* JANELA DE DETALHES AO CLICAR */}
      {chamadoSelecionado && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '480px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Detalhes do Chamado #{chamadoSelecionado.id}</h3>
              <button onClick={() => setChamadoSelecionado(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <div><strong>Título:</strong> <span>{chamadoSelecionado.titulo}</span></div>
              <div><strong>Solicitante:</strong> <span>{chamadoSelecionado.solicitante || 'Não informado'}</span></div>
              <div><strong>Prioridade:</strong> <span>{chamadoSelecionado.prioridade || 'Média'}</span></div>
              <div><strong>Status:</strong> <span>{chamadoSelecionado.status || 'Aberto'}</span></div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Descrição Completa:</strong>
                <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb', color: '#374151', whiteSpace: 'pre-wrap' }}>
                  {chamadoSelecionado.descricao || 'Nenhuma descrição detalhada informada.'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setChamadoSelecionado(null)} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '500', cursor: 'pointer' }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}