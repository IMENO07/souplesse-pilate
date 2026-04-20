/* ── Admin Stats Section ───────────────────────── */
function AdminStats({ courses, clients }) {
  const now = new Date();
  const active = courses.filter(c => {
    const dt = c.date && c.time ? new Date(`${c.date}T${c.time}`) : new Date();
    return dt > now;
  });
  const booked = courses.reduce((s, c) => s + (c.reservedSpots || 0), 0);

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
        <div className="stat-card-value">{clients.length}</div>
        <div className="stat-card-sub">dans le système</div>
      </div>
    </div>
  );
}
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
  const isEmpty = !courses || courses.length === 0;

  return (
    <div className="admin-card" id="coursesSection">
      <div className="admin-card-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.8">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
        </svg>
        <span className="admin-card-title">Toutes les Classes</span>
      </div>
      <div className="admin-card-body" style={{ padding: 0 }}>
        {isEmpty && (
          <div className="empty-state" style={{ display: 'flex' }}>
            <div className="empty-state-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p>Aucune classe créée.<br/>Ajoutez votre première séance.</p>
          </div>
        )}
        {!isEmpty && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Classe</th>
                  <th>Coach</th>
                  <th>Date &amp; Heure</th>
                  <th>Prix</th>
                  <th>Remplissage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => {
                  const spots = CoursesDB.spotsLeft(c);
                  const dt = c.date && c.time ? new Date(`${c.date}T${c.time}`) : new Date();
                  const dateStr = dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
                  const timeStr = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
                  const isPast = dt < new Date();
                  const fillPct = Math.round(((c.reservedSpots || 0) / c.capacity) * 100);

                  return (
                    <tr key={c.id} className={isPast ? 'row--past' : ''}>
                      <td><div className="td-title">{c.title || c.description || c.type}</div></td>
                      <td><div className="td-coach">{c.coachFirstName || 'Instructeur'} {c.coachLastName || ''}</div></td>
                      <td><div>{dateStr}</div><div className="td-time">{timeStr}</div></td>
                      <td><div className="td-price">{c.price ? c.price.toLocaleString('fr-FR') + ' DA' : '—'}</div></td>
                      <td>
                        <div className="spots-bar"><div className="spots-fill" style={{ width: `${fillPct}%` }}></div></div>
                        <div className="spots-text">{c.reservedSpots || 0} / {c.capacity} {spots <= 0 && <span className="badge-full">Complet</span>}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="admin-btn-edit" onClick={() => onEdit(c)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Éditer
                          </button>
                          <button className="admin-btn-delete" onClick={() => onDelete(c.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
function ClientsTable({ clients, onDelete }) {
  const isEmpty = !clients || clients.length === 0;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span className="admin-card-title">Clients &amp; Réservations</span>
      </div>
      <div className="admin-card-body" style={{ padding: 0 }}>
        {isEmpty && (
          <div className="empty-state" style={{ display: 'flex' }}>
            <div className="empty-state-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <p>Aucun client enregistré.</p>
          </div>
        )}
        {!isEmpty && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Classe</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(cl => (
                  <tr key={cl.id}>
                    <td><div className="td-title">{cl.firstName} {cl.lastName}</div></td>
                    <td><div className="td-email">{cl.email}</div></td>
                    <td><div className="td-coach">{cl.courseType || 'Classe #' + cl.courseId}</div></td>
                    <td><div className="td-time">{cl.bookedAt ? new Date(cl.bookedAt).toLocaleDateString('fr-FR') : '—'}</div></td>
                    <td>
                      <button className="admin-btn-delete" onClick={() => onDelete(cl.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                        Retirer
                      </button>
                    </td>
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
