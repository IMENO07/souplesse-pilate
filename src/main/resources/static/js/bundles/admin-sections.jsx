/* ── Admin Stats Section ───────────────────────── */
function AdminStats({ courses, clients, loading }) {
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

  if (loading) {
    return (
      <div className="stats-row">
        {[1,2,3,4].map(i => (
          <div key={i} className="stat-card ui-skeleton" style={{ height: '100px', border: 'none' }}></div>
        ))}
      </div>
    );
  }

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
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;

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
    l.message.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase()) ||
    l.timestamp.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage) || 1;
  const currentData = filteredLogs.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleExport = () => {
    if (!window.XLSX) return;
    const ws = XLSX.utils.json_to_sheet(filteredLogs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs Archive");
    XLSX.writeFile(wb, `souplesse_logs_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="ui-modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '40px'
    }}>
      <div className="admin-card" style={{ 
        width: '100%', maxWidth: '1000px', maxHeight: '90vh', 
        display: 'flex', flexDirection: 'column', background: 'white'
      }}>
        <div className="admin-card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="2">
              <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
            </svg>
            <span className="admin-card-title">Archive Complète des Activités</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ocean)', cursor: 'pointer', opacity: 0.5 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              placeholder="Rechercher un log..." 
              className="ui-input" 
              style={{ paddingLeft: '32px' }}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            <svg style={{ position: 'absolute', left: 10, top: 12, color: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <button className="ui-btn ui-btn--ghost" onClick={handleExport} style={{ fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter XLSX
          </button>
        </div>

        <div className="admin-table-wrap" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Horodatage</th>
                <th style={{ width: '120px' }}>Type</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '100px', color: '#888' }}>Chargement des données...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '100px', color: '#888' }}>Aucun log trouvé.</td></tr>
              ) : (
                currentData.map((log, i) => (
                  <tr key={i}>
                    <td><div className="td-time">{log.timestamp}</div></td>
                    <td>
                      <span style={{ 
                        fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.5px',
                        padding: '4px 8px', borderRadius: '4px',
                        background: log.type === 'DELETE' ? '#FEE2E2' : log.type === 'UPDATE' ? '#FEF3C7' : '#E0F2FE',
                        color: log.type === 'DELETE' ? '#EF4444' : log.type === 'UPDATE' ? '#D97706' : '#0284C7'
                      }}>
                        {log.type}
                      </span>
                    </td>
                    <td><div className="td-title" style={{ fontWeight: 'normal', fontSize: '13px' }}>{log.message}</div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Affichage de {((page-1) * rowsPerPage) + 1} à {Math.min(page * rowsPerPage, filteredLogs.length)} sur {filteredLogs.length} logs
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="ui-btn ui-btn--ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 12px', fontSize: '12px' }}>Précédent</button>
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Page {page} / {totalPages}</span>
            <button className="ui-btn ui-btn--ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 12px', fontSize: '12px' }}>Suivant</button>
          </div>
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
    
    // Find selected instructor details
    const selectedInst = instructors.find(i => String(i.id) === String(instructorId));
    
    // Quick validation overrides for Zod schema
    const payload = {
      title: title.trim(),
      coachFirstName: selectedInst ? selectedInst.firstName : 'Coach',
      coachLastName: selectedInst ? selectedInst.lastName : 'Name',
      coachEmail: selectedInst ? selectedInst.email : 'coach@example.com',
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
function CoursesTable({ courses, loading, onEdit, onDelete }) {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'date', direction: 'desc' });
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const courseImportRef = React.useRef(null);

  // Reset selection when data or filters change
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [courses, search, category]);

  const toggleSelectAll = (filteredData) => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(c => c.id)));
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

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
      {/* ACTION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' }}>
        <input 
          type="file" 
          ref={courseImportRef} 
          style={{ display: 'none' }} 
          accept=".xlsx,.xls,.csv" 
          onChange={(e) => {
            if (e.target.files?.[0]) {
              window.CoursesDB.importFromXLSX(e.target.files[0]).then(() => window.location.reload());
            }
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ui-btn ui-btn--ghost" onClick={() => courseImportRef.current.click()} style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </button>
          <button className="ui-btn ui-btn--ghost" onClick={() => window.CoursesDB.downloadTemplate()} style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Template
          </button>
        </div>
        <button className="ui-btn ui-btn--ghost" 
          onClick={() => {
            const dataToExport = selectedIds.size > 0 
              ? filtered.filter(f => selectedIds.has(f.id))
              : filtered;
            window.CoursesDB.exportToXLSX(dataToExport);
          }} 
          style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center', color: selectedIds.size > 0 ? 'var(--ocean)' : 'inherit' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          {selectedIds.size > 0 ? `Export (${selectedIds.size})` : 'XLSX Export'}
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
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      onChange={() => toggleSelectAll(filtered)}
                    />
                  </th>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>Classe {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('coachFirstName')} style={{ cursor: 'pointer' }}>Coach {sortConfig.key === 'coachFirstName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date &amp; Heure {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>Prix {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('capacity')} style={{ cursor: 'pointer' }}>Remplissage {sortConfig.key === 'capacity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    [1,2,3,4,5].map(i => (
                        <tr key={i}>
                            <td><div className="ui-skeleton" style={{ width: 16, height: 16 }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '80%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '60%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '40%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '30%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '50%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '70px' }}></div></td>
                        </tr>
                    ))
                ) : currentData.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Aucun résultat.</td></tr>
                ) : currentData.map(c => {
                  const spots = CoursesDB.spotsLeft(c);
                  const dt = c.date && c.time ? new Date(`${c.date}T${c.time}`) : new Date();
                  const dateStr = dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
                  const timeStr = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
                  const isPast = dt < new Date();
                  const fillPct = Math.round(((c.reservedSpots || 0) / c.capacity) * 100);

                  return (
                    <tr key={c.id} className={`${isPast ? 'row--past' : ''} ${selectedIds.has(c.id) ? 'row-selected' : ''}`}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(c.id)}
                          onChange={() => toggleSelect(c.id)}
                        />
                      </td>
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
function ClientsTable({ clients, loading, onEdit, onDelete }) {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({ key: 'bookedAt', direction: 'desc' });
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const clientImportRef = React.useRef(null);

  // Reset selection when data or filters change
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [clients, search, category]);

  const toggleSelectAll = (filteredData) => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(c => c.id)));
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

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
      {/* ACTION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' }}>
        <input 
          type="file" 
          ref={clientImportRef} 
          style={{ display: 'none' }} 
          accept=".xlsx,.xls,.csv" 
          onChange={(e) => {
            if (e.target.files?.[0]) {
              window.ClientsDB.importFromXLSX(e.target.files[0]).then(() => window.location.reload());
            }
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ui-btn ui-btn--ghost" onClick={() => clientImportRef.current.click()} style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </button>
          <button className="ui-btn ui-btn--ghost" onClick={() => window.ClientsDB.downloadTemplate()} style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Template
          </button>
        </div>
        <button className="ui-btn ui-btn--ghost" 
          onClick={() => {
            const dataToExport = selectedIds.size > 0 
              ? filtered.filter(f => selectedIds.has(f.id))
              : filtered;
            window.ClientsDB.exportToXLSX(dataToExport);
          }} 
          style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center', color: selectedIds.size > 0 ? 'var(--ocean)' : 'inherit' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          {selectedIds.size > 0 ? `Export (${selectedIds.size})` : 'XLSX Export'}
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
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      onChange={() => toggleSelectAll(filtered)}
                    />
                  </th>
                  <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>Nom {sortConfig.key === 'firstName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('courseType')} style={{ cursor: 'pointer' }}>Classe {sortConfig.key === 'courseType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('bookedAt')} style={{ cursor: 'pointer' }}>Date {sortConfig.key === 'bookedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
               <tbody>
                {loading ? (
                    [1,2,3,4,5].map(i => (
                        <tr key={i}>
                            <td><div className="ui-skeleton" style={{ width: 16, height: 16 }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '80%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '60%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '40%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '50%' }}></div></td>
                            <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '70px' }}></div></td>
                        </tr>
                    ))
                ) : currentData.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Aucun résultat.</td></tr>
                ) : currentData.map(cl => (
                  <tr key={cl.id} className={selectedIds.has(cl.id) ? 'row-selected' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(cl.id)}
                        onChange={() => toggleSelect(cl.id)}
                      />
                    </td>
                    <td><div className="td-title">{cl.firstName} {cl.lastName}</div></td>
                    <td><div className="td-email">{cl.email}</div></td>
                    <td><div className="td-coach">{cl.courseType || 'Classe #' + cl.courseId}</div></td>
                    <td><div className="td-time">{cl.bookedAt ? new Date(cl.bookedAt).toLocaleDateString('fr-FR') : '—'}</div></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="admin-btn-edit" onClick={() => onEdit(cl)}>Modifier</button>
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

/* ── Instructors Table ──────────────────────────── */
function InstructorsTable({ instructors, loading, onEdit, onDelete }) {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const instructorImportRef = React.useRef(null);

  // Reset selection when data or filters change
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [instructors, search]);

  const toggleSelectAll = (filteredData) => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(c => c.id)));
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const filtered = instructors.filter(i => 
    `${i.firstName} ${i.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const currentData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleExport = () => {
    if (!window.XLSX) return;
    const dataToExport = filtered.map(i => ({
      'Prénom': i.firstName,
      'Nom': i.lastName,
      'Email': i.email,
      'Inscription': i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '—'
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Instructeurs");
    XLSX.writeFile(wb, `souplesse_instructeurs.xlsx`);
  };

  return (
    <div className="admin-card" style={{ padding: 0 }}>
      {/* ACTION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' }}>
        <input 
          type="file" 
          ref={instructorImportRef} 
          style={{ display: 'none' }} 
          accept=".xlsx,.xls,.csv" 
          onChange={(e) => {
            if (e.target.files?.[0]) {
              window.InstructorsDB.importFromXLSX(e.target.files[0]).then(() => window.location.reload());
            }
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ui-btn ui-btn--ghost" onClick={() => instructorImportRef.current.click()} style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </button>
          <button className="ui-btn ui-btn--ghost" onClick={() => window.InstructorsDB.downloadTemplate()} style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Template
          </button>
        </div>
        <button className="ui-btn ui-btn--ghost" 
          onClick={() => {
            const dataToExport = selectedIds.size > 0 
              ? filtered.filter(f => selectedIds.has(f.id))
              : filtered;
            window.InstructorsDB.exportToXLSX(dataToExport);
          }} 
          style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center', color: selectedIds.size > 0 ? 'var(--ocean)' : 'inherit' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          {selectedIds.size > 0 ? `Export (${selectedIds.size})` : 'XLSX Export'}
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <select className="ui-input" style={{ width: '160px', paddingLeft: '30px', fontSize: '13px' }} disabled>
            <option value="">Tous les Rôles</option>
            <option value="COACH">Coach</option>
          </select>
          <svg style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search..." 
            className="ui-input" 
            style={{ width: '250px', paddingLeft: '30px', fontSize: '13px' }}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <svg style={{ position: 'absolute', left: 10, top: 10, color: '#888' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onChange={() => toggleSelectAll(filtered)}
                />
              </th>
              <th>Nom</th>
              <th>Email</th>
              <th>Date d'Inscription</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
           <tbody>
            {loading ? (
                [1,2,3,4,5].map(i => (
                    <tr key={i}>
                        <td><div className="ui-skeleton" style={{ width: 16, height: 16 }}></div></td>
                        <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '80%' }}></div></td>
                        <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '60%' }}></div></td>
                        <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '40%' }}></div></td>
                        <td><div className="ui-skeleton ui-skeleton-text" style={{ width: '70px' }}></div></td>
                    </tr>
                ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Aucun instructeur trouvé.</td></tr>
            ) : (
              currentData.map(inst => (
                <tr key={inst.id} className={selectedIds.has(inst.id) ? 'row-selected' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(inst.id)}
                      onChange={() => toggleSelect(inst.id)}
                    />
                  </td>
                  <td><div className="td-title">{inst.firstName} {inst.lastName}</div></td>
                  <td><div className="td-email">{inst.email}</div></td>
                  <td><div className="td-time">{inst.createdAt ? new Date(inst.createdAt).toLocaleDateString('fr-FR') : '—'}</div></td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                      <button className="admin-btn-edit" onClick={() => onEdit(inst)}>Modifier</button>
                      <button className="admin-btn-delete" onClick={() => onDelete(inst)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
  );
}

/* ── Instructor Form ────────────────────────────── */
function InstructorForm({ instructor, onSave, onCancel }) {
  const [firstName, setFirstName] = React.useState(instructor?.firstName || '');
  const [lastName, setLastName] = React.useState(instructor?.lastName || '');
  const [email, setEmail] = React.useState(instructor?.email || '');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return setError('Veuillez remplir tous les champs obligatoires.');

    setLoading(true);
    setError('');
    try {
      if (instructor) {
        await window.InstructorsDB.update(instructor.id, { firstName, lastName, email });
        onSave('Instructeur mis à jour.');
      } else {
        await window.InstructorsDB.add({ firstName, lastName, email });
        onSave('Instructeur créé avec succès.');
      }
    } catch (e) {
      setError(e.response?.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Sofia" />
        <Input label="Nom" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Amira" />
      </div>
      <Input label="Adresse Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sofia@souplesse.dz" />

      {error && <p className="ui-form-error">{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>Annuler</Button>
        <Button variant="primary" type="submit" loading={loading}>{instructor ? 'Mettre à jour' : 'Créer l\'Instructeur'}</Button>
      </div>
    </form>
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

/* ── Admin Settings Section ────────────────────── */
function AdminSettingsSection() {
  const [settings, setSettings] = React.useState({
    MAIL_HOST: '',
    MAIL_PORT: '',
    MAIL_USERNAME: '',
    MAIL_PASSWORD: '',
    MAIL_FROM: '',
    MAIL_STUDIO_NAME: ''
  });
  const [testEmail, setTestEmail] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const showToast = window.useToastStore.getState().showToast;

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const resp = await fetch('/admin/settings/email', {
          headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` }
        });
        if (resp.ok) {
          const data = await resp.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const resp = await fetch('/admin/settings/email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.useAuthStore.getState().token}` 
        },
        body: JSON.stringify(settings)
      });
      if (resp.ok) {
        showToast('Configuration mise à jour avec succès ✓');
      } else {
        throw new Error('Failed to save');
      }
    } catch (e) {
      showToast('Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ui-skeleton" style={{ height: 400 }}></div>;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ocean)" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span className="admin-card-title">Configuration Système</span>
        </div>
      </div>
      <div className="admin-card-body">
        <form onSubmit={handleSave} style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Input 
              label="Serveur SMTP (Host)" 
              value={settings.MAIL_HOST} 
              onChange={e => setSettings({...settings, MAIL_HOST: e.target.value})}
              placeholder="smtp.gmail.com"
            />
            <Input 
              label="Port SMTP" 
              type="number"
              value={settings.MAIL_PORT} 
              onChange={e => setSettings({...settings, MAIL_PORT: e.target.value})}
              placeholder="587"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Input 
              label="Nom d'utilisateur (Email)" 
              value={settings.MAIL_USERNAME} 
              onChange={e => setSettings({...settings, MAIL_USERNAME: e.target.value})}
              placeholder="studio@gmail.com"
            />
            <Input 
              label="Mot de passe (App Password)" 
              type="password"
              value={settings.MAIL_PASSWORD} 
              onChange={e => setSettings({...settings, MAIL_PASSWORD: e.target.value})}
              placeholder="••••••••••••••••"
            />
          </div>

          <Divider label="Personnalisation des Emails" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Input 
              label="Adresse d'expédition (From)" 
              value={settings.MAIL_FROM} 
              onChange={e => setSettings({...settings, MAIL_FROM: e.target.value})}
              placeholder="noreply@souplesse.dz"
            />
            <Input 
              label="Nom du Studio" 
              value={settings.MAIL_STUDIO_NAME} 
              onChange={e => setSettings({...settings, MAIL_STUDIO_NAME: e.target.value})}
              placeholder="Souplesse Pilates Alger"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <Button variant="primary" type="submit" loading={saving}>
              Enregistrer les modifications
            </Button>
          </div>
        </form>

        <Divider label="Test de Connexion" />
        
        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, marginBottom: 15, color: '#64748b' }}>
            Envoyez un email de test pour vérifier que vos paramètres SMTP sont corrects. 
            <strong> Enregistrez vos modifications avant de tester.</strong>
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input 
                label="Email de destination" 
                placeholder="votre@email.com" 
                value={testEmail} 
                onChange={e => setTestEmail(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={async () => {
                if (!testEmail) return showToast('Veuillez saisir un email.');
                try {
                  const resp = await fetch(`/admin/settings/email/test?targetEmail=${encodeURIComponent(testEmail)}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${window.useAuthStore.getState().token}` }
                  });
                  if (resp.ok) showToast('E-mail de test envoyé ✓');
                  else {
                    const txt = await resp.text();
                    showToast('Erreur: ' + (txt || 'Inconnu'));
                  }
                } catch (e) { showToast('Erreur de connexion.'); }
              }}
            >
              Envoyer Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global Exports
window.AdminStats = AdminStats;
window.AdminCharts = AdminCharts;
window.AdminActivityLogs = AdminActivityLogs;
window.CourseForm = CourseForm;
window.CoursesTable = CoursesTable;
window.ClientForm = ClientForm;
window.ClientsTable = ClientsTable;
window.InstructorsTable = InstructorsTable;
window.InstructorForm = InstructorForm;
window.ContentAdmin = ContentAdmin;
window.LogArchiveDialog = LogArchiveDialog;
window.AdminSettingsSection = AdminSettingsSection;
