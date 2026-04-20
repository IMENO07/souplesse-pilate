
/* ── Course Form Section ───────────────────────── */
function CourseForm({ editingCourse, onSave, onCancel }) {
  const [title, setTitle] = React.useState('');
  const [coachNom, setCoachNom] = React.useState('');
  const [coachPrenom, setCoachPrenom] = React.useState('');
  const [coachEmail, setCoachEmail] = React.useState('');
  const [dateTime, setDateTime] = React.useState('');
  const [capacity, setCapacity] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageFile, setImageFile] = React.useState(null);
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [error, setError] = React.useState('');
  const dtRef = React.useRef(null);

  // Populate form when editing
  React.useEffect(() => {
    if (editingCourse) {
      setTitle(editingCourse.title || editingCourse.description || '');
      setCoachNom(editingCourse.coachLastName || '');
      setCoachPrenom(editingCourse.coachFirstName || '');
      setCoachEmail(editingCourse.coachEmail || '');
      setDateTime(editingCourse.date && editingCourse.time ? `${editingCourse.date}T${editingCourse.time}` : '');
      setCapacity(editingCourse.capacity || '');
      setImage(editingCourse.imageUrl || '');
      setDescription(editingCourse.description || '');
      setPrice(editingCourse.price || '');
    } else {
      resetForm();
    }
  }, [editingCourse]);

  // Set min datetime
  React.useEffect(() => {
    if (dtRef.current) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      dtRef.current.min = now.toISOString().slice(0, 16);
    }
  }, []);

  function resetForm() {
    setTitle(''); setCoachNom(''); setCoachPrenom(''); setCoachEmail('');
    setDateTime(''); setCapacity(''); setImage(''); setImageFile(null); setDescription(''); setPrice('');
    setError('');
  }

  async function handleSubmit() {
    setError('');
    const payload = {
      title: title.trim(),
      coachFirstName: coachPrenom.trim(),
      coachLastName: coachNom.trim(),
      coachEmail: coachEmail.trim(),
      description: description.trim(),
      dateTime: dateTime,
      capacity: capacity,
      image: image,
      price: price
    };

    const result = window.Schemas.course.safeParse(payload);
    if (!result.success) {
      setError(window.formatZodError(result.error));
      return;
    }

    try {
      let finalImageUrl = result.data.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append('file', imageFile);
        const uploadRes = await fetch('/api/images/upload', {
          method: 'POST',
          body: fd,
          headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` }
        });
        if (!uploadRes.ok) throw new Error("Erreur lors du téléchargement de l'image");
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      const dbData = { 
        ...result.data,
        imageUrl: finalImageUrl,
        type: 'PILATES', 
        price: parseInt(result.data.price, 10) || 1500,
        instructorId: 1 
      };

      if (editingCourse) {
        await CoursesDB.update(editingCourse.id, dbData);
      } else {
        await CoursesDB.add(dbData);
      }
      resetForm();
      onSave(editingCourse ? 'Classe mise à jour avec succès ✓' : 'Classe ajoutée avec succès ✓');
    } catch (e) {
      setError(e.message || "Erreur lors de l'ajout.");
    }
  }

  const isEditing = !!editingCourse;

  return (
    <div className="admin-card" id="addCourseSection">
      <div className="admin-card-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <span className="admin-card-title">{isEditing ? 'Éditer une Classe' : 'Ajouter une Classe'}</span>
      </div>
      <div className="admin-card-body">
        <div className="admin-form-group">
          <label>Nom de la Classe</label>
          <input type="text" placeholder="ex. Reformer Flow Avancé" value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div className="form-row">
          <div className="admin-form-group">
            <label>Nom du Coach</label>
            <input type="text" placeholder="Benali" value={coachNom} onChange={e => setCoachNom(e.target.value)}/>
          </div>
          <div className="admin-form-group">
            <label>Prénom du Coach</label>
            <input type="text" placeholder="Amira" value={coachPrenom} onChange={e => setCoachPrenom(e.target.value)}/>
          </div>
          <div className="admin-form-group">
            <label>Email du Coach</label>
            <input type="email" placeholder="amira@souplesse.dz" value={coachEmail} onChange={e => setCoachEmail(e.target.value)}/>
          </div>
        </div>
        <div className="form-row">
          <div className="admin-form-group">
            <label>Date &amp; Heure</label>
            <input ref={dtRef} type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)}/>
          </div>
          <div className="admin-form-group">
            <label>Capacité (Places)</label>
            <input type="number" placeholder="8" min="1" max="50" value={capacity} onChange={e => setCapacity(e.target.value)}/>
          </div>
        </div>
        <div className="admin-form-group">
          <label>Image de la classe</label>
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files[0];
              if (file) {
                 setImageFile(file);
                 setImage(file.name);
              } else {
                 setImageFile(null);
                 setImage('');
              }
            }}/>
            {image && !imageFile && <span style={{fontSize: 12, color: 'var(--ocean)'}}>Image actuelle: {image}</span>}
          </div>
        </div>
        <div className="admin-form-group">
          <label>Description</label>
          <textarea placeholder="Décrivez le contenu de la séance, les objectifs…" value={description} onChange={e => setDescription(e.target.value)}/>
        </div>
        <div className="admin-form-group">
          <label>Prix (DA)</label>
          <input type="number" min="100" step="100" value={price} onChange={e => setPrice(e.target.value)}/>
          <small style={{ display: 'block', color: '#6d7a8a', fontSize: 12, marginTop: 2 }}>Laissez vide pour générer un prix temporaire aléatoire (1000–3000 DA).</small>
        </div>
        <p className="admin-form-error">{error}</p>
        <button className="admin-submit-btn" onClick={handleSubmit}>
          {isEditing ? 'Enregistrer les Modifications →' : 'Publier la Classe →'}
        </button>
        {isEditing && (
          <button className="admin-submit-btn" style={{ background: 'transparent', border: '1px solid var(--ocean)', color: 'var(--ocean)', marginTop: 8 }} onClick={() => { resetForm(); onCancel(); }}>
            Annuler l'édition
          </button>
        )}
      </div>
    </div>
  );
}
/* ── Courses Table Section ──────────────────────── */
function CoursesTable({ courses, onEdit, onDelete }) {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'date', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedCourses = React.useMemo(() => {
    let sortable = [...(courses || [])];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (sortConfig.key === 'date') {
          valA = a.date && a.time ? new Date(`${a.date}T${a.time}`) : new Date(0);
          valB = b.date && b.time ? new Date(`${b.date}T${b.time}`) : new Date(0);
        } else if (sortConfig.key === 'price') {
          valA = a.price || 0; valB = b.price || 0;
        } else if (sortConfig.key === 'title') {
          valA = a.title?.toLowerCase() || ''; valB = b.title?.toLowerCase() || '';
        } else if (sortConfig.key === 'capacity') {
          valA = a.capacity || 0; valB = b.capacity || 0;
        }
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [courses, sortConfig]);

  const filtered = sortedCourses.filter(c => {
    const term = search.toLowerCase();
    const matchesSearch = c.title?.toLowerCase().includes(term) || 
                          c.type?.toLowerCase().includes(term) ||
                          c.coachFirstName?.toLowerCase().includes(term) ||
                          c.coachLastName?.toLowerCase().includes(term);
    const matchesCat = category ? c.type === category : true;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const currentData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const isEmpty = !courses || courses.length === 0;

  return (
    <div className="admin-card" id="coursesSection" style={{ padding: 0 }}>
      {/* TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ui-btn ui-btn--ghost" style={{ fontSize: '13px', display: 'flex', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </button>
          <button className="ui-btn ui-btn--ghost" style={{ fontSize: '13px', display: 'flex', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Template
          </button>
        </div>
        <button className="ui-btn ui-btn--ghost" style={{ fontSize: '13px', display: 'flex', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          XLSX tools
        </button>
      </div>

      {/* SEARCH BAR */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <select className="ui-input" style={{ width: '160px', paddingLeft: '30px' }} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">Category</option>
            {Array.from(new Set(courses.map(c => c.type).filter(Boolean))).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <svg style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </div>
        
        <div style={{ position: 'relative' }}>
          <input type="text" className="ui-input" style={{ width: '250px', paddingLeft: '30px' }} placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <svg style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <div className="admin-card-body" style={{ padding: 0 }}>
        {isEmpty && (
          <div className="empty-state" style={{ display: 'flex', padding: '40px' }}>
            <p>Aucune classe créée.</p>
          </div>
        )}
        {!isEmpty && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>Classe {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('coachFirstName')} style={{ cursor: 'pointer' }}>Coach {sortConfig.key === 'coachFirstName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date &amp; Heure {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>Prix {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('capacity')} style={{ cursor: 'pointer' }}>Remplissage {sortConfig.key === 'capacity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Aucun résultat.</td></tr>
                ) : currentData.map(c => {
                  const spots = window.CoursesDB ? window.CoursesDB.spotsLeft(c) : (c.capacity - (c.reservedSpots || 0));
                  const dt = c.date && c.time ? new Date(`${c.date}T${c.time}`) : new Date();
                  const dateStr = dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
                  const timeStr = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
                  const isPast = dt < new Date();
                  const fillPct = Math.round(((c.reservedSpots || 0) / c.capacity) * 100);

                  return (
                    <tr key={c.id} className={isPast ? 'row--past' : ''}>
                      <td><div className="td-title">{c.title || c.description || c.type}</div></td>
                      <td><div className="td-coach">{c.coachFirstName || ''} {c.coachLastName || ''}</div></td>
                      <td><div>{dateStr}</div><div className="td-time">{timeStr}</div></td>
                      <td><div className="td-price">{c.price ? c.price.toLocaleString('fr-FR') + ' DA' : '—'}</div></td>
                      <td>
                        <div className="spots-bar"><div className="spots-fill" style={{ width: `${fillPct}%` }}></div></div>
                        <div className="spots-text">{c.reservedSpots || 0} / {c.capacity} {spots <= 0 && <span className="badge-full">Complet</span>}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="admin-btn-edit" onClick={() => onEdit(c)}>Éditer</button>
                          <button className="admin-btn-delete" onClick={() => onDelete(c)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* PAGINATION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button className="ui-btn ui-btn--ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 10px', fontSize: '13px' }}>&lt; Previous</button>
                <span style={{ padding: '6px 12px', fontWeight: 'bold' }}>Page {page} of {totalPages}</span>
                <button className="ui-btn ui-btn--ghost" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 10px', fontSize: '13px' }}>Next &gt;</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select className="ui-input" style={{ width: '60px', padding: '4px', fontSize: '13px' }} value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span style={{ color: '#888' }}>Rows per page</span>
              </div>

              <div style={{ color: '#888' }}>
                Showing {(page - 1) * rowsPerPage + 1}-{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} entries
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
/* ── Client Form Section ───────────────────────── */
function ClientForm({ courses, onSave }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [courseId, setCourseId] = React.useState('');
  const [error, setError] = React.useState('');

  async function handleSubmit() {
    setError('');

    const [firstName, ...lastNameParts] = name.trim().split(' ');
    const lastName = lastNameParts.length ? lastNameParts.join(' ') : ' ';

    const result = window.Schemas.client.safeParse({ firstName, lastName, email: email.trim() });
    
    if (!result.success) {
      setError(window.formatZodError(result.error));
      return;
    }
    if (!courseId) {
      setError("Veuillez choisir une classe.");
      return;
    }

    try {
      await ClientsDB.add({ ...result.data, courseId });
      setName(''); setEmail(''); setCourseId('');
      onSave('Client réservation ajoutée avec succès ✓');
    } catch (e) {
      setError(e.message || 'Erreur lors de la réservation');
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.8">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <span className="admin-card-title">Ajouter un Client</span>
      </div>
      <div className="admin-card-body">
        <div className="admin-form-group">
          <label>Nom Complet</label>
          <input type="text" placeholder="Sofia Amira" value={name} onChange={e => setName(e.target.value)}/>
        </div>
        <div className="admin-form-group">
          <label>Email</label>
          <input type="email" placeholder="sofia@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="admin-form-group">
          <label>Classe</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)}>
            <option value="">— Choisir une classe —</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title || c.description?.split('.')[0] || c.type} ({CoursesDB.spotsLeft(c)} places)
              </option>
            ))}
          </select>
        </div>
        <p className="admin-form-error">{error}</p>
        <button className="admin-submit-btn" onClick={handleSubmit}>
          Enregistrer le Client →
        </button>
      </div>
    </div>
  );
}
/* ── Clients Table Section ──────────────────────── */
function ClientsTable({ clients, onEdit, onDelete }) {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'bookedAt', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedClients = React.useMemo(() => {
    let sortable = [...(clients || [])];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (sortConfig.key === 'firstName') {
          valA = (a.firstName || '').toLowerCase(); valB = (b.firstName || '').toLowerCase();
        } else if (sortConfig.key === 'email') {
          valA = (a.email || '').toLowerCase(); valB = (b.email || '').toLowerCase();
        } else if (sortConfig.key === 'bookedAt') {
          valA = new Date(a.bookedAt || 0); valB = new Date(b.bookedAt || 0);
        }
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [clients, sortConfig]);

  const filtered = sortedClients.filter(cl => {
    const term = search.toLowerCase();
    const fullName = `${cl.firstName || ''} ${cl.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(term) || (cl.email || '').toLowerCase().includes(term);
    const matchesCat = category ? cl.courseType === category : true;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const currentData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const isEmpty = !clients || clients.length === 0;

  return (
    <div className="admin-card" style={{ padding: 0 }}>
      {/* TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ui-btn ui-btn--ghost" style={{ fontSize: '13px', display: 'flex', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </button>
          <button className="ui-btn ui-btn--ghost" style={{ fontSize: '13px', display: 'flex', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Template
          </button>
        </div>
        <button className="ui-btn ui-btn--ghost" style={{ fontSize: '13px', display: 'flex', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          XLSX tools
        </button>
      </div>

      {/* SEARCH BAR */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <select className="ui-input" style={{ width: '160px', paddingLeft: '30px' }} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">Category</option>
            {Array.from(new Set(clients.map(c => c.courseType).filter(Boolean))).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <svg style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </div>
        <div style={{ position: 'relative' }}>
          <input type="text" className="ui-input" style={{ width: '250px', paddingLeft: '30px' }} placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <svg style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <div className="admin-card-body" style={{ padding: 0 }}>
        {isEmpty && (
          <div className="empty-state" style={{ display: 'flex', padding: '40px' }}>
            <p>Aucun client enregistré.</p>
          </div>
        )}
        {!isEmpty && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>Nom {sortConfig.key === 'firstName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('courseType')} style={{ cursor: 'pointer' }}>Classe {sortConfig.key === 'courseType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('bookedAt')} style={{ cursor: 'pointer' }}>Date {sortConfig.key === 'bookedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Aucun résultat.</td></tr>
                ) : currentData.map(cl => (
                  <tr key={cl.id}>
                    <td><div className="td-title">{cl.firstName} {cl.lastName}</div></td>
                    <td><div className="td-email">{cl.email}</div></td>
                    <td><div className="td-coach">{cl.courseType || 'Classe #' + cl.courseId}</div></td>
                    <td><div className="td-time">{cl.bookedAt ? new Date(cl.bookedAt).toLocaleDateString('fr-FR') : '—'}</div></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {onEdit && <button className="admin-btn-edit" onClick={() => onEdit(cl)}>Éditer</button>}
                        <button className="admin-btn-delete" onClick={() => onDelete(cl)}>Retirer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* PAGINATION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button className="ui-btn ui-btn--ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 10px', fontSize: '13px' }}>&lt; Previous</button>
                <span style={{ padding: '6px 12px', fontWeight: 'bold' }}>Page {page} of {totalPages}</span>
                <button className="ui-btn ui-btn--ghost" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 10px', fontSize: '13px' }}>Next &gt;</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select className="ui-input" style={{ width: '60px', padding: '4px', fontSize: '13px' }} value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span style={{ color: '#888' }}>Rows per page</span>
              </div>

              <div style={{ color: '#888' }}>
                Showing {(page - 1) * rowsPerPage + 1}-{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} entries
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Content Management ────────────────────────── */
function ContentAdmin() {
  const [activeTab, setActiveTab] = React.useState('studio');
  
  return (
    <div style={{ width: '100%' }}>
      <div className="tab-bar" style={{ marginBottom: 24 }}>
        <button className={activeTab === 'studio' ? 'active' : ''} onClick={() => setActiveTab('studio')}>Images Studio</button>
        <button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>Galerie</button>
        <button className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>Témoignages</button>
      </div>

      {activeTab === 'studio' && <StudioImageAdmin />}
      {activeTab === 'gallery' && <GalleryAdmin />}
      {activeTab === 'testimonials' && <TestimonialAdmin />}
    </div>
  );
}

function StudioImageAdmin() {
  const [images, setImages] = React.useState([]);
  const [file, setFile] = React.useState(null);

  const load = async () => setImages(await ContentDB.getStudioImages());
  React.useEffect(() => { load(); }, []);

  const handleUpload = async () => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/images/upload', { method: 'POST', body: fd, headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` } });
      const { url } = await res.json();
      await api.post('/api/content/studio-images', { imageUrl: url, displayOrder: images.length + 1 });
      setFile(null);
      load();
      window.useToastStore.getState().showToast('Image ajoutée');
    } catch (e) { alert("Erreur d'upload"); }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer l'image ?")) {
      await api.delete(`/api/content/studio-images/${id}`);
      load();
      window.useToastStore.getState().showToast('Image supprimée');
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header"><span className="admin-card-title">Images du Studio</span></div>
      <div className="admin-card-body">
        <div style={{ display:'flex', gap:10, marginBottom: 20 }}>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <button className="btn-primary" onClick={handleUpload}>Ajouter</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
          {images.map(img => (
            <div key={img.id} style={{ position: 'relative' }}>
              <img src={img.imageUrl} style={{ width:'100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
              <button onClick={() => handleDelete(img.id)} style={{ position:'absolute', top: 5, right: 5, background:'red', color:'white', border:'none', borderRadius:4, cursor:'pointer' }}>x</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryAdmin() {
  const [items, setItems] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [caption, setCaption] = React.useState('');

  const load = async () => setItems(await ContentDB.getGallery());
  React.useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!file || !caption) return alert("Fichier et légende requis");
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/images/upload', { method: 'POST', body: fd, headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` } });
      const { url } = await res.json();
      await api.post('/api/content/gallery', { imageUrl: url, caption, displayOrder: items.length + 1 });
      setFile(null); setCaption('');
      load();
      window.useToastStore.getState().showToast('Image ajoutée à la galerie');
    } catch (e) { alert("Erreur"); }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer l'élément ?")) {
      await api.delete(`/api/content/gallery/${id}`);
      load();
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header"><span className="admin-card-title">Galerie Communauté</span></div>
      <div className="admin-card-body">
        <div style={{ display:'flex', flexWrap: 'wrap', gap:10, marginBottom: 20 }}>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <input type="text" placeholder="Légende" value={caption} onChange={e=>setCaption(e.target.value)} style={{flex: 1, padding: 8, border:'1px solid #ccc', borderRadius:4}} />
          <button className="btn-primary" onClick={handleAdd}>Ajouter</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {items.map(item => (
            <div key={item.id} style={{ border: '1px solid #eee', padding: 8, borderRadius: 8 }}>
              <img src={item.imageUrl} style={{ width:'100%', height: 140, objectFit: 'cover', borderRadius: 4 }} />
              <p style={{ margin: '8px 0', fontSize: 13, fontWeight: 'bold' }}>{item.caption}</p>
              <button onClick={() => handleDelete(item.id)} style={{ padding: '4px 8px', background:'var(--rust)', color:'white', border:'none', borderRadius:4, cursor:'pointer' }}>Supprimer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialAdmin() {
  const [items, setItems] = React.useState([]);
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('');
  const [text, setText] = React.useState('');

  const load = async () => setItems(await ContentDB.getTestimonials());
  React.useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name || !text) return alert("Le nom et le texte sont requis");
    try {
      await api.post('/api/content/testimonials', { name, role, text, displayOrder: items.length + 1 });
      setName(''); setRole(''); setText('');
      load();
      window.useToastStore.getState().showToast('Témoignage ajouté');
    } catch (e) { alert("Erreur"); }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce témoignage ?")) {
      await api.delete(`/api/content/testimonials/${id}`);
      load();
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header"><span className="admin-card-title">Témoignages</span></div>
      <div className="admin-card-body">
        <div style={{ display:'flex', flexDirection: 'column', gap:10, marginBottom: 20 }}>
          <div style={{ display:'flex', gap: 10 }}>
            <input type="text" placeholder="Nom complet (ex: Amira B.)" value={name} onChange={e=>setName(e.target.value)} style={{flex: 1, padding: 8, border:'1px solid #ccc', borderRadius:4}} />
            <input type="text" placeholder="Rôle/Statut (ex: Membre fondatrice)" value={role} onChange={e=>setRole(e.target.value)} style={{flex: 1, padding: 8, border:'1px solid #ccc', borderRadius:4}} />
          </div>
          <textarea placeholder="Leur témoignage..." value={text} onChange={e=>setText(e.target.value)} rows="3" style={{padding: 8, border:'1px solid #ccc', borderRadius:4, fontFamily: 'inherit'}}></textarea>
          <button className="btn-primary" onClick={handleAdd} style={{ alignSelf: 'flex-start' }}>Ajouter le Témoignage</button>
        </div>
        <div>
          {items.map(item => (
            <div key={item.id} style={{ borderBottom: '1px solid #eee', padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{item.name} <span style={{fontWeight:'normal', color:'#666', fontSize: 13}}>({item.role})</span></p>
                <p style={{ margin: 0, fontSize: 14, fontStyle: 'italic', color: '#444' }}>"{item.text}"</p>
              </div>
              <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 12px', background:'var(--rust)', color:'white', border:'none', borderRadius:4, cursor:'pointer', minWidth: 80 }}>Supprimer</button>
            </div>
          ))}
          {items.length === 0 && <p style={{ fontStyle: 'italic', color: '#888' }}>Aucun témoignage enregistré.</p>}
        </div>
      </div>
    </div>
  );
}

/* ── Analytics & Logs Restored ─────────────────── */
function AdminStats({ courses, clients }) {
  const [logCount, setLogCount] = React.useState(0);
  
  React.useEffect(() => {
    fetch('/api/admin/logs')
      .then(r => r.json())
      .then(data => setLogCount(Array.isArray(data) ? data.length : (data._embedded?.adminLogs?.length || data.content?.length || 0)))
      .catch(() => {});
  }, []);

  const now = new Date();
  const active = (courses || []).filter(c => {
    const dt = c.date && c.time ? new Date(`${c.date}T${c.time}`) : new Date();
    return dt > now;
  });
  const booked = (courses || []).reduce((s, c) => s + (c.reservedSpots || 0), 0);

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-card-label">Classes Actives</div>
        <div className="stat-card-value">{active.length}</div>
        <div className="stat-card-sub">à venir</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Réservations Totales</div>
        <div className="stat-card-value">{booked}</div>
        <div className="stat-card-sub">toutes classes</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-label">Clients Enregistrés</div>
        <div className="stat-card-value">{clients ? clients.length : 0}</div>
        <div className="stat-card-sub">dans le système</div>
      </div>
      <div className="stat-card" style={{ background: 'var(--ocean)', color: 'white' }}>
        <div className="stat-card-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Logs Serveur</div>
        <div className="stat-card-value">{logCount}</div>
        <div className="stat-card-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>actions CUD</div>
      </div>
    </div>
  );
}

function AdminCharts({ courses }) {
  const { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } = window.Recharts;
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json())
      .then(d => setData(d)).catch(e => console.error(e));
  }, []);

  if (!data) return <div className="admin-card" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rust)' }}>Chargement des statistiques...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      <div className="admin-card">
        <div className="admin-card-header">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.8">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span className="admin-card-title">Évolution des Réservations (7 Jours)</span>
        </div>
        <div className="admin-card-body" style={{ padding: '24px 16px 16px 0', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)"/>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10}/>
              <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12, fill: '#888'}} dx={-10}/>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} cursor={{stroke: 'rgba(0,0,0,0.05)'}}/>
              <Area type="monotone" dataKey="reservations" stroke="var(--ocean)" fill="var(--ocean)" fillOpacity={0.1} strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.8">
            <path d="M12 20V10M18 20V4M6 20v-4"/>
          </svg>
          <span className="admin-card-title">Remplissage par Classe (Top 5)</span>
        </div>
        <div className="admin-card-body" style={{ padding: '24px 16px 16px 0', height: 280 }}>
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.courseCapacities}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)"/>
              <XAxis dataKey="title" tickLine={false} axisLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10}/>
              <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12, fill: '#888'}} dx={-10}/>
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}/>
              <Bar dataKey="capacity" fill="rgba(0,0,0,0.05)" radius={[4,4,0,0]} name="Capacité Totale"/>
              <Bar dataKey="reserved" fill="var(--ocean)" radius={[4,4,0,0]} name="Places Occupées"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AdminActivityLogs() {
  const [logs, setLogs] = React.useState([]);
  
  React.useEffect(() => {
    const fetchLogs = () => {
      fetch('/api/admin/logs')
        .then(r => r.json())
        .then(data => setLogs(Array.isArray(data) ? data : (data._embedded?.adminLogs || data.content || [])))
        .catch(() => setLogs([]));
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (action) => {
    switch(action) {
      case 'RESERVATION': return 'var(--rust)';
      case 'CREATE': return 'var(--moss)';
      case 'UPDATE': return '#eab308';
      case 'DELETE': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="admin-card" style={{ marginBottom: 32 }}>
      <div className="admin-card-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.8">
          <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
        <span className="admin-card-title">Journaux et Activités Système</span>
      </div>
      <div className="admin-card-body" style={{ padding: 0 }}>
        {logs.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px' }}><p>Aucune activité récente.</p></div>
        ) : (
          <div className="admin-table-wrap" style={{ maxHeight: 350, overflowY: 'auto' }}>
            <table className="admin-table">
              <tbody>
                {logs.map(l => (
                  <tr key={l.id}>
                    <td style={{ width: 90, color: '#888', fontSize: '13px' }}>{new Date(l.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</td>
                    <td style={{ width: 140 }}>
                      <span style={{ color: getColor(l.action), background: 'rgba(0,0,0,0.03)', padding: '4px 8px', borderRadius: 4, fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' }}>
                        {l.action}
                      </span>
                    </td>
                    <td style={{ fontWeight: '500', color: 'var(--ink)' }}>{l.entityName} #{l.entityId}</td>
                    <td style={{ color: '#666', fontSize: '14px' }}>{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

window.AdminStats = AdminStats;
window.AdminCharts = AdminCharts;
window.AdminActivityLogs = AdminActivityLogs;
window.CourseForm = CourseForm;
window.ClientForm = ClientForm;
window.CoursesTable = CoursesTable;
window.ClientsTable = ClientsTable;
window.ContentAdmin = ContentAdmin;
// EOF
