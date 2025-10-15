// Notificações via WhatsApp (simulado)
function sendWhatsAppNotification(phoneNumber, message) {
    // Simular envio de mensagem WhatsApp
    // Em produção, seria integrada com API do WhatsApp Business
    console.log(`Enviando WhatsApp para ${phoneNumber}: ${message}`);
    alert(`Notificação WhatsApp enviada para ${phoneNumber}`);
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