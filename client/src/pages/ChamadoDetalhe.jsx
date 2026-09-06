import { useState, useEffect } from 'react';

export default function Chamados() {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // Estado para armazenar o chamado selecionado para ver os detalhes
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  // Função para buscar a lista atualizada do backend
  const carregarChamados = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/chamados');
      if (response.ok) {
        const dados = await response.json();
        setChamados(dados);
      }
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Efeito para carregar os dados inicial e atualizar automaticamente a cada 5 segundos
  useEffect(() => {
    carregarChamados();

    // Polling a cada 5 segundos para sincronizar chamados novos criados externamente pelo cliente
    const intervalo = setInterval(() => {
      carregarChamados();
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // Alternar Status de um Chamado
  const alternarStatus = async (id, statusAtual, e) => {
    e.stopPropagation(); // Evita abrir o modal de detalhes ao clicar no botão de status
    const novoStatus = statusAtual === 'Concluído' ? 'Aberto' : 'Concluído';
    try {
      const response = await fetch(`http://localhost:3001/api/chamados/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      if (response.ok) {
        carregarChamados();
        if (chamadoSelecionado && chamadoSelecionado.id === id) {
          setChamadoSelecionado({ ...chamadoSelecionado, status: novoStatus });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Central de Chamados</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
            Clique em qualquer chamado para visualizar a descrição completa e detalhes
          </p>
        </div>
      </div>

      {/* TABELA DE CHAMADOS */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '12px' }}>
              <th style={{ padding: '12px 16px' }}>#ID</th>
              <th style={{ padding: '12px 16px' }}>TÍTULO / ASSUNTO</th>
              <th style={{ padding: '12px 16px' }}>SOLICITANTE</th>
              <th style={{ padding: '12px 16px' }}>PRIORIDADE</th>
              <th style={{ padding: '12px 16px' }}>STATUS</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Sincronizando com o banco...</td></tr>
            ) : chamados.length > 0 ? (
              chamados.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setChamadoSelecionado(c)}
                  style={{
                    borderBottom: '1px solid #E5E7EB',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#4B5563' }}>#{c.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#111827' }}>{c.titulo}</td>
                  <td style={{ padding: '14px 16px', color: '#374151' }}>{c.solicitante || 'Não informado'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: c.prioridade === 'Alta' ? '#FEE2E2' : c.prioridade === 'Média' ? '#FEF3C7' : '#E0E7FF',
                      color: c.prioridade === 'Alta' ? '#991B1B' : c.prioridade === 'Média' ? '#92400E' : '#3730A3'
                    }}>
                      {c.prioridade || 'Média'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: c.status === 'Concluído' ? '#D1FAE5' : '#FEF3C7',
                      color: c.status === 'Concluído' ? '#065F46' : '#92400E'
                    }}>
                      {c.status || 'Aberto'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => alternarStatus(c.id, c.status, e)}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: c.status === 'Concluído' ? '#E5E7EB' : '#10B981',
                        color: c.status === 'Concluído' ? '#374151' : '#FFFFFF'
                      }}
                    >
                      {c.status === 'Concluído' ? 'Reabrir' : 'Finalizar ✓'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Nenhum chamado cadastrado no banco.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* JANELA MODAL DE DETALHAMENTO DO CHAMADO */}
      {chamadoSelecionado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            width: '90%',
            maxWidth: '600px',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif'
          }}>
            {/* Cabeçalho do Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '18px' }}>
                Detalhes do Chamado #{chamadoSelecionado.id}
              </h3>
              <button
                onClick={() => setChamadoSelecionado(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B7280' }}
              >
                ✕
              </button>
            </div>

            {/* Conteúdo Detalhado */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong style={{ color: '#6B7280', fontSize: '12px', display: 'block' }}>TÍTULO / ASSUNTO</strong>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>{chamadoSelecionado.titulo}</span>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <strong style={{ color: '#6B7280', fontSize: '12px', display: 'block' }}>SOLICITANTE</strong>
                  <span style={{ color: '#374151' }}>{chamadoSelecionado.solicitante || 'Não informado'}</span>
                </div>
                <div>
                  <strong style={{ color: '#6B7280', fontSize: '12px', display: 'block' }}>PRIORIDADE</strong>
                  <span style={{ fontWeight: 'bold', color: chamadoSelecionado.prioridade === 'Alta' ? '#991B1B' : '#92400E' }}>
                    {chamadoSelecionado.prioridade || 'Média'}
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#6B7280', fontSize: '12px', display: 'block' }}>STATUS ATUAL</strong>
                  <span style={{ fontWeight: 'bold', color: chamadoSelecionado.status === 'Concluído' ? '#065F46' : '#92400E' }}>
                    {chamadoSelecionado.status || 'Aberto'}
                  </span>
                </div>
              </div>

              <div>
                <strong style={{ color: '#6B7280', fontSize: '12px', display: 'block', marginBottom: '4px' }}>DESCRIÇÃO COMPLETA DA SOLICITAÇÃO</strong>
                <div style={{
                  backgroundColor: '#F9FAFB',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  color: '#374151',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  minHeight: '80px'
                }}>
                  {chamadoSelecionado.descricao || 'Nenhuma descrição detalhada foi informada.'}
                </div>
              </div>
            </div>

            {/* Rodapé do Modal com Ações */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={(e) => alternarStatus(chamadoSelecionado.id, chamadoSelecionado.status, e)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: chamadoSelecionado.status === 'Concluído' ? '#E5E7EB' : '#10B981',
                  color: chamadoSelecionado.status === 'Concluído' ? '#374151' : '#FFFFFF',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {chamadoSelecionado.status === 'Concluído' ? 'Reabrir Chamado' : 'Marcar como Concluído ✓'}
              </button>
              <button
                onClick={() => setChamadoSelecionado(null)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}