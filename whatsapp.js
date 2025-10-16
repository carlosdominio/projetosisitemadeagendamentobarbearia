// WhatsApp Business API Integration (Meta)
async function sendWhatsAppMessage(phoneNumber, message) {
    try {
        // Usar API do backend se disponível, senão simular
        const response = await fetch('/api/whatsapp/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                message: message
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            if (result.simulated) {
                return { success: false, simulated: true };
            }
            return { success: true, messageId: result.messageId };
        } else {
            return { success: false, error: result.error };
        }
    } catch (error) {
        // Fallback para simulação se API não estiver disponível
        console.log('API não disponível - usando simulação');
        return { success: false, simulated: true };
    }
}

function sendWhatsAppNotification(phoneNumber, message) {
    console.log(`Enviando WhatsApp para ${phoneNumber}: ${message}`);

    sendWhatsAppMessage(phoneNumber, message).then(result => {
        if (result.success) {
            alert(`✅ WhatsApp enviado com sucesso para ${phoneNumber}!`);
        } else if (result.simulated) {
            alert(`📱 WhatsApp simulado para ${phoneNumber}. Configure a API do WhatsApp Business para envio real.`);
        } else {
            alert(`⚠️ Erro ao enviar WhatsApp: ${result.error}`);
        }
    }).catch(error => {
        alert(`⚠️ Erro ao enviar WhatsApp. Usando simulação.`);
    });
}

function sendAppointmentConfirmation(clientPhone, appointmentDetails) {
    const message = `Olá! Seu agendamento foi confirmado para ${appointmentDetails.date} às ${appointmentDetails.time}. Serviço: ${appointmentDetails.service}. Até logo!`;
    sendWhatsAppNotification(clientPhone, message);
}

// Exemplo de uso após agendamento
function afterAppointmentBooking(clientPhone, appointment) {
    sendAppointmentConfirmation(clientPhone, appointment);
    // Outras ações pós-agendamento
}