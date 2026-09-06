import { useState, useEffect } from 'react';

export default function NovoChamado() {
  const [chamados, setChamados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'Média',
    usuario_id: ''
  });

  const carregarDados = async () => {
    try {
      const [resChamados, resUsuarios] = await Promise.all([
        fetch('http://localhost:3001/api/chamados'),
        fetch('http://localhost:3001/api/usuarios')
      ]);

      if (resChamados.ok) setChamados(await resChamados.json());
      if (resUsuarios.ok) setUsuarios(await resUsuarios.json());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo) {
      alert('Informe o título do chamado.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setModalAberto(false);
        setForm({ titulo: '', descricao: '', prioridade: 'Média', usuario_id: '' });
        carregarDados();
      } else {
        alert('Erro ao criar chamado.');
      }
    } catch (error) {
      alert('Erro de conexão.');
    }
  };

  // Função para Finalizar/Concluir Chamado
  const alternarStatus = async (id, statusAtual) => {
    const novoStatus = statusAtual === 'Concluído' ? 'Aberto' : 'Concluído';
    try {
      const response = await fetch(`http://localhost:3001/api/chamados/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      if (response.ok) {
        carregarDados(); // Recarrega a lista
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1F242D', margin: 0, fontWeight: 'bold' }}>Gerenciamento de Chamados</h1>
          <p style={{ color: '#8A8F98', marginTop: '4px', margin: 0, fontSize: '0.9rem' }}>
            Acompanhe, responda e finalize os chamados do sistema
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          style={{
            backgroundColor: '#3D7FE8', color: '#FFF', border: 'none', padding: '10px 18px',
            borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
          }}
        >
          + Novo Chamado
        </button>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E2E4E8', padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E4E8', color: '#8A8F98', fontSize: '0.85rem' }}>
              <th style={{ padding: '12px', width: '60px' }}>ID</th>
              <th style={{ padding: '12px' }}>TÍTULO</th>
              <th style={{ padding: '12px' }}>SOLICITANTE</th>
              <th style={{ padding: '12px' }}>PRIORIDADE</th>
              <th style={{ padding: '12px' }}>STATUS</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#8A8F98' }}>
                  Carregando chamados...
                </td>
              </tr>
            ) : chamados.length > 0 ? (
              chamados.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #E2E4E8', fontSize: '0.9rem' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#1F242D' }}>{c.id}</td>
                  <td style={{ padding: '12px', color: '#1F242D', fontWeight: '500' }}>
                    {c.titulo}
                    {c.descricao && <div style={{ fontSize: '0.8rem', color: '#8A8F98' }}>{c.descricao}</div>}
                  </td>
                  <td style={{ padding: '12px', color: '#555' }}>{c.solicitante || 'Não informado'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                      backgroundColor: c.prioridade === 'Alta' ? '#FEE2E2' : c.prioridade === 'Média' ? '#FEF3C7' : '#E0E7FF',
                      color: c.prioridade === 'Alta' ? '#991B1B' : c.prioridade === 'Média' ? '#92400E' : '#3730A3'
                    }}>
                      {c.prioridade}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                      backgroundColor: c.status === 'Concluído' ? '#D1FAE5' : '#FEF3C7',
                      color: c.status === 'Concluído' ? '#065F46' : '#92400E'
                    }}>
                      {c.status || 'Aberto'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => alternarStatus(c.id, c.status)}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: c.status === 'Concluído' ? '#E5E7EB' : '#10B981',
                        color: c.status === 'Concluído' ? '#374151' : '#FFF'
                      }}
                    >
                      {c.status === 'Concluído' ? 'Reabrir' : 'Finalizar ✓'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#8A8F98' }}>
                  Nenhum chamado cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#FFF', padding: '28px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginTop: 0, color: '#1F242D', marginBottom: '16px', fontSize: '1.3rem' }}>Abrir Novo Chamado</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Título do Chamado</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required placeholder="Ex: Câmera com defeito" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Solicitante (Usuário)</label>
                <select name="usuario_id" value={form.usuario_id} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecione um Usuário...</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>{u.nome} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Prioridade</label>
                <select name="prioridade" value={form.prioridade} onChange={handleChange} style={inputStyle}>
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Descrição do Problema</label>
                <textarea name="descricao" value={form.descricao} onChange={handleChange} rows="3" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ padding: '10px 16px', border: '1px solid #CCC', backgroundColor: '#FFF', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3D7FE8', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Chamado</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#333' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem', boxSizing: 'border-box', fontFamily: 'inherit' };