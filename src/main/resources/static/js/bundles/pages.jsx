/* ── Admin Page ─────────────────────────────────── */
function AdminPage() {
  const { useNavigate } = ReactRouterDOM;
  const navigate = useNavigate();
  const token = window.useAuthStore(s => s.token);
  const showToast = window.useToastStore(s => s.showToast);
  const [courses, setCourses] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [editingCourse, setEditingCourse] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState('dashboard');

  // Auth guard
  React.useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Load data
  const refresh = React.useCallback(async () => {
    try {
      const [c, cl] = await Promise.all([CoursesDB.getAll(), ClientsDB.getAll()]);
      setCourses(c || []);
      setClients(cl || []);
    } catch (e) { console.error(e); }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  async function handleDeleteCourse(id) {
    if (!confirm('Supprimer cette classe ? Cette action est irréversible.')) return;
    try {
      await CoursesDB.remove(id);
      refresh();
      showToast('Classe supprimée.');
    } catch (e) {
      showToast('Erreur de suppression.');
    }
  }

  async function handleDeleteClient(id) {
    if (!confirm('Retirer cette réservation ? Cette action est irréversible.')) return;
    try {
      await ClientsDB.remove(id);
      refresh();
      showToast('Réservation retirée.');
    } catch (e) {
      showToast('Erreur de suppression.');
    }
  }

  function handleEditCourse(course) {
    setEditingCourse(course);
    setActiveSection('addCourse');
    document.getElementById('addCourseSection')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleCourseSaved(msg) {
    setEditingCourse(null);
    refresh();
    showToast(msg);
  }

  function handleClientSaved(msg) {
    refresh();
    showToast(msg);
  }

  function handleNavigate(section) {
    setActiveSection(section);
    const targetMap = { dashboard: null, addCourse: 'addCourseSection', courses: 'coursesSection', clients: 'clientsSection', contentSettings: 'contentSettingsSection' };
    const target = targetMap[section];
    if (target) {
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const todayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <AdminSidebar activeSection={activeSection} onNavigate={handleNavigate}/>
      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div>
            <p className="admin-header-eyebrow">Manager Portal</p>
            <h1 className="admin-header-title">Tableau de Bord</h1>
          </div>
          <span className="admin-header-date">{todayStr}</span>
        </div>

        {/* Stats */}
        <AdminStats courses={courses} clients={clients}/>

        {/* Course Form + Table */}
        <div className="admin-layout">
          <CourseForm editingCourse={editingCourse} onSave={handleCourseSaved} onCancel={() => setEditingCourse(null)}/>
          <CoursesTable courses={courses} onEdit={handleEditCourse} onDelete={handleDeleteCourse}/>
        </div>

        {/* Client Form + Table */}
        <div className="admin-layout" id="clientsSection" style={{ marginTop: 32 }}>
          <ClientForm courses={courses} onSave={handleClientSaved}/>
          <ClientsTable clients={clients} onDelete={handleDeleteClient}/>
        </div>
        {/* Content Management Form + Table (Only show when active) */}
        {activeSection === 'contentSettings' && (
          <div className="admin-layout" id="contentSettingsSection" style={{ marginTop: 32 }}>
            <ContentAdmin />
          </div>
        )}
      </main>

      {/* Toast */}
      <Toast/>
    </>
  );
}
/* ── Home Page ──────────────────────────────────── */
function HomePage() {
  const [courses, setCourses] = React.useState([]);

  const loadCourses = React.useCallback(async () => {
    try {
      const data = await CoursesDB.getAll();
      setCourses(data || []);
    } catch (e) { console.error("Failed to load courses", e); }
  }, []);

  React.useEffect(() => { loadCourses(); }, [loadCourses]);

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
      <CoursesGrid courses={courses} onBook={handleBookFromGrid}/>
      <BookingCalendar courses={courses} refreshCourses={loadCourses}/>
      <Testimonials/>
      <Gallery/>
      <Footer/>
    </>
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
