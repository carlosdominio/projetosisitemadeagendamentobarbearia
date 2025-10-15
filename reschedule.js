// Reagendamento básico
document.getElementById('rescheduleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newDate = document.getElementById('newDate').value;
    const newTime = document.getElementById('newTime').value;
    alert(`Reagendamento realizado para ${newDate} às ${newTime}!`);
    window.location.href = 'index.html';
});