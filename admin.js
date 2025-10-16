// Painel administrativo dinâmico
document.addEventListener('DOMContentLoaded', () => {
    loadAdminData();

    // Atualizar dados a cada 30 segundos
    setInterval(loadAdminData, 30000);
});

function loadAdminData() {
    // Carregar dados reais do localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const adminAppointments = JSON.parse(localStorage.getItem('adminAppointments') || '[]');
    const adminPayments = JSON.parse(localStorage.getItem('adminPayments') || '[]');

    // Calcular estatísticas
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const agendamentosHoje = adminAppointments.filter(a => a.date === today).length;
    const lucroHoje = adminPayments
        .filter(p => p.date === today)
        .reduce((total, p) => total + parseFloat(p.value.replace('R$ ', '')), 0);

    const lucroMes = adminPayments
        .filter(p => {
            const paymentDate = new Date(p.date);
            return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear;
        })
        .reduce((total, p) => total + parseFloat(p.value.replace('R$ ', '')), 0);

    // Preencher estatísticas
    document.getElementById('totalClientes').textContent = registeredUsers.length;
    document.getElementById('agendamentosHoje').textContent = agendamentosHoje;
    document.getElementById('lucroHoje').textContent = `R$ ${lucroHoje.toFixed(2)}`;
    document.getElementById('lucroMes').textContent = `R$ ${lucroMes.toFixed(2)}`;

    // Limpar e preencher tabela de clientes
    const clientesTable = document.getElementById('clientesTable');
    clientesTable.innerHTML = '';

    registeredUsers.forEach(cliente => {
        const row = clientesTable.insertRow();
        row.insertCell(0).textContent = cliente.name;
        row.insertCell(1).textContent = cliente.email;
        row.insertCell(2).textContent = cliente.phone || 'N/A';

        // Contar cortes no mês atual
        const cortesMes = adminAppointments.filter(a =>
            a.client === cliente.name &&
            new Date(a.date).getMonth() === thisMonth &&
            new Date(a.date).getFullYear() === thisYear
        ).length;
        row.insertCell(3).textContent = cortesMes;
    });

    // Limpar e preencher tabela de agendamentos
    const agendamentosTable = document.getElementById('agendamentosTable');
    agendamentosTable.innerHTML = '';

    adminAppointments.forEach((agendamento, index) => {
        const row = agendamentosTable.insertRow();
        row.insertCell(0).textContent = agendamento.client;
        row.insertCell(1).textContent = `${agendamento.date} ${agendamento.time}`;
        row.insertCell(2).textContent = agendamento.service === 'corte_basico' ? 'Corte Básico' : 'Corte Completo';
        row.insertCell(3).textContent = agendamento.status;

        const actionsCell = row.insertCell(4);
        if (agendamento.status === 'Pendente') {
            actionsCell.innerHTML = `
                <button onclick="confirmAppointment(${index})" class="bg-green-500 text-white px-2 py-1 rounded text-sm mr-1">Confirmar</button>
                <button onclick="cancelAppointment(${index})" class="bg-red-500 text-white px-2 py-1 rounded text-sm">Cancelar</button>
            `;
        } else {
            actionsCell.innerHTML = '<span class="text-gray-500">Finalizado</span>';
        }
    });

    // Limpar e preencher tabela de pagamentos
    const pagamentosTable = document.getElementById('pagamentosTable');
    pagamentosTable.innerHTML = '';

    adminPayments.forEach(pagamento => {
        const row = pagamentosTable.insertRow();
        row.insertCell(0).textContent = pagamento.client;
        row.insertCell(1).textContent = pagamento.value;
        row.insertCell(2).textContent = pagamento.method;
        row.insertCell(3).textContent = pagamento.date;
    });
}

function confirmAppointment(index) {
    const adminAppointments = JSON.parse(localStorage.getItem('adminAppointments') || '[]');
    if (adminAppointments[index]) {
        adminAppointments[index].status = 'Confirmado';

        // Registrar pagamento
        const appointment = adminAppointments[index];
        const payment = {
            client: appointment.client,
            value: appointment.value,
            method: 'PIX', // Simulado
            date: new Date().toISOString().split('T')[0]
        };

        const adminPayments = JSON.parse(localStorage.getItem('adminPayments') || '[]');
        adminPayments.push(payment);
        localStorage.setItem('adminPayments', JSON.stringify(adminPayments));

        localStorage.setItem('adminAppointments', JSON.stringify(adminAppointments));
        loadAdminData(); // Recarregar dados

        // Enviar notificação WhatsApp de confirmação
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const client = registeredUsers.find(u => u.name === appointment.client);
        if (client && client.phone) {
            sendAppointmentConfirmation(client.phone, {
                date: appointment.date,
                time: appointment.time,
                service: appointment.service === 'corte_basico' ? 'Corte Básico' : 'Corte Completo'
            });
        }

        alert('Agendamento confirmado com sucesso! Cliente notificado via WhatsApp.');
    }
}

function cancelAppointment(index) {
    const adminAppointments = JSON.parse(localStorage.getItem('adminAppointments') || '[]');
    if (adminAppointments[index]) {
        adminAppointments[index].status = 'Cancelado';
        localStorage.setItem('adminAppointments', JSON.stringify(adminAppointments));
        loadAdminData(); // Recarregar dados
        alert('Agendamento cancelado!');
    }
}