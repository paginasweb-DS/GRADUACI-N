// =========================================================
// LÓGICA DE INVITACIÓN MILITAR Y CONFIRMACIÓN WHATSAPP
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // Configuración por defecto acorde a tus cambios en HTML
    const defaultConfig = {
        phone: '593983557401',
        soldier: 'SLDO CB CRUZ ALEX',
        rank: '',
        date: '2026-08-15',
        time: '18:00 HS',
        location: 'Zabala, Carpinteros y Alondras N2287',
        mapLink: 'https://maps.app.goo.gl/rzNgVE5jYWzSFcsK9'
    };

    // Cargar datos guardados (o usar la vista HTML por defecto)
    let appConfig = JSON.parse(localStorage.getItem('military_invitation_cfg')) || defaultConfig;

    // Elementos DOM de vista
    const displaySoldier = document.getElementById('displaySoldier');
    const displayRank = document.getElementById('displayRank');
    const displayDate = document.getElementById('displayDate');
    const displayTime = document.getElementById('displayTime');
    const displayLocation = document.getElementById('displayLocation');
    const displayMapBtn = document.getElementById('displayMapBtn');

    // Elementos Modal Config
    const configBtn = document.getElementById('configBtn');
    const configModal = document.getElementById('configModal');
    const closeModal = document.getElementById('closeModal');
    const configForm = document.getElementById('configForm');

    const cfgPhone = document.getElementById('cfgPhone');
    const cfgSoldier = document.getElementById('cfgSoldier');
    const cfgRank = document.getElementById('cfgRank');
    const cfgDate = document.getElementById('cfgDate');
    const cfgTime = document.getElementById('cfgTime');
    const cfgLocation = document.getElementById('cfgLocation');
    const cfgMapLink = document.getElementById('cfgMapLink');

    // Elementos RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    const attendanceInputs = document.querySelectorAll('input[name="attendance"]');

    // Formatear Fecha en Español
    function formatDateString(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length < 3) return dateStr;
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('es-ES', options);
    }

    // Renderizar Configuración en la Vista SOLO si hay datos personalizados cargados
    function renderView() {
        if (displaySoldier && appConfig.soldier) displaySoldier.textContent = appConfig.soldier;
        if (displayRank) {
            if (appConfig.rank) {
                displayRank.textContent = appConfig.rank;
                displayRank.style.display = 'block';
            } else {
                displayRank.style.display = 'none'; // si está vacío o comentado
            }
        }
        if (displayDate && appConfig.date) displayDate.textContent = formatDateString(appConfig.date);
        if (displayTime && appConfig.time) displayTime.textContent = appConfig.time;
        if (displayLocation && appConfig.location) displayLocation.textContent = appConfig.location;
        if (displayMapBtn && appConfig.mapLink) displayMapBtn.href = appConfig.mapLink;

        // Llenar campos del modal
        if (cfgPhone) cfgPhone.value = appConfig.phone;
        if (cfgSoldier) cfgSoldier.value = appConfig.soldier;
        if (cfgRank) cfgRank.value = appConfig.rank;
        if (cfgDate) cfgDate.value = appConfig.date;
        if (cfgTime) cfgTime.value = appConfig.time;
        if (cfgLocation) cfgLocation.value = appConfig.location;
        if (cfgMapLink) cfgMapLink.value = appConfig.mapLink;
    }

    // Modal Events
    configBtn.addEventListener('click', () => configModal.classList.add('open'));
    closeModal.addEventListener('click', () => configModal.classList.remove('open'));
    configModal.addEventListener('click', (e) => {
        if (e.target === configModal) configModal.classList.remove('open');
    });

    // Guardar Configuración
    configForm.addEventListener('submit', (e) => {
        e.preventDefault();
        appConfig = {
            phone: cfgPhone.value.replace(/[^0-9]/g, ''), // solo números
            soldier: cfgSoldier.value,
            rank: cfgRank.value,
            date: cfgDate.value,
            time: cfgTime.value,
            location: cfgLocation.value,
            mapLink: cfgMapLink.value
        };
        localStorage.setItem('military_invitation_cfg', JSON.stringify(appConfig));
        renderView();
        startCountdown();
        configModal.classList.remove('open');
        alert('¡Datos de la invitación actualizados con éxito!');
    });



    // Contador Regresivo
    let countdownInterval;
    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);

        const targetDate = new Date(`${appConfig.date}T${appConfig.time.replace(/[^0-9:]/g, '') || '16:00'}:00`).getTime();

        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    // Enviar RSVP a WhatsApp
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const guestName = document.getElementById('guestName').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const guestMessage = document.getElementById('guestMessage').value.trim();

        if (!guestName) {
            alert('Por favor, ingresa tu nombre.');
            return;
        }

        // Construir Mensaje Formateado para WhatsApp
        let messageText = `🎖️ *CONFIRMACIÓN DE ASISTENCIA - GRADUACIÓN MILITAR* 🎖️\n\n`;
        messageText += `👤 *Invitado:* ${guestName}\n`;
        messageText += `🎖️ *Homenajeado:* ${appConfig.soldier}\n`;
        messageText += `📌 *Estado:* ${attendance}\n`;

        if (guestMessage) {
            messageText += `\n💬 *Mensaje de Felicitación:*\n"${guestMessage}"\n`;
        }

        messageText += `\n✨ *Enviado desde la Invitación Digital.*`;

        // URL encode
        const encodedMessage = encodeURIComponent(messageText);
        const phoneNumber = appConfig.phone || '593999999999';
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        // Redirigir a WhatsApp
        window.open(whatsappUrl, '_blank');
    });

    // Inicialización
    renderView();
    startCountdown();
});
