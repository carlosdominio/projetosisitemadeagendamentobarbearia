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
    // Simular login
    alert('Login realizado com sucesso!');
    window.location.href = 'index.html';
});

document.getElementById('emailRegisterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Simular cadastro
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