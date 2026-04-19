/* ── ADMIN DASHBOARD LOGIC ───────────────────────────
   Handles adding / deleting courses and managing clients.
   All data is fetched via API (courses.js -> api.js).
─────────────────────────────────────────────────────── */

let editingCourseId = null;

document.addEventListener('DOMContentLoaded', () => {
  renderAdminTable();
  renderClientsTable();
  setMinDateTime();
  refreshStats();
});

const setMinDateTime = () => {
  const input = document.getElementById('fieldDateTime');
  if (!input) return;
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  input.min = now.toISOString().slice(0, 16);
};

const addCourse = async () => {
  const fields = {
    title:           document.getElementById('fieldTitle'),
    coachNom:        document.getElementById('fieldCoachNom'),
    coachPrenom:     document.getElementById('fieldCoachPrenom'),
    coachEmail:      document.getElementById('fieldCoachEmail'),
    dateTime:        document.getElementById('fieldDateTime'),
    capacity:        document.getElementById('fieldCapacity'),
    image:           document.getElementById('fieldImage'),
    description:     document.getElementById('fieldDescription'),
    price:           document.getElementById('fieldPrice'),
  };

  const errorEl = document.getElementById('adminFormError');
  errorEl.textContent = '';

  for (const [key, el] of Object.entries(fields)) {
    if (key !== 'image' && key !== 'title' && key !== 'coachNom' && key !== 'coachPrenom' && key !== 'coachEmail' && key !== 'price' && !el.value.trim()) { 
      errorEl.textContent = 'Veuillez remplir Date, Capacité et Description.';
      if (el.focus) el.focus();
      return;
    }
  }

  const capacity = parseInt(fields.capacity.value, 10);
  const price = parseInt(fields.price.value, 10);
  
  const baseData = {
    type: 'PILATES',
    title: fields.title.value.trim(),
    coachFirstName: fields.coachPrenom.value.trim(),
    coachLastName: fields.coachNom.value.trim(),
    coachEmail: fields.coachEmail.value.trim(),
    description: fields.description.value.trim(),
    dateTime: fields.dateTime.value,
    capacity: capacity,
    image: fields.image.value.trim(),
    price: isNaN(price) ? 1500 : price,
    instructorId: 1
  };

  try {
      if (editingCourseId) {
        await CoursesDB.update(editingCourseId, baseData);
        editingCourseId = null;
        document.querySelector('#addCourseSection .admin-card-title').textContent = 'Ajouter une Classe';
        document.querySelector('#addCourseSection .admin-submit-btn').textContent = 'Publier la Classe →';
        showToast('Classe mise à jour avec succès ✓');
      } else {
        await CoursesDB.add(baseData);
        showToast('Classe ajoutée avec succès ✓');
      }

      renderAdminTable();
      renderClientsTable();
      resetAdminForm();
      refreshStats();
  } catch(e) {
      errorEl.textContent = e.message || 'Erreur lors de l\'ajout.';
  }
};

const deleteCourse = async (id) => {
  if (!confirm('Supprimer cette classe ? Cette action est irréversible.')) return;
  try {
      await CoursesDB.remove(id);
      renderAdminTable();
      renderClientsTable();
      refreshStats();
      showToast('Classe supprimée.');
  } catch(e) {
      showToast('Erreur de suppression.');
  }
};

const editCourse = async (id) => {
  const courses = await CoursesDB.getAll();
  const course = courses.find(c => c.id == id);
  if (!course) return;

  editingCourseId = id;
  
  document.getElementById('fieldTitle').value = course.title || course.description || '';
  document.getElementById('fieldCoachNom').value = course.coachLastName || "";
  document.getElementById('fieldCoachPrenom').value = course.coachFirstName || "";
  document.getElementById('fieldCoachEmail').value = course.coachEmail || "";
  document.getElementById('fieldDateTime').value = `${course.date}T${course.time}`;
  document.getElementById('fieldCapacity').value = course.capacity;
  document.getElementById('fieldImage').value = course.imageUrl || '';
  document.getElementById('fieldDescription').value = course.description;
  document.getElementById('fieldPrice').value = course.price || '';
  
  document.querySelector('#addCourseSection .admin-card-title').textContent = 'Éditer une Classe';
  document.querySelector('#addCourseSection .admin-submit-btn').textContent = 'Enregistrer les Modifications →';
  
  document.getElementById('addCourseSection').scrollIntoView({ behavior: 'smooth' });
};

const renderAdminTable = async () => {
  const tbody = document.getElementById('adminTableBody');
  const empty = document.getElementById('emptyState');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6">Chargement...</td></tr>';
  const courses = await CoursesDB.getAll();
  
  if (!courses || courses.length === 0) {
    empty.style.display = 'block';
    tbody.innerHTML = '';
    return;
  }
  
  empty.style.display = 'none';
  tbody.innerHTML = '';

  courses.forEach(c => {
    const spots = CoursesDB.spotsLeft(c);
    const dt = c.date && c.time ? new Date(`${c.date}T${c.time}`) : new Date();
    const dateStr = dt.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
    const timeStr = dt.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit', hour12: false });
    const isPast = dt < new Date();

    const tr = document.createElement('tr');
    tr.className = isPast ? 'row--past' : '';
    tr.innerHTML = `
      <td>
        <div class="td-title">${c.title || c.description || c.type}</div>
      </td>
      <td>
        <div class="td-coach">${c.coachFirstName || 'Instructeur'} ${c.coachLastName || ''}</div>
      </td>
      <td>
        <div>${dateStr}</div>
        <div class="td-time">${timeStr}</div>
      </td>
      <td>
        <div class="td-price">${c.price ? c.price.toLocaleString('fr-FR') + ' DA' : '—'}</div>
      </td>
      <td>
        <div class="spots-bar">
          <div class="spots-fill" style="width:${Math.round(((c.reservedSpots||0) / c.capacity) * 100)}%"></div>
        </div>
        <div class="spots-text">${c.reservedSpots||0} / ${c.capacity} ${spots <= 0 ? '<span class="badge-full">Complet</span>' : ''}</div>
      </td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="admin-btn-edit" onclick="editCourse('${c.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Éditer
          </button>
          <button class="admin-btn-delete" onclick="deleteCourse('${c.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            Supprimer
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

const renderClientsTable = async () => {
  const tbody = document.getElementById('clientsTableBody');
  const empty = document.getElementById('clientsEmptyState');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5">Chargement...</td></tr>';
  const clients = await ClientsDB.getAll();

  if (!clients || clients.length === 0) {
    empty.style.display = 'flex';
    tbody.innerHTML = '';
    return;
  }
  
  empty.style.display = 'none';
  tbody.innerHTML = '';

  clients.forEach(cl => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="td-title">${cl.firstName} ${cl.lastName}</div></td>
      <td><div class="td-email">${cl.email}</div></td>
      <td><div class="td-coach">${cl.courseType || 'Classe #'+cl.courseId}</div></td>
      <td><div class="td-time">${cl.bookedAt ? new Date(cl.bookedAt).toLocaleDateString('fr-FR') : '—'}</div></td>
      <td>
        <button class="admin-btn-delete" onclick="deleteClient('${cl.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Retirer
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

const addClient = async () => {
  const nameEl   = document.getElementById('clientName');
  const emailEl  = document.getElementById('clientEmail');
  const courseEl = document.getElementById('clientCourse');
  const errorEl  = document.getElementById('clientFormError');

  errorEl.textContent = '';

  if (!nameEl.value.trim() || !emailEl.value.trim() || !courseEl.value) {
    errorEl.textContent = 'Veuillez remplir tous les champs.';
    return;
  }

  const [firstName, ...lastNameParts] = nameEl.value.trim().split(' ');
  const lastName = lastNameParts.join(' ') || '.';

  try {
      await ClientsDB.add({
        firstName,
        lastName,
        email: emailEl.value.trim(),
        courseId: courseEl.value
      });

      nameEl.value = '';
      emailEl.value = '';
      courseEl.value = '';

      renderAdminTable();
      renderClientsTable();
      refreshStats();
      showToast('Client réservation ajoutée avec succès ✓');
  } catch(e) {
      errorEl.textContent = e.message || 'Erreur lors de la réservation';
  }
};

const deleteClient = async (id) => {
  if (!confirm('Retirer cette réservation ? Cette action est irréversible.')) return;
  try {
      await ClientsDB.remove(id);
      renderClientsTable();
      renderAdminTable();
      refreshStats();
      showToast('Réservation retirée.');
  } catch(e) {
      showToast('Erreur de suppression.');
  }
};

const populateCourseSelect = async () => {
  const sel = document.getElementById('clientCourse');
  if (!sel) return;
  const courses = await CoursesDB.getAll();
  sel.innerHTML = '<option value="">— Choisir une classe —</option>' +
    courses.map(c => `<option value="${c.id}">${c.description ? c.description.split('.')[0] : c.type} (${CoursesDB.spotsLeft(c)} places)</option>`).join('');
};

const resetAdminForm = () => {
  ['fieldTitle','fieldCoachNom','fieldCoachPrenom','fieldCoachEmail','fieldDateTime','fieldCapacity','fieldImage','fieldDescription','fieldPrice']
    .forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('adminFormError').textContent = '';
  setMinDateTime();
  if (editingCourseId) {
    editingCourseId = null;
    document.querySelector('#addCourseSection .admin-card-title').textContent = 'Ajouter une Classe';
    document.querySelector('#addCourseSection .admin-submit-btn').textContent = 'Publier la Classe →';
  }
};

const showToast = (msg) => {
  const toast = document.getElementById('adminToast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
};

const refreshStats = async () => {
  const courses = await CoursesDB.getAll();
  const clients = await ClientsDB.getAll();
  const now     = new Date();
  
  const active  = courses.filter(c => {
      const dt = c.date && c.time ? new Date(`${c.date}T${c.time}`) : new Date();
      return dt > now;
  });
  
  const booked  = courses.reduce((s, c) => s + (c.reservedSpots || 0), 0);

  document.getElementById('statActive').textContent  = active ? active.length : 0;
  document.getElementById('statBooked').textContent  = booked ? booked : 0;
  document.getElementById('statClients').textContent = clients ? clients.length : 0;
};