/* ── Admin Stats Section ───────────────────────── */
function AdminStats({ courses, clients }) {
  const [logCount, setLogCount] = React.useState(0);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const resp = await fetch('/api/admin/logs', {
          headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` }
        });
        if (resp.ok) {
          const data = await resp.json();
          setLogCount(data.length);
        }
      } catch (e) {
        console.error("Failed to fetch logs count", e);
      }
    };
    fetchLogs();
    const iv = setInterval(fetchLogs, 30000);
    return () => clearInterval(iv);
  }, []);

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
      <div className="stat-card">
        <div className="stat-card-label">Actions Système</div>
        <div className="stat-card-value">{logCount}</div>
        <div className="stat-card-sub">historique</div>
      </div>
    </div>
  );
}

/* ── Admin Charts Section ───────────────────────── */
function AdminCharts() {
  const [analytics, setAnalytics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const resp = await fetch('/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` }
        });
        if (!resp.ok) throw new Error('Erreur ' + resp.status);
        setAnalytics(await resp.json());
        setFetchError(null);
      } catch (e) {
        setFetchError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    const iv = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(iv);
  }, []);

  if (typeof Recharts === 'undefined') return null;
  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } = Recharts;

  const noData = (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ocean)', opacity: 0.5, fontSize: 13 }}>
      Aucune donnée disponible
    </div>
  );

  if (loading) {
    return (
      <div className="admin-layout" style={{ marginTop: 24 }}>
        {[1,2].map(i => (
          <div key={i} className="admin-card">
            <div className="admin-card-header"><span className="admin-card-title">Chargement...</span></div>
            <div className="admin-card-body" style={{ height: 300 }}>{noData}</div>
          </div>
        ))}
      </div>
    );
  }

  const reservationsByDay = analytics ? analytics.reservationsByDay || [] : [];
  const courseCapacity    = analytics ? analytics.courseCapacity    || [] : [];
  const hasArea = reservationsByDay.some(d => d.val > 0);
  const hasBar  = courseCapacity.length > 0;

  return (
    <div className="admin-layout" style={{ marginTop: 24 }}>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Réservations par Jour</span>
          <span style={{ fontSize: 11, color: 'var(--ocean)', opacity: 0.6 }}>données réelles</span>
        </div>
        <div className="admin-card-body" style={{ height: 300, padding: '20px 0' }}>
          {!hasArea ? noData : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reservationsByDay}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--ocean)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--ocean)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(44,74,90,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--ocean)'}} dy={10} />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--deep)', border: 'none', borderRadius: 4, color: 'white' }}
                  itemStyle={{ color: 'var(--sand)' }}
                  formatter={v => [v + ' réservation(s)', '']}
                />
                <Area type="monotone" dataKey="val" name="Réservations" stroke="var(--ocean)" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Capacité vs Réservé</span>
          <span style={{ fontSize: 11, color: 'var(--ocean)', opacity: 0.6 }}>données réelles</span>
        </div>
        <div className="admin-card-body" style={{ height: 300, padding: '20px 0' }}>
          {!hasBar ? noData : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseCapacity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(44,74,90,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: 'var(--ocean)'}} dy={10} />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  cursor={{fill: 'rgba(107,158,175,0.05)'}}
                  contentStyle={{ background: 'var(--deep)', border: 'none', borderRadius: 4, color: 'white' }}
                  formatter={(v, name) => [v, name === 'reserved' ? 'Réservé' : 'Disponible']}
                />
                <Bar dataKey="reserved"  stackId="a" fill="var(--ocean)" name="Réservé"    radius={[0,0,0,0]} />
                <Bar dataKey="remaining" stackId="a" fill="var(--sand)"  name="Disponible" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Log Archive Dialog ──────────────────────────── */
function LogArchiveDialog({ onClose }) {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    const fetchArchive = async () => {
      try {
        const resp = await fetch('/api/admin/logs/archive', {
          headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` }
        });
        if (resp.ok) {
          const data = await resp.json();
          setLogs(data);
        }
      } catch (e) {
        console.error("Failed to fetch archive:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.message.toLowerCase().includes(filter.toLowerCase()) ||
    l.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="ui-modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 25, 47, 0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '40px'
    }}>
      <div className="admin-card" style={{ 
        width: '100%', maxWidth: '900px', maxHeight: '85vh', 
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="admin-card-header" style={{ 
          background: 'var(--deep)', borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'space-between', padding: '20px 28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
            </svg>
            <span className="admin-card-title" style={{ color: 'white' }}>Archives des Activités Système</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div style={{ padding: '16px 28px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <input 
            type="text" 
            placeholder="Rechercher dans les archives (ex: DELETE, Réservation...)" 
            className="ui-input" 
            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: '#0a192f', padding: '20px 28px' }}>
          {loading ? (
            <div style={{ color: 'var(--sand)', opacity: 0.5, textAlign: 'center', padding: 40 }}>Chargement des archives...</div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ color: 'var(--sand)', opacity: 0.5, textAlign: 'center', padding: 40 }}>Aucune correspondance trouvée.</div>
          ) : (
            filteredLogs.map((log, i) => (
              <div key={i} style={{ 
                marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.03)',
                fontFamily: 'monospace', fontSize: 13, display: 'flex', gap: 16 
              }}>
                <span style={{ color: 'rgba(255,255,255,0.2)', minWidth: 140 }}>[{log.timestamp}]</span>
                <span style={{ color: 'var(--gold)', minWidth: 80, fontWeight: 'bold' }}>{log.type}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{log.message}</span>
              </div>
            ))
          )}
        </div>
        
        <div style={{ padding: '16px 28px', background: 'var(--deep)', textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          {filteredLogs.length} entrées affichées
        </div>
      </div>
    </div>
  );
}

/* ── Admin Activity Logs ────────────────────────── */
function AdminActivityLogs() {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showArchive, setShowArchive] = React.useState(false);

  const fetchLogs = async () => {
    try {
      const resp = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLogColor = (type) => {
    switch (type) {
      case 'INFO': return 'var(--ocean)';
      case 'RESERVATION': return 'var(--gold)';
      case 'AUTH': return 'var(--ocean)';
      case 'SYSTEM': return '#9f7aea';
      case 'UPDATE': return 'var(--gold)';
      case 'DELETE': return '#f56565';
      default: return 'var(--cream)';
    }
  };

  return (
    <>
      <div className="admin-card" style={{ marginTop: 24, padding: 0, overflow: 'hidden' }}>
        <div className="admin-card-header" style={{ 
          background: 'var(--deep)', borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'space-between', width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }}></div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }}></div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }}></div>
            <span className="admin-card-title" style={{ color: 'white', marginLeft: 10 }}>Console — Server Activity Logs</span>
          </div>
          <button 
            onClick={() => setShowArchive(true)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
              color: 'white', fontSize: 10, padding: '4px 10px', borderRadius: 2, cursor: 'pointer',
              letterSpacing: '1px', textTransform: 'uppercase'
            }}
          >
            Archives
          </button>
        </div>
      <div className="admin-console" style={{ maxHeight: 300, overflowY: 'auto', background: '#0a192f', padding: '12px 16px' }}>
        {loading && logs.length === 0 ? (
          <div className="log-line" style={{ color: 'var(--sand)', opacity: 0.6 }}>Synchronisation en cours...</div>
        ) : logs.length === 0 ? (
          <div className="log-line" style={{ color: 'var(--sand)', opacity: 0.6 }}>Aucune activité détectée.</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="log-line" style={{ marginBottom: 4, fontFamily: 'monospace', fontSize: 13, display: 'flex', gap: 12 }}>
              <span className="log-time" style={{ color: 'rgba(255,255,255,0.3)', minWidth: 70 }}>[{log.timestamp}]</span>
              <span className="log-type" style={{ color: getLogColor(log.type), minWidth: 80, fontWeight: 'bold' }}>{log.type}</span>
              <span className="log-msg" style={{ color: 'rgba(255,255,255,0.8)' }}>{log.message}</span>
            </div>
          ))
        )}
        </div>
      </div>
      {showArchive && <LogArchiveDialog onClose={() => setShowArchive(false)} />}
    </>
  );
}
/* ── Course Form Section ───────────────────────── */
function CourseForm({ editingCourse, onSave, onCancel }) {
  const [title, setTitle] = React.useState('');
  const [instructorId, setInstructorId] = React.useState('');
  const [dateTime, setDateTime] = React.useState('');
  const [capacity, setCapacity] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageFile, setImageFile] = React.useState(null);
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [error, setError] = React.useState('');
  const dtRef = React.useRef(null);
  
  const [instructors, setInstructors] = React.useState([]);

  React.useEffect(() => {
    async function fetchInstructors() {
      try {
        const data = await InstructorsDB.getAll();
        if (data && Array.isArray(data)) {
            setInstructors(data);
        }
      } catch (e) {
        console.error("Failed to load instructors", e);
      }
    }
    fetchInstructors();
  }, []);

  // Populate form when editing
  React.useEffect(() => {
    if (editingCourse) {
      setTitle(editingCourse.title || editingCourse.description || '');
      setInstructorId(editingCourse.instructor ? String(editingCourse.instructor.id) : '');
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
    setTitle(''); setInstructorId('');
    setDateTime(''); setCapacity(''); setImage(''); setImageFile(null); setDescription(''); setPrice('');
    setError('');
  }

  async function handleSubmit() {
    setError('');
    
    // Quick validation overrides for Zod schema
    const payload = {
      title: title.trim(),
      coachFirstName: 'Coach',
      coachLastName: 'Name',
      coachEmail: 'coach@example.com',
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
    
    if (!instructorId) {
        setError('Le choix de l\'instructeur est requis.');
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
        instructorId: Number(instructorId)
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
    <div className="admin-form-grid" style={{ display: 'grid', gap: '20px' }}>
      <Input label="Nom de la Classe" placeholder="ex. Reformer Flow Avancé" value={title} onChange={e => setTitle(e.target.value)} error={error.title}/>
      
      <FormGroup label="Instructeur">
        <select className="ui-input" value={instructorId} onChange={e => setInstructorId(e.target.value)}>
            <option value="">-- Sélectionner un instructeur --</option>
            {instructors.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.firstName} {inst.lastName}</option>
            ))}
        </select>
      </FormGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormGroup label="Date & Heure">
          <input ref={dtRef} type="datetime-local" className="ui-input" value={dateTime} onChange={e => setDateTime(e.target.value)}/>
        </FormGroup>
        <Input label="Capacité" type="number" placeholder="12" value={capacity} onChange={e => setCapacity(e.target.value)}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Prix (DA)" type="number" placeholder="1500" value={price} onChange={e => setPrice(e.target.value)}/>
        <FormGroup label="Image de Couverture">
          <input type="file" accept="image/*" className="ui-input" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '8px' }}/>
        </FormGroup>
      </div>

      <FormGroup label="Description">
        <textarea className="ui-input" rows="3" placeholder="Informations sur la séance..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
      </FormGroup>

      {error && <p className="ui-form-error">{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <Button variant="ghost" onClick={onCancel}>Annuler</Button>
        <Button variant="primary" onClick={handleSubmit}>{isEditing ? 'Mettre à jour' : 'Publier la Classe'}</Button>
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
                          <button className="admin-btn-delete" onClick={() => onDelete(c)}>
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
function ClientForm({ courses, onSave, onCancel }) {
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
    <div style={{ display: 'grid', gap: '20px' }}>
      <Input label="Nom Complet" placeholder="Sofia Amira" value={name} onChange={e => setName(e.target.value)}/>
      <Input label="Adresse Email" type="email" placeholder="sofia@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
      
      <Select 
        label="Sélectionner la Classe"
        value={courseId} 
        onChange={e => setCourseId(e.target.value)}
        placeholder="— Choisir une séance —"
        options={courses.map(c => ({
          value: c.id,
          label: `${c.title || c.type} (${CoursesDB.spotsLeft(c)} places)`
        }))}
      />

      {error && <p className="ui-form-error" style={{ margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <Button variant="ghost" onClick={onCancel}>Annuler</Button>
        <Button variant="primary" onClick={handleSubmit}>Confirmer la Réservation</Button>
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
                      <button className="admin-btn-delete" onClick={() => onDelete(cl)}>
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
