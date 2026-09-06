export const mockUsuarios = [
  { id: 1, nome: "Carlos Eduardo", email: "carlos@empresa.com", departamento: "TI" },
  { id: 2, nome: "Mariana Costa", email: "mariana@empresa.com", departamento: "RH" }
];

export const mockAgentes = [
  { id: 1, nome: "Eduardo Andrade", especialidade: "Suporte N2" }
];

export const mockChamados = [
  {
    id: "CH-001",
    usuario_nome: "Carlos Eduardo",
    agente_nome: "Eduardo Andrade",
    titulo: "Erro ao acessar o sistema",
    categoria: "Sistemas",
    prioridade: "alta",
    status: "em_atendimento",
    data_abertura: "2026-08-23T10:00:00",
    sla_prazo: "2026-08-24T18:00:00"
  }
];
