// Sistema de fidelização básico
function checkLoyalty(clientId) {
    // Simular verificação de cortes no mês
    const cortesMes = Math.floor(Math.random() * 5); // Simulado
    if (cortesMes >= 3) {
        return { eligible: true, freeCuts: Math.floor(cortesMes / 3) };
    }
    return { eligible: false, freeCuts: 0 };
}

function applyFreeCut(clientId) {
    // Simular aplicação de corte grátis
    alert('Corte grátis aplicado! Você ganhou um corte gratuito.');
}

// Exemplo de uso
document.addEventListener('DOMContentLoaded', () => {
    const loyaltyStatus = checkLoyalty('cliente123');
    if (loyaltyStatus.eligible) {
        document.getElementById('loyaltyMessage').textContent = `Você tem ${loyaltyStatus.freeCuts} corte(s) grátis disponível(is)!`;
        document.getElementById('freeCutBtn').classList.remove('hidden');
    }
});