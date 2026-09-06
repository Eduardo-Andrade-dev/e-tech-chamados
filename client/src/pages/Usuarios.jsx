import { useState, useEffect } from 'react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const carregarUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/usuarios');
      if (res.ok) {
        const dados = await res.json();
        setUsuarios(dados);
      }
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    }
  };

  useEffect(() => {
    carregarUsuarios();
    const interval = setInterval(carregarUsuarios, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '24px', fontFamily: 'Segoe UI, Roboto, Arial, sans-serif', color: '#1f2937' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Usuários / Solicitantes</h1>
        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Gerencie colaboradores e clientes sincronizados com o banco</p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Nome</th>
              <th style={{ padding: '12px 16px' }}>E-mail</th>
              <th style={{ padding: '12px 16px' }}>Celular</th>
              <th style={{ padding: '12px 16px' }}>Departamento</th>
              <th style={{ padding: '12px 16px' }}>Cidade</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6', fontSize: '14px' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{u.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '500', color: '#111827' }}>{u.nome}</td>
                  <td style={{ padding: '14px 16px', color: '#4b5563' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px', color: '#4b5563' }}>{u.celular || u.telefone || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#374151' }}>
                      {u.departamento || 'Geral'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#4b5563' }}>{u.cidade || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  Nenhum usuário cadastrado no banco.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}