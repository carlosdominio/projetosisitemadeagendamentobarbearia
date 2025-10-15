// JavaScript básico para funcionalidades
document.getElementById('loginBtn').addEventListener('click', () => {
    alert('Funcionalidade de login em desenvolvimento');
});

document.getElementById('registerBtn').addEventListener('click', () => {
    alert('Funcionalidade de cadastro em desenvolvimento');
});

document.getElementById('scheduleBtn').addEventListener('click', () => {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('schedule').classList.remove('hidden');
});

document.getElementById('scheduleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Agendamento realizado com sucesso!');
    // Aqui seria integrada com backend
});