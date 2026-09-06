import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModalNovo, setMostrarModalNovo] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [descricao, setDescricao] = useState('');

  const carregarDadosDoBanco = async () => {
    try {
      const [resC, resU] = await Promise.all([
        fetch('http://localhost:3001/api/chamados'),
        fetch('http://localhost:3001/api/usuarios')
      ]);
      if (resC.ok) setChamados(await resC.json());
      if (resU.ok) setUsuarios(await resU.json());
    } catch (err) {
      console.error('Erro ao conectar com o banco:', err);
    }
  };

  useEffect(() => {
    carregarDadosDoBanco();
    const interval = setInterval(carregarDadosDoBanco, 3000);
    return () => clearInterval(interval);
  }, []);

  const salvarChamadoNoBanco = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, solicitante, prioridade, descricao, status: 'Aberto' })
      });

      if (res.ok) {
        setTitulo('');
        setSolicitante('');
        setDescricao('');
        setPrioridade('Média');
        setMostrarModalNovo(false);
        carregarDadosDoBanco();
      }
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Segoe UI, Roboto, Arial, sans-serif', color: '#1f2937' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Dashboard</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Visão geral do sistema de chamados</p>
        </div>
        <button
          onClick={() => setMostrarModalNovo(true)}
          style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
        >
          + Novo Chamado
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Total de Chamados</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: '700', color: '#111827' }}>{chamados.length}</h2>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Usuários Cadastrados</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: '700', color: '#111827' }}>{usuarios.length}</h2>
        </div>
      </div>

      {mostrarModalNovo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={salvarChamadoNoBanco} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Criar Novo Chamado</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Título</label>
              <input required type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Solicitante</label>
              <input required type="text" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Prioridade</label>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Descrição</label>
              <textarea rows="3" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setMostrarModalNovo(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontWeight: '500', cursor: 'pointer' }}>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}