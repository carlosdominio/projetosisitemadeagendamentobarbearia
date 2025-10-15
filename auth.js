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

    const name = document.getElementById('regName').value;
    const surname = document.getElementById('regSurname').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;

    if (!name || !surname || !email || !phone || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Simular cadastro - em produção seria uma chamada para API
    const user = {
        id: Date.now(),
        name: `${name} ${surname}`,
        email: email,
        phone: phone,
        provider: 'email'
    };
    localStorage.setItem('user', JSON.stringify(user));

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'index.html';
});

// Google Auth
function handleGoogleLogin(response) {
    // Decodificar o JWT do Google
    const userInfo = parseJwt(response.credential);

    // Criar usuário com dados do Google
    const user = {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        provider: 'google'
    };

    localStorage.setItem('user', JSON.stringify(user));
    alert('Login com Google realizado com sucesso!');
    window.location.href = 'index.html';
}

function handleGoogleRegister(response) {
    // Mesmo processo para cadastro
    handleGoogleLogin(response);
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Inicializar Google Sign-In
window.onload = function() {
    // Configurar botões do Google (simulado - em produção precisaria de client_id)
    document.getElementById('googleLogin').addEventListener('click', () => {
        alert('Para usar Google Login em produção, configure um Client ID do Google Cloud Console');
        // Simulação
        const mockUser = {
            id: 'google_' + Date.now(),
            name: 'Usuário Google',
            email: 'google@example.com',
            provider: 'google'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        alert('Login com Google simulado realizado com sucesso!');
        window.location.href = 'index.html';
    });

    document.getElementById('googleRegister').addEventListener('click', () => {
        alert('Para usar Google Login em produção, configure um Client ID do Google Cloud Console');
        // Simulação
        const mockUser = {
            id: 'google_' + Date.now(),
            name: 'Usuário Google',
            email: 'google@example.com',
            provider: 'google'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        alert('Cadastro com Google simulado realizado com sucesso!');
        window.location.href = 'index.html';
    });
};