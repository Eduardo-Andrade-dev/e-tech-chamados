export default function PriorityBadge({ prioridade }) {
  const priorityMap = {
    baixa: { label: 'Baixa', color: '#8A8F98' },
    media: { label: 'Média', color: '#3D7FE8' },
    alta: { label: 'Alta', color: '#E8A23D' },
    urgente: { label: 'Urgente', color: '#C4453D' },
  };

  const current = priorityMap[prioridade] || { label: prioridade, color: '#333' };

  return (
    <span style={{
      color: current.color,
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      ● {current.label}
    </span>
  );
}
