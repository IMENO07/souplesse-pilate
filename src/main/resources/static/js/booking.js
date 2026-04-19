/* ── CLIENT BOOKING LOGIC ────────────────────────────
   Handles the Classes grid and the booking modal flow
   on index.html. Reads/writes via CoursesDB (courses.js).
─────────────────────────────────────────────────────── */

/* ── State ──────────────────────────────────────────── */
let selectedCourseId = null;

/* ── Init ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  EmailService.init();
  renderClassGrid();
  bindModalEvents();
});

/* ── Render grid (no level/category display) ────────── */
const renderClassGrid = async () => {
  const grid = document.getElementById('dynamicCoursesGrid');
  if (!grid) return;

  grid.innerHTML = '<p class="no-classes">Chargement des classes...</p>';

  const courses = await CoursesDB.getAll();

  grid.innerHTML = '';

  if (!courses || courses.length === 0) {
    grid.innerHTML = `<p class="no-classes">Aucune classe disponible pour le moment.</p>`;
    return;
  }

  courses.forEach(course => {
    const spots = CoursesDB.spotsLeft(course);
    const full  = spots <= 0;
    const dt = course.date && course.time ? new Date(`${course.date}T${course.time}`) : new Date();
    const dateStr = dt.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' });
    const timeStr = dt.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });

    const coachName = `Instructeur #${course.instructorId}`;

    const card = document.createElement('article');
    card.className = `class-card ${full ? 'class-card--full' : ''}`;
    card.dataset.id = course.id;

    card.innerHTML = `
      <div class="class-card__header">
        <span class="class-card__spots ${spots <= 2 && !full ? 'class-card__spots--low' : ''} ${full ? 'class-card__spots--full' : ''}">
          ${full ? 'Complet' : `${spots} place${spots > 1 ? 's' : ''} restante${spots > 1 ? 's' : ''}`}
        </span>
      </div>
      <h3 class="class-card__title">${course.description ? course.description.split('.')[0] : course.type}</h3>
      <div class="class-card__meta">
        <span class="class-card__coach">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          ${coachName}
        </span>
        <span class="class-card__datetime">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${dateStr} · ${timeStr}
        </span>
      </div>
      <p class="class-card__desc">${course.description}</p>
      <button
        class="class-card__btn ${full ? 'class-card__btn--disabled' : ''}"
        onclick="openBookingModal('${course.id}')"
        ${full ? 'disabled' : ''}
      >
        ${full ? 'Classe Complète' : 'Réserver'}
      </button>
    `;
    grid.appendChild(card);
  });
};

/* ── Modal ──────────────────────────────────────────── */
const openBookingModal = async (courseId) => {
  selectedCourseId = courseId;
  const courses = await CoursesDB.getAll();
  const course = courses.find(c => c.id == courseId);
  if (!course) return;

  const dt = course.date && course.time ? new Date(`${course.date}T${course.time}`) : new Date();
  const dateStr = dt.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const timeStr = dt.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });

  document.getElementById('modalClassName').textContent  = course.description ? course.description.split('.')[0] : course.type;
  document.getElementById('modalCoachName').textContent  = `Instructeur #${course.instructorId}`;
  document.getElementById('modalDateTime').textContent   = `${dateStr} à ${timeStr}`;
  document.getElementById('modalSpotsLeft').textContent  = `${CoursesDB.spotsLeft(course)} place(s) restante(s)`;

  ['modalFirstName','modalLastName','modalEmail'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('modalError').textContent = '';

  showModalStep('step-form');
  document.getElementById('bookingModal').classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeBookingModal = () => {
  document.getElementById('bookingModal').classList.remove('active');
  document.body.style.overflow = '';
  selectedCourseId = null;
};

const showModalStep = (stepId) => {
  document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');
};

const bindModalEvents = () => {
  document.getElementById('bookingModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeBookingModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBookingModal();
  });
};

/* ── Confirm booking ────────────────────────────────── */
const confirmBooking = async () => {
  const firstName = document.getElementById('modalFirstName').value.trim();
  const lastName  = document.getElementById('modalLastName').value.trim();
  const email     = document.getElementById('modalEmail').value.trim();
  const errorEl   = document.getElementById('modalError');

  if (!firstName || !lastName || !email) {
    errorEl.textContent = 'Veuillez remplir tous les champs.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorEl.textContent = 'Adresse email invalide.';
    return;
  }

  const btnConfirm = document.getElementById('modalConfirmBtn');
  btnConfirm.textContent = 'Confirmation…';
  btnConfirm.disabled = true;
  errorEl.textContent = '';

  try {
      const courses = await CoursesDB.getAll();
      const course = courses.find(c => c.id == selectedCourseId);
      
      if (!course || CoursesDB.spotsLeft(course) <= 0) {
        errorEl.textContent = 'Désolé, cette classe est maintenant complète.';
        btnConfirm.textContent = 'Confirmer';
        btnConfirm.disabled = false;
        return;
      }

      await ClientsDB.add({
        firstName,
        lastName,
        email,
        courseId: course.id
      });

      const dt = course.date && course.time ? new Date(`${course.date}T${course.time}`) : new Date();
      const dateStr = dt.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
      const timeStr = dt.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
      const classDatetime = `${dateStr} à ${timeStr}`;

      try {
        await Promise.all([
          EmailService.sendClientConfirmation({
            clientName:    `${firstName} ${lastName}`,
            clientEmail:   email,
            classTitle:    course.description ? course.description.split('.')[0] : course.type,
            coachName:     `Instructeur #${course.instructorId}`,
            classDatetime,
            spotsLeft:     CoursesDB.spotsLeft(course) - 1,
          })
        ]);
      } catch (err) {
        console.warn('Email sending failed (booking still confirmed):', err);
      }

      document.getElementById('doneClientName').textContent = `${firstName} ${lastName}`;
      document.getElementById('doneClassInfo').textContent  = `${course.description ? course.description.split('.')[0] : course.type} · ${classDatetime}`;
      showModalStep('step-done');

      renderClassGrid();
  } catch(e) {
      errorEl.textContent = 'Erreur lors de la réservation.';
      console.error(e);
      btnConfirm.textContent = 'Confirmer';
      btnConfirm.disabled = false;
  }
};