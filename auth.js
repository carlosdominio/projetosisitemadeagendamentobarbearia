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
    try {
        console.log('Google login response:', response);

        // Decodificar o JWT do Google
        const userInfo = parseJwt(response.credential);
        console.log('Decoded user info:', userInfo);

        // Verificar se usuário já está cadastrado
        const existingUser = registeredUsers.find(u => u.provider === 'google' && u.email === userInfo.email);
        console.log('Existing user found:', existingUser);

        if (!existingUser) {
            alert('Usuário Google não encontrado. Primeiro faça o cadastro com Google.');
            return;
        }

        // Login bem-sucedido
        const loginUser = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            picture: existingUser.picture,
            provider: 'google'
        };

        localStorage.setItem('user', JSON.stringify(loginUser));
        alert('Login com Google realizado com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro no login Google:', error);
        alert('Erro no login com Google. Tente novamente.');
    }
}

function handleGoogleRegister(response) {
    try {
        console.log('Google register response:', response);

        // Decodificar o JWT do Google
        const userInfo = parseJwt(response.credential);
        console.log('Decoded user info:', userInfo);

        // Verificar se já existe cadastro com este email
        const existingUser = registeredUsers.find(u => u.email === userInfo.email);
        console.log('Existing user check:', existingUser);

        if (existingUser) {
            alert('Este email já está cadastrado. Use o login normal ou Google.');
            return;
        }

        // Mostrar modal para coletar telefone
        showGooglePhoneModal(userInfo);
    } catch (error) {
        console.error('Erro no cadastro Google:', error);
        alert('Erro no cadastro com Google. Tente novamente.');
    }
}

function showGooglePhoneModal(userInfo) {
    const modal = document.getElementById('googlePhoneModal');
    modal.classList.remove('hidden');

    // Armazenar dados do Google temporariamente
    localStorage.setItem('tempGoogleUser', JSON.stringify(userInfo));

    // Configurar eventos do modal
    document.getElementById('skipPhone').onclick = () => {
        completeGoogleRegistration(userInfo, null);
    };

    document.getElementById('googlePhoneForm').onsubmit = (e) => {
        e.preventDefault();
        const phone = document.getElementById('googlePhone').value;
        completeGoogleRegistration(userInfo, phone);
    };
}

function completeGoogleRegistration(userInfo, phone) {
    try {
        // Cadastrar novo usuário Google
        const newGoogleUser = {
            id: 'google_' + userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            phone: phone,
            provider: 'google'
        };

        console.log('New Google user to register:', newGoogleUser);

        registeredUsers.push(newGoogleUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // Limpar dados temporários
        localStorage.removeItem('tempGoogleUser');

        // Fechar modal
        document.getElementById('googlePhoneModal').classList.add('hidden');

        // Fazer login automático
        localStorage.setItem('user', JSON.stringify(newGoogleUser));
        alert('Cadastro com Google realizado com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao completar cadastro Google:', error);
        alert('Erro ao completar cadastro. Tente novamente.');
    }
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
    console.log('Initializing Google Sign-In...');

    // Verificar se estamos em produção (Vercel) ou desenvolvimento
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    console.log('Is production:', isProduction, 'Hostname:', window.location.hostname);

    // Configuração unificada
    const config = {
        client_id: '155717388662-uf2el2e3atqd0ge45fs4vo41jhhpd5uj.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        ux_mode: isProduction ? 'popup' : 'redirect',
        context: 'signin'
    };

    console.log('Google config:', config);

    google.accounts.id.initialize(config);

    // Renderizar botões do Google
    google.accounts.id.renderButton(
        document.getElementById('googleLogin'),
        {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular'
        }
    );

    google.accounts.id.renderButton(
        document.getElementById('googleRegister'),
        {
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            shape: 'rectangular'
        }
    );

    console.log('Google Sign-In initialized successfully');
};

// Função unificada para tratar resposta do Google
function handleCredentialResponse(response) {
    console.log('Credential response received:', response);

    try {
        const userInfo = parseJwt(response.credential);
        console.log('Parsed user info:', userInfo);

        // Verificar qual botão foi clicado (login ou register)
        const isRegisterMode = document.getElementById('registerForm').classList.contains('hidden') === false;
        console.log('Is register mode:', isRegisterMode);

        if (isRegisterMode) {
            handleGoogleRegister({ credential: response.credential });
        } else {
            handleGoogleLogin({ credential: response.credential });
        }
    } catch (error) {
        console.error('Error in credential response:', error);
        alert('Erro ao processar resposta do Google. Tente novamente.');
    }
}