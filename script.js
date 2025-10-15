// JavaScript básico para funcionalidades

document.getElementById('scheduleBtn').addEventListener('click', () => {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('schedule').classList.remove('hidden');
});

document.getElementById('scheduleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Simular agendamento
    alert('Agendamento realizado com sucesso! Redirecionando para pagamento...');
    // Redirecionar para pagamento
    window.location.href = 'payment.html';
});