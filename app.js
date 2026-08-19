// Lógica de la Invitación Virtual - Carlos Gómez Lázaro & Andrea de Sousa Cubero

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initFormInteractions();
});

/**
 * Contador en vivo hacia la fecha de la boda
 */
function initCountdown() {
  const targetDate = new Date(WEDDING_CONFIG.date.iso).getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById('countdown-days').innerText = "00";
      document.getElementById('countdown-hours').innerText = "00";
      document.getElementById('countdown-minutes').innerText = "00";
      document.getElementById('countdown-seconds').innerText = "00";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').innerText = days.toString().padStart(2, '0');
    document.getElementById('countdown-hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('countdown-minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('countdown-seconds').innerText = seconds.toString().padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/**
 * Inicializador y manejador del Formulario RSVP
 */
function initFormInteractions() {
  const rsvpForm = document.getElementById('rsvp-form');

  // Procesar envío del formulario
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('rsvp-submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enviando respuesta...</span>`;

    // Recopilar información introducida por el invitado
    const formData = new FormData(rsvpForm);
    const dietaryList = [];
    document.querySelectorAll('input[name="dietary"]:checked').forEach(cb => {
      dietaryList.push(cb.value);
    });

    const payload = {
      timestamp: new Date().toISOString(),
      fullName: formData.get('fullName')?.trim(),
      attendance: formData.get('attendance'),
      companions: "Invitación personal (Sin acompañantes)",
      dietary: dietaryList.join(', ') || "Ninguna",
      busRequired: formData.get('busRequired') || "No especificado",
      songRequest: formData.get('songRequest')?.trim() || "-",
      notes: formData.get('notes')?.trim() || "-",
      couple: WEDDING_CONFIG.couple.shortNames
    };

    let isSuccess = false;

    // 1. Intentar envío a Webhook (Google Sheets / Formspree) si está configurado
    if (WEDDING_CONFIG.rsvp.webhookUrl && WEDDING_CONFIG.rsvp.webhookUrl.startsWith('http')) {
      try {
        await fetch(WEDDING_CONFIG.rsvp.webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        isSuccess = true;
      } catch (err) {
        console.warn("Fallo temporal con Webhook, guardando respaldo...", err);
      }
    }

    // 2. Guardar siempre respaldo en LocalStorage para no perder ninguna respuesta durante pruebas
    if (WEDDING_CONFIG.rsvp.saveToLocalStorage) {
      saveResponseToLocalStorage(payload);
      isSuccess = true;
    }

    // Mostrar feedback al usuario
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      if (isSuccess) {
        showToast(`✨ ¡Gracias ${payload.fullName}! Tu respuesta se ha guardado correctamente.`);
        rsvpForm.reset();
      } else {
        showToast("⚠️ Hubo un pequeño problema al enviar. Por favor, inténtalo de nuevo.");
      }
    }, 600);
  });
}

/**
 * Guarda las respuestas en LocalStorage como base de datos local recargable
 */
function saveResponseToLocalStorage(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem('wedding_rsvp_responses') || '[]');
    existing.push(payload);
    localStorage.setItem('wedding_rsvp_responses', JSON.stringify(existing));
    console.log("Respuesta RSVP guardada en LocalStorage:", payload);
  } catch (e) {
    console.error("Error al guardar en LocalStorage", e);
  }
}

/**
 * Muestra notificación flotante elegante (Toast)
 */
function showToast(message) {
  let toastEl = document.getElementById('toast-notification');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast-notification';
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }

  toastEl.innerHTML = `<span>${message}</span>`;
  toastEl.classList.add('show');

  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 4500);
}
