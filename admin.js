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
    const currentDate = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const totalAgendamentosHoje = adminAppointments.filter(a => a.date === currentDate).length;
    const lucroHoje = adminPayments
        .filter(p => p.date === currentDate)
        .reduce((total, p) => total + parseFloat(p.value.replace('R$ ', '')), 0);

    const lucroMes = adminPayments
        .filter(p => {
            const paymentDate = new Date(p.date);
            return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear;
        })
        .reduce((total, p) => total + parseFloat(p.value.replace('R$ ', '')), 0);

    // Preencher estatísticas
    document.getElementById('totalClientes').textContent = registeredUsers.length;
    document.getElementById('agendamentosHoje').textContent = totalAgendamentosHoje;
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

    // Filtrar apenas agendamentos de hoje por padrão
    const todayDate = new Date().toISOString().split('T')[0];
    const agendamentosHoje = adminAppointments.filter(a => a.date === todayDate);

    // Mostrar apenas agendamentos de hoje em destaque
    showAgendamentosHoje(agendamentosHoje);

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

// Funções para organizar agendamentos por data
function createDateTabs(agendamentosPorData, todayDate) {
    const dateTabs = document.getElementById('dateTabs');
    dateTabs.innerHTML = '';

    // Ordenar datas com hoje primeiro
    const datas = Object.keys(agendamentosPorData).sort((a, b) => {
        if (a === todayDate) return -1;
        if (b === todayDate) return 1;
        return a.localeCompare(b);
    });

    datas.forEach((data, index) => {
        const tabButton = document.createElement('button');
        // Destaque a aba "Hoje" sempre que for hoje
        const isToday = data === todayDate;
        tabButton.className = `px-4 py-2 rounded whitespace-nowrap ${isToday ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`;
        tabButton.textContent = formatDate(data);
        tabButton.onclick = () => {
            // Remover classe ativa de todas as abas
            document.querySelectorAll('#dateTabs button').forEach(btn => {
                btn.className = btn.className.replace('bg-blue-500 text-white', 'bg-gray-200 text-gray-700');
            });
            // Adicionar classe ativa na aba clicada
            tabButton.className = tabButton.className.replace('bg-gray-200 text-gray-700', 'bg-blue-500 text-white');

            showAgendamentosByDate(data, agendamentosPorData[data]);
        };
        dateTabs.appendChild(tabButton);
    });
}

function showAgendamentosByDate(data, agendamentos) {
    const container = document.getElementById('agendamentosContainer');
    container.innerHTML = '';

    if (agendamentos.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum agendamento para esta data.</p>';
        return;
    }

    // Criar tabela para esta data
    const table = document.createElement('table');
    table.className = 'w-full';

    // Cabeçalho
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr class="border-b">
            <th class="text-left py-2">Cliente</th>
            <th class="text-left py-2">Horário</th>
            <th class="text-left py-2">Serviço</th>
            <th class="text-left py-2">Status</th>
            <th class="text-left py-2">Ações</th>
        </tr>
    `;
    table.appendChild(thead);

    // Corpo da tabela
    const tbody = document.createElement('tbody');

    agendamentos.forEach((agendamento, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = agendamento.client;
        row.insertCell(1).textContent = agendamento.time;
        row.insertCell(2).textContent = agendamento.service === 'corte_basico' ? 'Corte Básico' : 'Corte Completo';
        row.insertCell(3).textContent = agendamento.status;

        const actionsCell = row.insertCell(4);
        if (agendamento.status === 'Pendente') {
            actionsCell.innerHTML = `
                <button onclick="confirmAppointment(${getAppointmentIndex(agendamento)})" class="bg-green-500 text-white px-2 py-1 rounded text-sm mr-1">Confirmar</button>
                <button onclick="cancelAppointment(${getAppointmentIndex(agendamento)})" class="bg-red-500 text-white px-2 py-1 rounded text-sm">Cancelar</button>
            `;
        } else {
            actionsCell.innerHTML = '<span class="text-gray-500">Finalizado</span>';
        }
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

function getAppointmentIndex(targetAppointment) {
    const adminAppointments = JSON.parse(localStorage.getItem('adminAppointments') || '[]');
    return adminAppointments.findIndex(appointment =>
        appointment.client === targetAppointment.client &&
        appointment.date === targetAppointment.date &&
        appointment.time === targetAppointment.time
    );
}

function setupFilters(allAppointments, agendamentosPorData) {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFilters = document.getElementById('clearFilters');

    function applyFilters() {
        const statusValue = statusFilter.value;
        const dateValue = dateFilter.value;

        let filteredAppointments = allAppointments;

        // Filtrar por status
        if (statusValue !== 'todos') {
            filteredAppointments = filteredAppointments.filter(a => a.status === statusValue);
        }

        // Filtrar por data
        if (dateValue) {
            filteredAppointments = filteredAppointments.filter(a => a.date === dateValue);
        }

        // Reagrupar por data
        const filteredPorData = {};
        filteredAppointments.forEach(agendamento => {
            const data = agendamento.date;
            if (!filteredPorData[data]) {
                filteredPorData[data] = [];
            }
            filteredPorData[data].push(agendamento);
        });

        // Atualizar abas e mostrar resultados
        createDateTabs(filteredPorData);
        const datas = Object.keys(filteredPorData).sort();
        if (datas.length > 0) {
            showAgendamentosByDate(datas[0], filteredPorData[datas[0]]);
        } else {
            document.getElementById('agendamentosContainer').innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum agendamento encontrado com os filtros aplicados.</p>';
        }
    }

    statusFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);

    clearFilters.addEventListener('click', () => {
        statusFilter.value = 'todos';
        dateFilter.value = '';
        // Recarregar dados originais
        const agendamentosPorData = {};
        allAppointments.forEach(agendamento => {
            const data = agendamento.date;
            if (!agendamentosPorData[data]) {
                agendamentosPorData[data] = [];
            }
            agendamentosPorData[data].push(agendamento);
        });
        createDateTabs(agendamentosPorData);
        const datas = Object.keys(agendamentosPorData).sort();
        if (datas.length > 0) {
            showAgendamentosByDate(datas[0], agendamentosPorData[datas[0]]);
        }
    });
}

function showAgendamentosHoje(agendamentos) {
    const container = document.getElementById('agendamentosHojeContainer');
    const totalElement = document.getElementById('totalAgendamentosHoje');

    // Atualizar contador
    totalElement.textContent = agendamentos.length;

    if (agendamentos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-6xl mb-2">⏰</div>
                <p class="text-lg text-white">Nenhum agendamento para hoje</p>
                <p class="text-sm text-white opacity-75">Os agendamentos aparecerão aqui automaticamente</p>
            </div>
        `;
        return;
    }

    // Criar cards para agendamentos de hoje
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';

    agendamentos.forEach((agendamento, index) => {
        const statusClass = agendamento.status === 'Confirmado' ? 'bg-green-500' :
                           agendamento.status === 'Cancelado' ? 'bg-red-500' : 'bg-yellow-500';

        html += `
            <div class="bg-white bg-opacity-20 rounded-lg p-4 border border-white border-opacity-20">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-bold text-white">${agendamento.client}</h4>
                        <p class="text-white text-sm opacity-90">${agendamento.time}</p>
                    </div>
                    <span class="px-2 py-1 rounded text-xs font-bold text-white ${statusClass}">
                        ${agendamento.status}
                    </span>
                </div>
                <div class="mb-3">
                    <p class="text-white text-sm">
                        <span class="font-medium">Serviço:</span> ${agendamento.service === 'corte_basico' ? 'Corte Básico' : 'Corte Completo'}
                    </p>
                    <p class="text-white text-sm">
                        <span class="font-medium">Valor:</span> R$ ${agendamento.value || (agendamento.service === 'corte_basico' ? '20' : '30')}
                    </p>
                </div>
                ${agendamento.status === 'Pendente' ? `
                    <div class="flex space-x-2">
                        <button onclick="confirmAppointment(${getAppointmentIndex(agendamento)})" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                            ✅ Confirmar
                        </button>
                        <button onclick="cancelAppointment(${getAppointmentIndex(agendamento)})" class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                            ❌ Cancelar
                        </button>
                    </div>
                ` : `
                    <div class="text-center">
                        <span class="text-white text-sm opacity-75">Agendamento finalizado</span>
                    </div>
                `}
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Amanhã';
    } else {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit'
        });
    }
}