// Sistema de autenticação e funcionalidades
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function checkAuthentication() {
    // Verificar se usuário está logado (simulado com localStorage)
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Usuário não autenticado - redirecionar para login
        window.location.href = 'auth.html';
        return;
    }

    // Usuário autenticado - mostrar interface
    document.getElementById('authCheck').classList.add('hidden');
    document.getElementById('authenticatedContent').classList.remove('hidden');

    // Exibir nome do usuário
    document.getElementById('userInfo').textContent = `Olá, ${user.name}`;

    // Configurar eventos da interface
    setupInterface();
}

function setupInterface() {
    // Botão agendar
    document.getElementById('scheduleBtn').addEventListener('click', () => {
        document.getElementById('home').classList.add('hidden');
        document.getElementById('schedule').classList.remove('hidden');
    });

    // Formulário de agendamento
    document.getElementById('scheduleForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const service = document.getElementById('service').value;

        if (!date || !time || !service) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Simular agendamento
        alert('Agendamento realizado com sucesso! Redirecionando para pagamento...');

        // Salvar agendamento na "base de dados" administrativa
        const user = JSON.parse(localStorage.getItem('user'));
        const appointment = {
            id: Date.now(),
            client: user.name,
            date: date,
            time: time,
            service: service,
            status: 'Pendente',
            value: service === 'corte_basico' ? 'R$ 20' : 'R$ 30'
        };

        // Salvar na lista de agendamentos administrativos
        const adminAppointments = JSON.parse(localStorage.getItem('adminAppointments') || '[]');
        adminAppointments.push(appointment);
        localStorage.setItem('adminAppointments', JSON.stringify(adminAppointments));

        // Salvar agendamento temporariamente para pagamento
        localStorage.setItem('currentAppointment', JSON.stringify(appointment));

        // Redirecionar para pagamento
        window.location.href = 'payment.html';
    });
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('currentAppointment');
    window.location.href = 'auth.html';
}