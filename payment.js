// Sistema de pagamento básico
document.addEventListener('DOMContentLoaded', () => {
    const paymentMethods = document.getElementsByName('paymentMethod');
    const pixSection = document.getElementById('pixSection');
    const cardSection = document.getElementById('cardSection');
    const payBtn = document.getElementById('payBtn');

    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            if (method.value === 'pix') {
                pixSection.classList.remove('hidden');
                cardSection.classList.add('hidden');
            } else if (method.value === 'card') {
                cardSection.classList.remove('hidden');
                pixSection.classList.add('hidden');
            }
            payBtn.disabled = false;
        });
    });

    payBtn.addEventListener('click', () => {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (selectedMethod) {
            if (selectedMethod.value === 'pix') {
                alert('Pagamento via PIX processado com sucesso!');
            } else if (selectedMethod.value === 'card') {
                // Simular processamento do cartão
                alert('Pagamento via cartão processado com sucesso!');
            }
            // Redirecionar ou atualizar status
            window.location.href = 'index.html';
        }
    });
});