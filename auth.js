// Autenticação básica (simulada)
document.getElementById('switchToRegister').addEventListener('click', () => {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('authTitle').textContent = 'Cadastro';
});

document.getElementById('switchToLogin').addEventListener('click', () => {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('authTitle').textContent = 'Login';
});

document.getElementById('emailLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Simular login - em produção seria uma chamada para API
    const user = { id: 1, name: 'João Silva', email: email };
    localStorage.setItem('user', JSON.stringify(user));

    alert('Login realizado com sucesso!');
    window.location.href = 'index.html';
});

document.getElementById('emailRegisterForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;

    if (!email || !phone || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Simular cadastro - em produção seria uma chamada para API
    const user = { id: Date.now(), name: email.split('@')[0], email: email, phone: phone };
    localStorage.setItem('user', JSON.stringify(user));

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'index.html';
});

// Google Auth (placeholder)
document.getElementById('googleLogin').addEventListener('click', () => {
    alert('Login com Google em desenvolvimento');
});

document.getElementById('googleRegister').addEventListener('click', () => {
    alert('Cadastro com Google em desenvolvimento');
});