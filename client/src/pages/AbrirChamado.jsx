import { useState } from 'react';

export default function AbrirChamado() {
  const [solicitante, setSolicitante] = useState('');
  const [titulo, setTitulo] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [descricao, setDescricao] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const response = await fetch('http://localhost:3001/api/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solicitante,
          titulo,
          prioridade,
          descricao,
          status: 'Aberto'
        })
      });

      if (response.ok) {
        setMensagemSucesso(true);
        setSolicitante('');
        setTitulo('');
        setDescricao('');
        setPrioridade('Média');
      } else {
        alert('Erro ao enviar o chamado. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Erro ao conectar com o servidor.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '60px auto',
      padding: '32px',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ marginTop: 0, color: '#1E222D', fontSize: '22px' }}>Portal de Suporte E-Tech</h2>
      <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
        Preencha os campos abaixo para abrir uma solicitação de atendimento.
      </p>

      {mensagemSucesso && (
        <div style={{
          padding: '12px',
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          borderRadius: '6px',
          marginBottom: '20px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          ✓ Seu chamado foi enviado com sucesso! Em breve nossa equipe entrará em contato.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>Seu Nome Completo</label>
          <input
            type="text"
            required
            placeholder="Ex: Carlos Silva"
            value={solicitante}
            onChange={(e) => setSolicitante(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>Assunto / Título</label>
          <input
            type="text"
            required
            placeholder="Ex: Impressora não responde"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>Urgência</label>
          <select
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>Descrição detalhada</label>
          <textarea
            rows="4"
            required
            placeholder="Descreva o que está acontecendo..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={enviando}
          style={{
            padding: '12px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          {enviando ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </form>
    </div>
  );
}