/* ── ADMIN DASHBOARD LOGIC ───────────────────────────
    All data now comes from the Spring Boot API.
    No localStorage used for course/client data.
─────────────────────────────────────────────────────── */

// Guard: redirect to login if no token
if (!Auth.isLoggedIn()) {
  window.location.href = 'login.html';
}

let editingCourseId = null;
let allInstructors  = [];
let allCourses      = [];
let allReservations = [];

/* ── INIT ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  setMinDateTime();
  setupLogout();
  await loadAll();
});

async function loadAll() {
  try {
    await Promise.all([
      loadInstructors(),
      loadCourses(),
      loadReservations(),
    ]);
    refreshStats();
  } catch (err) {
    showToast('Erreur de chargement: ' + err.message);
  }
}

/* ── LOGOUT ─────────────────────────────────────────── */
function setupLogout() {
  const footer = document.querySelector('.sidebar-footer');
  if (!footer) return;
  const logoutBtn = document.createElement('a');
  logoutBtn.href = '#';
  logoutBtn.className = 'sidebar-back';
  logoutBtn.style.marginTop = '12px';
  logoutBtn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
    Déconnexion
  `;
  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    AuthAPI.logout();
  });
  footer.appendChild(logoutBtn);
}

/* ── LOAD INSTRUCTORS ───────────────────────────────── */
async function loadInstructors() {
  allInstructors = await InstructorsAPI.getAll();
  populateInstructorSelect();
}

function populateInstructorSelect() {
  const sel = document.getElementById('fieldInstructor');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Choisir un instructeur —</option>' +
    allInstructors.map(i => `<option value="${i.id}">${i.firstName} ${i.lastName}</option>`).join('');
}

/* ── LOAD COURSES ───────────────────────────────────── */
async function loadCourses() {
  allCourses = await CoursesAPI.getAll();
  renderAdminTable();
  populateCourseSelect();
}

/* ── LOAD RESERVATIONS ──────────────────────────────── */
async function loadReservations() {
  allReservations = await ReservationsAPI.getAll();
  renderClientsTable();
}

/* ── STATS ──────────────────────────────────────────── */
function refreshStats() {
  const now    = new Date();
  const active = allCourses.filter(c => new Date(c.date + 'T' + c.time) > now);
  document.getElementById('statActive').textContent  = active.length;
  document.getElementById('statBooked').textContent  = allReservations.length;
  document.getElementById('statClients').textContent = new Set(allReservations.map(r => r.email)).size;
}

/* ── SET MIN DATETIME ───────────────────────────────── */
function setMinDateTime() {
  ['fieldDate', 'fieldTime'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.type === 'date') {
      const now = new Date();
      el.min = now.toISOString().slice(0, 10);
    }
  });
}

/* ── ADD / UPDATE COURSE ────────────────────────────── */
const addCourse = async () => {
  const errorEl = document.getElementById('adminFormError');
  errorEl.textContent = '';

  const type         = document.getElementById('fieldTitle')?.value.trim();
  const description  = document.getElementById('fieldDescription')?.value.trim();
  const priceRaw     = document.getElementById('fieldPrice')?.value.trim();
  const date         = document.getElementById('fieldDate')?.value;
  const time         = document.getElementById('fieldTime')?.value;
  const capacity     = document.getElementById('fieldCapacity')?.value;
  const imageUrl     = document.getElementById('fieldImage')?.value.trim() || null;
  const instructorId = document.getElementById('fieldInstructor')?.value;

  // Validation
  if (!type || !description || !date || !time || !capacity || !instructorId) {
    errorEl.textContent = 'Veuillez remplir tous les champs obligatoires.';
    return;
  }
  if (!priceRaw || isNaN(Number(priceRaw)) || Number(priceRaw) < 0) {
    errorEl.textContent = 'Prix invalide.';
    return;
  }

  const payload = {
    type:         type.toUpperCase().replace(/\s+/g, '_'),
    description,
    price:        Number(priceRaw),
    date,         // "YYYY-MM-DD"
    time:         time + ':00',   // "HH:MM:SS"
    capacity:     Number(capacity),
    instructorId: Number(instructorId),
    imageUrl:     imageUrl || null,
  };

  try {
    if (editingCourseId) {
      await CoursesAPI.update(editingCourseId, payload);
      showToast('Classe mise à jour ✓');
      editingCourseId = null;
      resetAdminForm();
    } else {
      await CoursesAPI.create(payload);
      showToast('Classe créée ✓');
      resetAdminForm();
    }
    await loadCourses();
    await loadReservations();
    refreshStats();
  } catch (err) {
    errorEl.textContent = err.message;
  }
};

/* ── DELETE COURSE ──────────────────────────────────── */
const deleteCourse = async (id) => {
  if (!confirm('Supprimer cette classe ?')) return;
  try {
    await CoursesAPI.remove(id);
    showToast('Classe supprimée.');
    await loadCourses();
    await loadReservations();
    refreshStats();
  } catch (err) {
    showToast('Erreur: ' + err.message);
  }
};

/* ── EDIT COURSE (pre-fill form) ─────────────────────── */
const editCourse = (id) => {
  const course = allCourses.find(c => c.id === id);
  if (!course) return;
  editingCourseId = id;

  if (document.getElementById('fieldTitle'))
    document.getElementById('fieldTitle').value = course.type || '';
  if (document.getElementById('fieldDescription'))
    document.getElementById('fieldDescription').value = course.description || '';
  if (document.getElementById('fieldPrice'))
    document.getElementById('fieldPrice').value = course.price ?? '';
  if (document.getElementById('fieldDate'))
    document.getElementById('fieldDate').value = course.date || '';
  if (document.getElementById('fieldTime'))
    document.getElementById('fieldTime').value = course.time ? course.time.slice(0,5) : '';
  if (document.getElementById('fieldCapacity'))
    document.getElementById('fieldCapacity').value = course.capacity || '';
  if (document.getElementById('fieldImage'))
    document.getElementById('fieldImage').value = course.imageUrl || '';
  if (document.getElementById('fieldInstructor'))
    document.getElementById('fieldInstructor').value = course.instructorId || '';

  document.querySelector('#addCourseSection .admin-card-title').textContent = 'Éditer une Classe';
  document.querySelector('#addCourseSection .admin-submit-btn').textContent = 'Enregistrer →';
  document.getElementById('addCourseSection').scrollIntoView({ behavior: 'smooth' });
};

/* ── RENDER COURSES TABLE ───────────────────────────── */
const renderAdminTable = () => {
  const tbody  = document.getElementById('adminTableBody');
  const empty  = document.getElementById('emptyState');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (allCourses.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  allCourses.forEach(c => {
    const courseReservations = allReservations.filter(r => r.courseId === c.id);
    const booked   = courseReservations.length;
    const spots    = c.capacity - booked;
    const isPast   = new Date(c.date + 'T' + c.time) < new Date();
    const dateStr  = new Date(c.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr  = c.time ? c.time.slice(0, 5) : '';

    const tr = document.createElement('tr');
    tr.className = isPast ? 'row--past' : '';
    tr.innerHTML = `
      <td>
        <div class="td-title">${c.type}</div>
      </td>
      <td>
        <div class="td-coach">${c.instructorId || '—'}</div>
      </td>
      <td>
        <div>${dateStr}</div>
        <div class="td-time">${timeStr}</div>
      </td>
      <td>
        <div class="td-price">${c.price ? Number(c.price).toLocaleString('fr-FR') + ' DA' : '—'}</div>
      </td>
      <td>
        <div class="spots-bar">
          <div class="spots-fill" style="width:${c.capacity ? Math.round((booked/c.capacity)*100) : 0}%"></div>
        </div>
        <div class="spots-text">${booked} / ${c.capacity} ${spots === 0 ? '<span class="badge-full">Complet</span>' : ''}</div>
      </td>
      <td>
        <div style="display:flex;gap:8px">
          <button class="admin-btn-edit" onclick="editCourse(${c.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Éditer
          </button>
          <button class="admin-btn-delete" onclick="deleteCourse(${c.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Supprimer
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

/* ── RENDER CLIENTS TABLE ───────────────────────────── */
const renderClientsTable = () => {
  const tbody = document.getElementById('clientsTableBody');
  const empty = document.getElementById('clientsEmptyState');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (allReservations.length === 0) {
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  allReservations.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="td-title">${r.firstName} ${r.lastName}</div></td>
      <td><div class="td-email">${r.email}</div></td>
      <td><div class="td-coach">${r.courseType || '—'}</div></td>
      <td><div class="td-time">${r.courseDate || '—'}</div></td>
      <td>
        <button class="admin-btn-delete" onclick="deleteReservation(${r.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
          Retirer
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

/* ── DELETE RESERVATION ─────────────────────────────── */
const deleteReservation = async (id) => {
  if (!confirm('Retirer ce client ?')) return;
  try {
    await ReservationsAPI.remove(id);
    showToast('Client retiré.');
    await loadReservations();
    refreshStats();
  } catch (err) {
    showToast('Erreur: ' + err.message);
  }
};

/* ── POPULATE COURSE SELECT (client form) ───────────── */
const populateCourseSelect = () => {
  const sel = document.getElementById('clientCourse');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Choisir une classe —</option>' +
    allCourses.map(c => {
      const booked = allReservations.filter(r => r.courseId === c.id).length;
      const spots  = c.capacity - booked;
      return `<option value="${c.id}" ${spots === 0 ? 'disabled' : ''}>${c.type} — ${c.date} (${spots} places)</option>`;
    }).join('');
};

/* ── RESET FORM ─────────────────────────────────────── */
const resetAdminForm = () => {
  ['fieldTitle','fieldDescription','fieldPrice','fieldDate',
    'fieldTime','fieldCapacity','fieldImage','fieldInstructor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('adminFormError').textContent = '';
  editingCourseId = null;
  const titleEl = document.querySelector('#addCourseSection .admin-card-title');
  const btnEl   = document.querySelector('#addCourseSection .admin-submit-btn');
  if (titleEl) titleEl.textContent = 'Ajouter une Classe';
  if (btnEl)   btnEl.textContent   = 'Publier la Classe →';
  setMinDateTime();
};

/* ── TOAST ──────────────────────────────────────────── */
const showToast = (msg) => {
  const toast = document.getElementById('adminToast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
};
/* ── TAB SWITCHING ──────────────────────────────────────────────────────────── */
const switchTab = (tabName) => {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('active'));
  
  // Show selected tab
  document.getElementById(tabName + '-tab').classList.add('active');
  event.target.classList.add('active');
  
  // Load instructors when switching to instructors tab
  if (tabName === 'instructors') {
    renderInstructors();
  }
};

/* ── ADD / UPDATE INSTRUCTOR ────────────────────────────────────────────────── */
let editingInstructorId = null;

const addInstructor = async () => {
  const errorEl = document.getElementById('instructorFormError');
  errorEl.textContent = '';

  const firstName = document.getElementById('instFirstName')?.value.trim();
  const lastName  = document.getElementById('instLastName')?.value.trim();
  const email     = document.getElementById('instEmail')?.value.trim();

  // Validation
  if (!firstName || !lastName || !email) {
    errorEl.textContent = 'Veuillez remplir tous les champs.';
    return;
  }

  // Basic email validation
  if (!email.includes('@')) {
    errorEl.textContent = 'Email invalide.';
    return;
  }

  try {
    if (editingInstructorId) {
      // Update existing instructor
      await InstructorsAPI.update(editingInstructorId, firstName, lastName, email);
      showToast('Instructeur mis à jour ✓');
      editingInstructorId = null;
    } else {
      // Create new instructor
      await InstructorsAPI.create(firstName, lastName, email);
      showToast('Instructeur ajouté ✓');
    }
    resetInstructorForm();
    await loadInstructors();
  } catch (err) {
    errorEl.textContent = err.message || 'Erreur lors de la sauvegarde';
  }
};

/* ── RESET INSTRUCTOR FORM ──────────────────────────────────────────────────– */
const resetInstructorForm = () => {
  document.getElementById('instFirstName').value = '';
  document.getElementById('instLastName').value = '';
  document.getElementById('instEmail').value = '';
  document.getElementById('instructorFormError').textContent = '';
  document.querySelector('#instructors-tab .admin-card-title').textContent = 'Ajouter un Instructeur';
  document.querySelector('#instructors-tab .admin-submit-btn').textContent = 'Ajouter Instructeur →';
  editingInstructorId = null;
};

/* ── EDIT INSTRUCTOR ────────────────────────────────────────────────────────– */
const editInstructor = (id) => {
  const instructor = allInstructors.find(i => i.id === id);
  if (!instructor) return;

  editingInstructorId = id;
  document.getElementById('instFirstName').value = instructor.firstName || '';
  document.getElementById('instLastName').value = instructor.lastName || '';
  document.getElementById('instEmail').value = instructor.email || '';

  document.querySelector('#instructors-tab .admin-card-title').textContent = 'Modifier l\'Instructeur';
  document.querySelector('#instructors-tab .admin-submit-btn').textContent = 'Enregistrer →';
  document.querySelector('#instructors-tab .admin-card-body').scrollIntoView({ behavior: 'smooth' });
};

/* ── DELETE INSTRUCTOR ──────────────────────────────────────────────────────– */
const deleteInstructor = async (id) => {
  if (!confirm('Supprimer cet instructeur ?')) return;
  try {
    await InstructorsAPI.remove(id);
    showToast('Instructeur supprimé.');
    await loadInstructors();
    await loadCourses(); // Reload courses as instructors may be referenced
  } catch (err) {
    showToast('Erreur: ' + err.message);
  }
};

/* ── RENDER INSTRUCTORS LIST ────────────────────────────────────────────────– */
const renderInstructors = () => {
  const container = document.getElementById('instructorsContainer');
  if (!container) return;

  if (allInstructors.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#999; padding:24px;">Aucun instructeur ajouté.</p>';
    return;
  }

  let html = '<div style="display: grid; gap: 12px;">';
  allInstructors.forEach(inst => {
    const coursesCount = allCourses.filter(c => c.instructorId === inst.id).length;
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f9f9f9; border-radius: 6px; border: 1px solid #e0e0e0;">
        <div>
          <div style="font-weight: 600; color: #2c4a5a;">${inst.firstName} ${inst.lastName}</div>
          <div style="font-size: 13px; color: #999; margin-top: 4px;">${inst.email}</div>
          <div style="font-size: 12px; color: #666; margin-top: 6px;">${coursesCount} classe(s)</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="admin-btn-edit" onclick="editInstructor(${inst.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="admin-btn-delete" onclick="deleteInstructor(${inst.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
};