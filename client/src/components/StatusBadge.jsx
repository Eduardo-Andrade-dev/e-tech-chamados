export default function StatusBadge({ status }) {
  const statusMap = {
    aberto: { label: 'Aberto', bg: '#E8A23D20', color: '#E8A23D' },
    em_atendimento: { label: 'Em Atendimento', bg: '#3D7FE820', color: '#3D7FE8' },
    aguardando_cliente: { label: 'Aguardando Cliente', bg: '#8A8F9820', color: '#8A8F98' },
    resolvido: { label: 'Resolvido', bg: '#3F8F5F20', color: '#3F8F5F' },
  };

  const current = statusMap[status] || { label: status, bg: '#EEE', color: '#333' };

  return (
    <span style={{
      backgroundColor: current.bg,
      color: current.color,
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.82rem',
      fontWeight: '600',
      display: 'inline-block'
    }}>
      {current.label}
    </span>
  );
}
