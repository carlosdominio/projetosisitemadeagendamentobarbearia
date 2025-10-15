// Painel administrativo básico (dados simulados)
document.addEventListener('DOMContentLoaded', () => {
    // Dados simulados
    const clientes = [
        { nome: 'João Silva', email: 'joao@email.com', telefone: '11999999999', cortesMes: 2 },
        { nome: 'Maria Santos', email: 'maria@email.com', telefone: '11888888888', cortesMes: 1 }
    ];

    const agendamentos = [
        { cliente: 'João Silva', dataHora: '2023-10-15 14:00', servico: 'Corte Básico', status: 'Confirmado' },
        { cliente: 'Maria Santos', dataHora: '2023-10-16 10:00', servico: 'Corte Completo', status: 'Pendente' }
    ];

    const pagamentos = [
        { cliente: 'João Silva', valor: 'R$ 20', metodo: 'PIX', data: '2023-10-10' },
        { cliente: 'Maria Santos', valor: 'R$ 30', metodo: 'Cartão', data: '2023-10-12' }
    ];

    // Preencher estatísticas
    document.getElementById('totalClientes').textContent = clientes.length;
    document.getElementById('agendamentosHoje').textContent = agendamentos.filter(a => a.dataHora.startsWith(new Date().toISOString().split('T')[0])).length;
    document.getElementById('lucroHoje').textContent = 'R$ 50'; // Simulado
    document.getElementById('lucroMes').textContent = 'R$ 500'; // Simulado

    // Preencher tabelas
    const clientesTable = document.getElementById('clientesTable');
    clientes.forEach(cliente => {
        const row = clientesTable.insertRow();
        row.insertCell(0).textContent = cliente.nome;
        row.insertCell(1).textContent = cliente.email;
        row.insertCell(2).textContent = cliente.telefone;
        row.insertCell(3).textContent = cliente.cortesMes;
    });

    const agendamentosTable = document.getElementById('agendamentosTable');
    agendamentos.forEach(agendamento => {
        const row = agendamentosTable.insertRow();
        row.insertCell(0).textContent = agendamento.cliente;
        row.insertCell(1).textContent = agendamento.dataHora;
        row.insertCell(2).textContent = agendamento.servico;
        row.insertCell(3).textContent = agendamento.status;
        const actionsCell = row.insertCell(4);
        actionsCell.innerHTML = '<button class="bg-green-500 text-white px-2 py-1 rounded text-sm">Confirmar</button> <button class="bg-red-500 text-white px-2 py-1 rounded text-sm">Cancelar</button>';
    });

    const pagamentosTable = document.getElementById('pagamentosTable');
    pagamentos.forEach(pagamento => {
        const row = pagamentosTable.insertRow();
        row.insertCell(0).textContent = pagamento.cliente;
        row.insertCell(1).textContent = pagamento.valor;
        row.insertCell(2).textContent = pagamento.metodo;
        row.insertCell(3).textContent = pagamento.data;
    });
});