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

// Simulação de base de dados de usuários cadastrados
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

document.getElementById('emailLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verificar se o usuário está cadastrado
    const user = registeredUsers.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Usuário não encontrado ou senha incorreta. Verifique seus dados ou faça o cadastro.');
        return;
    }

    // Login bem-sucedido
    const loginUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        provider: user.provider
    };

    localStorage.setItem('user', JSON.stringify(loginUser));
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

    // Verificar se o email já está cadastrado
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
        alert('Este email já está cadastrado. Use outro email ou faça login.');
        return;
    }

    // Cadastrar novo usuário
    const newUser = {
        id: Date.now(),
        name: `${name} ${surname}`,
        email: email,
        phone: phone,
        password: password,
        provider: 'email'
    };

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Fazer login automático após cadastro
    const loginUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        provider: newUser.provider
    };

    localStorage.setItem('user', JSON.stringify(loginUser));
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
        // Simulação - verificar se usuário "Google" existe
        const googleUser = registeredUsers.find(u => u.provider === 'google' && u.email === 'google@example.com');

        if (!googleUser) {
            alert('Usuário Google não encontrado. Primeiro faça o cadastro com Google.');
            return;
        }

        // Login bem-sucedido
        const loginUser = {
            id: googleUser.id,
            name: googleUser.name,
            email: googleUser.email,
            provider: googleUser.provider
        };

        localStorage.setItem('user', JSON.stringify(loginUser));
        alert('Login com Google realizado com sucesso!');
        window.location.href = 'index.html';
    });

    document.getElementById('googleRegister').addEventListener('click', () => {
        alert('Para usar Google Login em produção, configure um Client ID do Google Cloud Console');
        // Simulação - verificar se já existe
        const existingGoogleUser = registeredUsers.find(u => u.provider === 'google' && u.email === 'google@example.com');

        if (existingGoogleUser) {
            alert('Usuário Google já cadastrado. Faça o login.');
            return;
        }

        // Cadastrar novo usuário Google
        const newGoogleUser = {
            id: 'google_' + Date.now(),
            name: 'Usuário Google',
            email: 'google@example.com',
            provider: 'google'
        };

        registeredUsers.push(newGoogleUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // Fazer login automático
        localStorage.setItem('user', JSON.stringify(newGoogleUser));
        alert('Cadastro com Google realizado com sucesso!');
        window.location.href = 'index.html';
    });
};