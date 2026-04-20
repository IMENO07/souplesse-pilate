const { Outlet, Link, useLocation } = ReactRouterDOM;

/* ── Admin Common Layout ────────────────────────── */
function AdminLayout() {
  const { useNavigate } = ReactRouterDOM;
  const navigate = useNavigate();
  const token = window.useAuthStore(s => s.token);
  const showToast = window.useToastStore(s => s.showToast);
  
  const [courses, setCourses] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Auth guard
  React.useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Load data
  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const [c, cl] = await Promise.all([CoursesDB.getAll(), ClientsDB.getAll()]);
      setCourses(c || []);
      setClients(cl || []);
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  React.useEffect(() => {
    SEOManager.set({
      title: 'Console Admin',
      description: 'Gestion du studio Souplesse Pilates. Suivi des classes, clients et réservations.',
      image: '/pilimg.jpeg',
      url: window.location.href
    });
  }, []);

  const contextValue = { courses, clients, loading, refresh, showToast };

  return (
    <>
      <AdminSidebar />
      <main className="admin-main">
        <Outlet context={contextValue} />
      </main>
      <Toast/>
    </>
  );
}

/* ── Admin Sub-pages ────────────────────────────── */

function AdminDashboardPage() {
  const { courses, clients, loading } = ReactRouterDOM.useOutletContext();
  const todayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <div className="admin-header">
        <div>
          <p className="admin-header-eyebrow">Manager Portal</p>
          <h1 className="admin-header-title">Tableau de Bord</h1>
        </div>
        <span className="admin-header-date">{todayStr}</span>
      </div>
      <AdminStats courses={courses} clients={clients} loading={loading}/>
      
      <AdminCharts courses={courses} />
      
      <AdminActivityLogs />
    </>
  );
}

function AdminClassesPage() {
  const { courses, refresh, showToast } = ReactRouterDOM.useOutletContext();
  const [editingCourse, setEditingCourse] = React.useState(null);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState({ open: false, id: null, title: '' });

  const openAddCourse = () => { setEditingCourse(null); setIsCourseDialogOpen(true); };
  const openEditCourse = (course) => { setEditingCourse(course); setIsCourseDialogOpen(true); };
  
  const handleCourseSaved = (msg) => {
    setIsCourseDialogOpen(false);
    refresh();
    showToast(msg);
  };

  const askDelete = (c) => setDeleteConfirm({ open: true, id: c.id, title: c.title });
  const executeDelete = async () => {
    try {
      await CoursesDB.remove(deleteConfirm.id);
      refresh();
      showToast('Classe supprimée.');
    } catch (e) { showToast('Erreur.'); }
    setDeleteConfirm({ open: false, id: null, title: '' });
  };

  return (
    <>
      <div className="admin-header">
        <h1 className="admin-header-title">Classes & Séances</h1>
        <button className="ui-btn ui-btn--primary ui-btn--sm" onClick={openAddCourse}>+ Nouvelle Classe</button>
      </div>

      <div className="admin-layout" id="coursesSection">
        <CoursesTable courses={courses} loading={loading} onEdit={openEditCourse} onDelete={askDelete}/>
      </div>

      <Dialog isOpen={isCourseDialogOpen} onClose={() => setIsCourseDialogOpen(false)} size="lg">
        <DialogHeader>
          <DialogTitle>{editingCourse ? 'Éditer la Classe' : 'Ajouter une Classe'}</DialogTitle>
          <DialogDescription>
            {editingCourse 
              ? 'Mettez à jour les détails de votre séance ci-dessous.' 
              : 'Configurez les détails de votre nouvelle séance de Pilates.'}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <CourseForm editingCourse={editingCourse} onSave={handleCourseSaved} onCancel={() => setIsCourseDialogOpen(false)} />
        </DialogBody>
      </Dialog>

      <Dialog isOpen={deleteConfirm.open} onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })} size="sm">
        <DialogHeader>
          <DialogTitle>Confirmation de suppression</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p style={{ margin: 0, fontSize: 14 }}>Supprimer <strong>{deleteConfirm.title}</strong> ? Cette action est irréversible.</p>
        </DialogBody>
        <DialogFooter>
          <button className="ui-btn ui-btn--ghost" onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>Annuler</button>
          <button className="ui-btn ui-btn--danger" onClick={executeDelete}>Supprimer</button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AdminInstructorsPage() {
  const { refresh, showToast } = ReactRouterDOM.useOutletContext();
  const [instructors, setInstructors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editingInstructor, setEditingInstructor] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState({ open: false, id: null, name: '' });

  const load = React.useCallback(async () => {
    setLoading(true);
    const data = await window.InstructorsDB.getAll();
    setInstructors(data || []);
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const handleSaved = (msg) => {
    setIsDialogOpen(false);
    setEditingInstructor(null);
    load();
    showToast(msg);
  };

  const askDelete = (i) => setDeleteConfirm({ open: true, id: i.id, name: `${i.firstName} ${i.lastName}` });
  
  const executeDelete = async () => {
    try {
      await window.InstructorsDB.remove(deleteConfirm.id);
      load();
      showToast('Instructeur supprimé.');
    } catch (e) { showToast('Erreur.'); }
    setDeleteConfirm({ open: false, id: null, name: '' });
  };

  return (
    <>
      <div className="admin-header">
        <h1 className="admin-header-title">Instructeurs</h1>
        <button className="ui-btn ui-btn--primary ui-btn--sm" onClick={() => { setEditingInstructor(null); setIsDialogOpen(true); }}>+ Ajouter Instructeur</button>
      </div>

      <div className="admin-layout" id="instructorsSection">
        <InstructorsTable instructors={instructors} loading={loading} onEdit={(i) => { setEditingInstructor(i); setIsDialogOpen(true); }} onDelete={askDelete} />
      </div>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>{editingInstructor ? 'Modifier l\'Instructeur' : 'Ajouter un Instructeur'}</DialogTitle>
          <DialogDescription>{editingInstructor ? 'Mettez à jour les informations du membre de l\'équipe.' : 'Créez un nouveau compte pour un instructeur du studio.'}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <InstructorForm instructor={editingInstructor} onSave={handleSaved} onCancel={() => setIsDialogOpen(false)} />
        </DialogBody>
      </Dialog>

      <Dialog isOpen={deleteConfirm.open} onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })} size="sm">
        <DialogHeader><DialogTitle>Confirmation</DialogTitle></DialogHeader>
        <DialogBody>
          <p style={{ margin: 0, fontSize: 14 }}>Supprimer <strong>{deleteConfirm.name}</strong> ? Cette action est irréversible.</p>
        </DialogBody>
        <DialogFooter>
          <button className="ui-btn ui-btn--ghost" onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>Annuler</button>
          <button className="ui-btn ui-btn--danger" onClick={executeDelete}>Supprimer</button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AdminClientsPage() {
  const { clients, courses, refresh, showToast } = ReactRouterDOM.useOutletContext();
  const [isClientDialogOpen, setIsClientDialogOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState({ open: false, id: null, title: '' });

  const handleClientSaved = (msg) => {
    setIsClientDialogOpen(false);
    setEditingClient(null);
    refresh();
    showToast(msg);
  };
  
  const openEditClient = (cl) => {
    setEditingClient(cl);
    setIsClientDialogOpen(true);
  };
  
  const openAddClient = () => {
    setEditingClient(null);
    setIsClientDialogOpen(true);
  };

  const askDelete = (cl) => setDeleteConfirm({ open: true, id: cl.id, title: `${cl.firstName} ${cl.lastName}` });
  const executeDelete = async () => {
    try {
      await ClientsDB.remove(deleteConfirm.id);
      refresh();
      showToast('Réservation retirée.');
    } catch (e) { showToast('Erreur.'); }
    setDeleteConfirm({ open: false, id: null, title: '' });
  };

  return (
    <>
      <div className="admin-header">
        <h1 className="admin-header-title">Clients & Réservations</h1>
        <button className="ui-btn ui-btn--primary ui-btn--sm" onClick={openAddClient}>+ Ajouter Client</button>
      </div>

      <div className="admin-layout" id="clientsSection">
        <ClientsTable clients={clients} loading={loading} courses={courses} onEdit={openEditClient} onDelete={askDelete}/>
      </div>

      <Dialog isOpen={isClientDialogOpen} onClose={() => setIsClientDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>{editingClient ? 'Modifier le Client' : 'Ajouter un Client'}</DialogTitle>
          <DialogDescription>{editingClient ? 'Modifiez les détails de la réservation existante.' : 'Inscrivez un nouveau membre à une séance existante.'}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <ClientForm editingClient={editingClient} courses={courses} onSave={handleClientSaved} onCancel={() => setIsClientDialogOpen(false)}/>
        </DialogBody>
      </Dialog>

      <Dialog isOpen={deleteConfirm.open} onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })} size="sm">
        <DialogHeader>
          <DialogTitle>Retirer une réservation</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p style={{ margin: 0, fontSize: 14 }}>Retirer la réservation de <strong>{deleteConfirm.title}</strong> ?</p>
        </DialogBody>
        <DialogFooter>
          <button className="ui-btn ui-btn--ghost" onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>Annuler</button>
          <button className="ui-btn ui-btn--danger" onClick={executeDelete}>Retirer</button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AdminContentPage() {
  return (
    <>
      <div className="admin-header">
        <h1 className="admin-header-title">Contenu du Site</h1>
      </div>
      <div className="admin-layout">
        <ContentAdmin />
      </div>
    </>
  );
}
/* ── Home Page ──────────────────────────────────── */
function HomePage() {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadCourses = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await CoursesDB.getAll();
      setCourses(data || []);
    } catch (e) { 
      console.error("Failed to load courses", e); 
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadCourses(); }, [loadCourses]);

  React.useEffect(() => {
    SEOManager.set({
      title: 'Studio Pilates Alger',
      description: 'Un sanctuaire dédié au mouvement intentionnel. Reformer Pilates à Alger.',
      image: '/pilimg.jpeg',
      url: window.location.href
    });
  }, []);

  // Scroll animations (fade-up)
  React.useEffect(() => {
    function observeFadeUps() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "-60px" });
      document.querySelectorAll('.fade-up:not(.visible)').forEach(el => observer.observe(el));
    }
    const timer = setTimeout(observeFadeUps, 300);
    return () => clearTimeout(timer);
  }, [courses]);

  // Active nav tracking
  React.useEffect(() => {
    function onScroll() {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 100) {
          current = section.getAttribute('id');
        }
      });
      document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleBookFromGrid(course) {
    if (window.__goToBooking) window.__goToBooking(course);
  }

  return (
    <>
      <Navbar/>
      <Hero/>
      <StudioShowcase/>
      <CoursesGrid courses={courses} loading={loading} onBook={handleBookFromGrid}/>
      <BookingCalendar courses={courses} loading={loading} refreshCourses={loadCourses}/>
      <Testimonials/>
      <Gallery/>
      <Footer/>
    </>
  );
}

/* ── About Page ─────────────────────────────────── */
function AboutPage() {
  React.useEffect(() => {
    SEOManager.set({
      title: 'Notre Histoire',
      description: 'Découvrez l\'esprit Souplesse. Un studio fondé sur la passion du mouvement et le raffinement.',
      image: '/pilimg.jpeg',
      url: window.location.href
    });
  }, []);

  return (
    <div className="subpage-wrapper">
      <Navbar />
      <header className="subpage-header">
        <div className="container">
          <p className="label fade-up">L'Esprit Souplesse</p>
          <h1 className="section-title fade-up">Mouvement <em style={{ fontStyle: 'italic', color: 'var(--sand)' }}>Intentionnel</em></h1>
        </div>
      </header>
      
      <section className="container subpage-content">
        <div className="about-grid">
           <div className="fade-up">
              <h2>Arches & Lumière</h2>
              <p>Fondé en 2023 à Alger, Souplesse est né d'un désir de créer un espace où le mouvement ne serait pas seulement physique, mais aussi une forme d'art et de méditation.</p>
              <p>Notre studio a été conçu par des architectes passionnés, utilisant des matériaux naturels comme le chêne clair et le plâtre texturé pour créer une atmosphère de sérénité absolue.</p>
           </div>
           <div className="fade-up">
              <h2>La Pratique Reformer</h2>
              <p>Nous nous spécialisons dans le Reformer Pilates, une méthode qui utilise des ressorts pour offrir une résistance fluide, permettant de sculpter le corps tout en protégeant les articulations.</p>
              <p>Chaque séance est limitée à un petit nombre de participants pour garantir une attention personnalisée de la part de nos instructeurs certifiés.</p>
           </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ── Pricing Page ───────────────────────────────── */
function PricingPage() {
  React.useEffect(() => {
    SEOManager.set({
      title: 'Nos Tarifs',
      description: 'Explorez nos formules et abonnements. Des séances à la carte ou des packs pour votre pratique régulière.',
      image: '/pilimg.jpeg',
      url: window.location.href
    });
  }, []);

  const packs = [
    { name: "Séance Découverte", price: "2,500 DA", desc: "Idéal pour votre première immersion dans le studio.", features: ["1 Séance Reformer", "Validité 7 jours", "Accès Vestiaires"] },
    { name: "Pack 10 Séances", price: "22,000 DA", desc: "Pour une pratique régulière et des résultats visibles.", features: ["10 Séances Reformer", "Validité 3 mois", "Priorité Réservation"] },
    { name: "Abonnement Monthly", price: "35,000 DA", desc: "L'engagement total pour votre transformation.", features: ["Séances Illimitées", "Accès à toutes les classes", "Invitations Workshops"] }
  ];

  return (
    <div className="subpage-wrapper">
      <Navbar />
      <header className="subpage-header">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="label fade-up">Investissez en Vous</p>
          <h1 className="section-title fade-up">Nos <em style={{ fontStyle: 'italic', color: 'var(--sand)' }}>Formules</em></h1>
        </div>
      </header>

      <section className="container" style={{ paddingBottom: '100px' }}>
        <div className="pricing-grid">
          {packs.map((p, i) => (
            <div key={i} className="pricing-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="pricing-name">{p.name}</div>
              <div className="pricing-price">{p.price}</div>
              <p className="pricing-desc">{p.desc}</p>
              <ul className="pricing-features">
                {p.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <button className="btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => window.location.hash = '#/booking'}>Choisir cette offre</button>
            </div>
          ))}
        </div>
        
        <div className="pricing-note fade-up">
           <p>* Toutes nos classes sont sur réservation uniquement. Annulation possible jusqu'à 12h avant le début de la séance.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
/* ── Login Page ─────────────────────────────────── */
function LoginPage() {
  const { useNavigate } = ReactRouterDOM;
  const navigate = useNavigate();
  const token = window.useAuthStore(state => state.token);
  const setToken = window.useAuthStore(state => state.setToken);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (token) navigate('/admin');
  }, [token, navigate]);

  // Enter key handler
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Enter') handleLogin(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  async function handleLogin() {
    setError('');
    
    // Zod Validation
    const result = window.Schemas.login.safeParse({ email: email.trim(), password: password.trim() });
    if (!result.success) {
      setError(window.formatZodError(result.error));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', result.data);
      if (response && response.token) {
        setToken(response.token);
        navigate('/admin');
      } else {
        throw new Error('No token');
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-name">SOUPLESSE</div>
          <div className="login-logo-sub">Pilates Studio · Alger</div>
          <span className="login-badge">Manager Portal</span>
        </div>

        {/* Email */}
        <div className="login-field">
          <label>Adresse Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 placeholder="admin@fitbook.com" autoComplete="email"/>
        </div>

        {/* Password */}
        <div className="login-field">
          <label>Mot de Passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••" autoComplete="current-password"/>
        </div>

        {/* Error */}
        <p className="login-error">{error}</p>

        {/* Submit */}
        <button className="login-submit" onClick={handleLogin} disabled={loading}>
          {loading ? 'Connexion…' : 'Connexion →'}
        </button>

        {/* Back link */}
        <a href="#" className="login-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          ← Vue Client
        </a>
      </div>
    </div>
  );
}
