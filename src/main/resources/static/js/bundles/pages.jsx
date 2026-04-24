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
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Auth guard
  React.useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Close sidebar on location change
  const location = ReactRouterDOM.useLocation();
  React.useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

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
    <div className={`admin-app-wrapper ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
      <AdminSidebar isOpen={sidebarOpen} />
      
      {/* Mobile Toggle Button */}
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {sidebarOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Backdrop */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <main className="admin-main">
        <Outlet context={contextValue} />
      </main>
      <Toast/>
    </div>
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
  const { courses, loading, refresh, showToast } = ReactRouterDOM.useOutletContext();
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
  const { clients, courses, loading, refresh, showToast } = ReactRouterDOM.useOutletContext();
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

function AdminSettingsPage() {
  return (
    <>
      <div className="admin-header">
        <h1 className="admin-header-title">Paramètres Système</h1>
      </div>
      <div className="admin-layout">
        <AdminSettingsSection />
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

  window.useFadeUp([courses]);

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
      title: 'Notre Histoire | Souplesse Pilates',
      description: 'Découvrez l\'esprit Souplesse. Un studio fondé sur la passion du mouvement, le raffinement architectural et le bien-être à Alger.',
      image: '/pilimg.jpeg',
      url: window.location.href
    });
    window.scrollTo(0, 0);
  }, []);

  window.useFadeUp([]);

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
              <p>Notre studio a été conçu par des architectes passionnés, utilisant des matériaux naturels comme le chêne clair et le plâtre texturé pour créer une atmosphère de sérénité absolue. Chaque détail, de l'éclairage tamisé à l'acoustique travaillée, a été pensé pour vous offrir une immersion totale.</p>
           </div>
           <div className="fade-up">
              <h2>La Pratique Reformer</h2>
              <p>Nous nous spécialisons dans le Reformer Pilates, une méthode qui utilise des ressorts pour offrir une résistance fluide, permettant de sculpter le corps tout en protégeant les articulations.</p>
              <p>Contrairement aux exercices traditionnels, le Reformer permet de travailler les muscles profonds avec une précision chirurgicale. Que vous soyez débutant ou athlète confirmé, la machine s'adapte à vos besoins pour un renforcement global et durable.</p>
           </div>
        </div>

        <div className="about-values-section fade-up" style={{ marginTop: '80px', paddingTop: '80px', borderTop: '1px solid var(--sand)' }}>
          <div className="about-values-grid">
            <div className="value-item">
              <h3>Excellence</h3>
              <p>Nous collaborons uniquement avec des instructeurs certifiés internationalement pour vous garantir une pratique sécuritaire et efficace.</p>
            </div>
            <div className="value-item">
              <h3>Intimité</h3>
              <p>Avec un maximum de 6 participants par session, nous privilégions la qualité de l'accompagnement sur la quantité.</p>
            </div>
            <div className="value-item">
              <h3>Raffinement</h3>
              <p>De nos équipements Merrithew™ à nos protocoles de soins, nous visons le plus haut standard du luxe bien-être.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team-preview fade-up" style={{ background: 'var(--cream)', padding: '100px 0', marginTop: '100px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">L'Équipe <span style={{ color: 'var(--sand)' }}>Experte</span></h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 60px' }}>Nos instructeurs sont là pour vous guider, vous challenger et vous aider à atteindre vos objectifs de bien-être physique et mental.</p>
          <div className="btn-group">
            <a href="#/booking" className="btn-primary">Réserver un cours</a>
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
/* ── Terms & Privacy Pages ─────────────────────── */

function TermsPage() {
  React.useEffect(() => { 
    SEOManager.set({ title: 'Conditions Générales | Souplesse Pilates', description: 'Conditions d\'utilisation et de vente de Souplesse Pilates Studio Alger.' });
    window.scrollTo(0, 0); 
  }, []);
  window.useFadeUp([]);
  return (
    <div className="subpage-wrapper">
      <Navbar />
      <header className="subpage-header">
        <div className="container">
          <h1 className="section-title">Conditions <em style={{ color: 'var(--sand)' }}>Générales</em></h1>
        </div>
      </header>
      <section className="container subpage-content" style={{ maxWidth: '800px', margin: '0 auto 100px' }}>
        <div className="legal-content fade-up">
          <h2>1. Objet</h2>
          <p>Les présentes conditions générales de vente et d'utilisation (CGV/CGU) régissent l'accès et l'utilisation des services du studio Souplesse Pilates.</p>
          
          <h2>2. Réservations & Annulations</h2>
          <p>Toute séance doit être réservée à l'avance via notre plateforme en ligne. Une annulation doit être effectuée au moins 12 heures avant le début de la séance pour ne pas être décomptée de votre forfait.</p>
          
          <h2>3. Santé & Aptitude Physique</h2>
          <p>Le client s'engage à être en bonne santé physique pour pratiquer le Pilates. Il est impératif de signaler toute blessure, pathologie ou grossesse à l'instructeur avant le début du cours.</p>
          
          <h2>4. Tarifs & Paiements</h2>
          <p>Les tarifs sont indiqués en Dinars Algériens (DA). Les forfaits sont nominatifs et possèdent une durée de validité limitée selon l'offre choisie.</p>
          
          <h2>5. Responsabilité</h2>
          <p>Souplesse Pilates décline toute responsabilité en cas de vol ou de perte d'objets personnels au sein du studio.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function PrivacyPage() {
  React.useEffect(() => { 
    SEOManager.set({ title: 'Confidentialité | Souplesse Pilates', description: 'Politique de protection des données personnelles de Souplesse Pilates.' });
    window.scrollTo(0, 0); 
  }, []);
  window.useFadeUp([]);
  return (
    <div className="subpage-wrapper">
      <Navbar />
      <header className="subpage-header">
        <div className="container">
          <h1 className="section-title">Politique de <em style={{ color: 'var(--sand)' }}>Confidentialité</em></h1>
        </div>
      </header>
      <section className="container subpage-content" style={{ maxWidth: '800px', margin: '0 auto 100px' }}>
        <div className="legal-content fade-up">
          <h2>Collecte des données</h2>
          <p>Nous collectons uniquement les informations nécessaires à la gestion de vos réservations (Nom, Prénom, Email, Téléphone).</p>
          
          <h2>Utilisation des informations</h2>
          <p>Vos données sont utilisées pour confirmer vos séances, vous envoyer des rappels et, si vous l'avez accepté, vous transmettre notre newsletter.</p>
          
          <h2>Protection des données</h2>
          <p>Souplesse Pilates s'engage à ne jamais vendre ou partager vos données personnelles avec des tiers à des fins commerciales.</p>
          
          <h2>Vos droits</h2>
          <p>Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles sur simple demande.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
