// =========================================================
// LISTA DE INVITADOS Y SUS PASES
// =========================================================
// INSTRUCCIONES PARA EL ANFITRIÓN:
// Agrega aquí cada familia/persona con su número de pases.
// El nombre debe coincidir exactamente con lo que escriba el invitado.
// (No importan mayúsculas ni minúsculas)

const guestsList = [
    { searchKey: 'Patricio López',      displayName: 'Sr. Patricio López y esposa',       passes: 2 },
    { searchKey: 'Javier López',        displayName: 'Sr. Javier López y familia',        passes: 4 },
    { searchKey: 'Nicolás Guerrero',    displayName: 'Sr. Nicolás Guerrero y familia',    passes: 3 },
    { searchKey: 'Angel Gómez',         displayName: 'Sr. Angel Gómez y familia',         passes: 3 },
    { searchKey: 'Andrés Gómez',        displayName: 'Sr. Andrés Gómez y esposa',         passes: 2 },
    { searchKey: 'Diego Collaguazo',    displayName: 'Sr. Diego Collaguazo y familia',    passes: 4 },
    { searchKey: 'Abigail Bravo',       displayName: 'Srta. Abigail Bravo e hijo',        passes: 2 },
    { searchKey: 'Karen Villacís',      displayName: 'Srta. Karen Villacís',              passes: 1 },
    { searchKey: 'Joel Cadena',         displayName: 'Sr. Joel Cadena',                   passes: 1 },
    { searchKey: 'Paul Morocho',        displayName: 'Sr. Paul Morocho',                  passes: 1 },
    { searchKey: 'Ariel Chamorro',      displayName: 'Sr. Ariel Chamorro',                passes: 1 },
    { searchKey: 'Teresa Puente',       displayName: 'Sra. Teresa Puente',                passes: 1 },
];

// =========================================================
// LÓGICA PRINCIPAL DE LA INVITACIÓN
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

    let appConfig = JSON.parse(localStorage.getItem('military_invitation_cfg')) || defaultConfig;

    // Elementos DOM de vista
    const displaySoldier = document.getElementById('displaySoldier');
    const displayRank    = document.getElementById('displayRank');
    const displayDate    = document.getElementById('displayDate');
    const displayTime    = document.getElementById('displayTime');
    const displayLocation = document.getElementById('displayLocation');
    const displayMapBtn  = document.getElementById('displayMapBtn');

    // Elementos Modal Config
    const configBtn   = document.getElementById('configBtn');
    const configModal = document.getElementById('configModal');
    const closeModal  = document.getElementById('closeModal');
    const configForm  = document.getElementById('configForm');
    const cfgPhone    = document.getElementById('cfgPhone');
    const cfgSoldier  = document.getElementById('cfgSoldier');
    const cfgRank     = document.getElementById('cfgRank');
    const cfgDate     = document.getElementById('cfgDate');
    const cfgTime     = document.getElementById('cfgTime');
    const cfgLocation = document.getElementById('cfgLocation');
    const cfgMapLink  = document.getElementById('cfgMapLink');

    // Elementos RSVP
    const paso1         = document.getElementById('paso1');
    const paso2         = document.getElementById('paso2');
    const buscarBtn     = document.getElementById('buscarPasesBtn');
    const confirmarBtn  = document.getElementById('confirmarBtn');
    const volverBtn     = document.getElementById('volverBtn');
    const noEncontrado  = document.getElementById('noEncontrado');
    const guestNameInput = document.getElementById('guestName');
    const passesGuestName = document.getElementById('passesGuestName');
    const passesCount   = document.getElementById('passesCount');

    let foundGuest = null; // Invitado encontrado

    // ---- Formatear Fecha en Español ----
    function formatDateString(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length < 3) return dateStr;
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // ---- Renderizar Vista ----
    function renderView() {
        if (displaySoldier && appConfig.soldier) displaySoldier.textContent = appConfig.soldier;
        if (displayRank) {
            displayRank.style.display = appConfig.rank ? 'block' : 'none';
            if (appConfig.rank) displayRank.textContent = appConfig.rank;
        }
        if (displayDate && appConfig.date) displayDate.textContent = formatDateString(appConfig.date);
        if (displayTime && appConfig.time) displayTime.textContent = appConfig.time;
        if (displayLocation && appConfig.location) displayLocation.textContent = appConfig.location;
        if (displayMapBtn && appConfig.mapLink) displayMapBtn.href = appConfig.mapLink;

        if (cfgPhone)    cfgPhone.value    = appConfig.phone;
        if (cfgSoldier)  cfgSoldier.value  = appConfig.soldier;
        if (cfgRank)     cfgRank.value     = appConfig.rank;
        if (cfgDate)     cfgDate.value     = appConfig.date;
        if (cfgTime)     cfgTime.value     = appConfig.time;
        if (cfgLocation) cfgLocation.value = appConfig.location;
        if (cfgMapLink)  cfgMapLink.value  = appConfig.mapLink;
    }

    // ---- Modal Config ----
    if (configBtn)  configBtn.addEventListener('click', () => configModal.classList.add('open'));
    if (closeModal) closeModal.addEventListener('click', () => configModal.classList.remove('open'));
    if (configModal) configModal.addEventListener('click', (e) => {
        if (e.target === configModal) configModal.classList.remove('open');
    });

    if (configForm) {
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            appConfig = {
                phone:    cfgPhone.value.replace(/[^0-9]/g, ''),
                soldier:  cfgSoldier.value,
                rank:     cfgRank.value,
                date:     cfgDate.value,
                time:     cfgTime.value,
                location: cfgLocation.value,
                mapLink:  cfgMapLink.value
            };
            localStorage.setItem('military_invitation_cfg', JSON.stringify(appConfig));
            renderView();
            startCountdown();
            configModal.classList.remove('open');
            alert('¡Datos de la invitación actualizados!');
        });
    }

    // ---- Buscar Pases ----
    if (buscarBtn) {
        buscarBtn.addEventListener('click', () => {
            const rawInput = guestNameInput.value.trim();
            if (!rawInput) {
                guestNameInput.focus();
                return;
            }

            // Normaliza: minúsculas + quita tildes/acentos + quita espacios extra
            const normalize = str => str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')  // quita tildes
                .replace(/\s+/g, ' ')              // espacios extra
                .trim();

            const inputNorm = normalize(rawInput);

            // Buscar: exacta → incluye el input → input incluye la clave
            foundGuest = guestsList.find(g => normalize(g.searchKey) === inputNorm)
                      || guestsList.find(g => normalize(g.searchKey).includes(inputNorm))
                      || guestsList.find(g => inputNorm.includes(normalize(g.searchKey)));

            if (foundGuest) {
                noEncontrado.style.display = 'none';
                passesGuestName.textContent = foundGuest.displayName;
                passesCount.textContent = foundGuest.passes;
                paso1.style.display = 'none';
                paso2.style.display = 'block';
                paso2.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                noEncontrado.style.display = 'block';
            }
        });

        // Buscar al presionar Enter
        guestNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarBtn.click();
        });
    }

    // ---- Volver al Paso 1 ----
    if (volverBtn) {
        volverBtn.addEventListener('click', () => {
            paso2.style.display = 'none';
            paso1.style.display = 'block';
            if (guestNameInput) guestNameInput.value = '';
            if (noEncontrado) noEncontrado.style.display = 'none';
            foundGuest = null;
        });
    }

    // ---- Confirmar por WhatsApp ----
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', () => {
            if (!foundGuest) return;

            const attendance  = document.querySelector('input[name="attendance"]:checked').value;
            const guestMessage = document.getElementById('guestMessage').value.trim();

            let messageText = `🎖️ *CONFIRMACIÓN DE ASISTENCIA - GRADUACIÓN MILITAR* 🎖️\n\n`;
            messageText += `👤 *Invitado:* ${foundGuest.displayName}\n`;
            messageText += `🎖️ *Homenajeado:* ${appConfig.soldier}\n`;
            messageText += `📌 *Estado:* ${attendance}\n`;
            messageText += `🎫 *Pases asignados:* ${foundGuest.passes} pase(s)\n`;

            if (guestMessage) {
                messageText += `\n💬 *Mensaje de Felicitación:*\n"${guestMessage}"\n`;
            }
            messageText += `\n✨ *Enviado desde la Invitación Digital.*`;

            const encoded = encodeURIComponent(messageText);
            const phone   = appConfig.phone || '593983557401';
            window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
        });
    }

    // ---- Contador Regresivo ----
    let countdownInterval;
    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        const timeStr  = (appConfig.time || '18:00').replace(/[^0-9:]/g, '') || '18:00';
        const targetDate = new Date(`${appConfig.date}T${timeStr}:00`).getTime();

        function updateTimer() {
            const distance = targetDate - Date.now();
            if (distance < 0) {
                ['days','hours','minutes','seconds'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = '00';
                });
                return;
            }
            const days    = Math.floor(distance / 86400000);
            const hours   = Math.floor((distance % 86400000) / 3600000);
            const minutes = Math.floor((distance % 3600000) / 60000);
            const seconds = Math.floor((distance % 60000) / 1000);

            const set = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = String(val).padStart(2, '0');
            };
            set('days', days); set('hours', hours);
            set('minutes', minutes); set('seconds', seconds);
        }
        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    // ---- Inicializar ----
    renderView();
    startCountdown();
});
