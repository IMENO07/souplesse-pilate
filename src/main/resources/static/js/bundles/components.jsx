/* ── Admin Sidebar Component ───────────────────── */
function AdminSidebar({ activeSection, onNavigate }) {
  const { useNavigate } = ReactRouterDOM;
  const navigate = useNavigate();

  const items = [
    { id: 'dashboard', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', label: 'Tableau de bord' },
    { id: 'addCourse', icon: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>', label: 'Ajouter une Classe' },
    { id: 'courses', icon: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', label: 'Toutes les Classes' },
    { id: 'clients', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>', label: 'Clients & Réservations' },
    { id: 'contentSettings', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>', label: 'Contenu du Site' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-name">SOUPLESSE</div>
        <div className="sidebar-logo-sub">Pilates Studio · Alger</div>
        <span className="sidebar-badge">Manager Portal</span>
      </div>
      <nav className="sidebar-nav">
        {items.map(item => (
          <a key={item.id} href="#" className={`sidebar-nav-item${activeSection === item.id ? ' active' : ''}`}
             onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                 dangerouslySetInnerHTML={{ __html: item.icon }}/>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <a href="#" className="sidebar-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Vue Client
        </a>
        <a href="#" className="sidebar-logout" onClick={(e) => {
          e.preventDefault();
          window.useAuthStore.getState().logout();
          navigate('/login');
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </a>
      </div>
    </aside>
  );
}
/* ── Footer Component ──────────────────────────── */
function Newsletter() {
  const [subscribed, setSubscribed] = React.useState(false);
  const [nlEmail, setNlEmail] = React.useState('');

  function subscribe() {
    if (!nlEmail) return;
    setSubscribed(true);
  }

  return (
    <div className="footer-newsletter fade-up">
      <h3>Restez dans le Flow</h3>
      <p>Nouvelles classes, actualités du studio et vie consciente — directement dans votre boîte mail.</p>
      {!subscribed ? (
        <div className="newsletter-form">
          <input type="email" placeholder="votre@email.com" value={nlEmail} onChange={e => setNlEmail(e.target.value)}/>
          <button onClick={subscribe}>S'abonner</button>
        </div>
      ) : (
        <p className="newsletter-thanks" style={{ display: 'block' }}>✓ Bienvenue — à bientôt sur le tapis.</p>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer id="footer">
      <Newsletter/>
      <div className="footer-grid fade-up">
        <div>
          <div className="footer-brand-name">SOUPLESSE</div>
          <div className="footer-brand-sub">Pilates Studio · Alger</div>
          <p className="footer-brand-desc">Un sanctuaire pour le mouvement intentionnel. Là où l'architecture rencontre l'art du Pilates.</p>
          <div className="footer-socials">
            <a href="#" className="footer-social">IG</a>
            <a href="#" className="footer-social">TK</a>
            <a href="#" className="footer-social">FB</a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Studio</div>
          <a href="#">À propos</a>
          <a href="#">Classes</a>
          <a href="#">Instructeurs</a>
          <a href="pilimg.jpeg">Tarifs</a>
          <a href="#">Cartes Cadeaux</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Contact</div>
          <div className="footer-contact-item"><span>Adresse</span><span>Alger, Algérie</span></div>
          <div className="footer-contact-item"><span>Horaires</span><span>Lun–Sam · 7h–21h</span></div>
          <div className="footer-contact-item"><span>Email</span><span>hello@souplesse.dz</span></div>
          <div className="footer-contact-item"><span>Téléphone</span><span>+213 555 000 000</span></div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Souplesse. Tous droits réservés.</span>
        <span>Conçu avec intention.</span>
      </div>
    </footer>
  );
}
/* ── Navbar Component ───────────────────────────── */
function Navbar() {
  const { Link } = ReactRouterDOM;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function closeMobile() { setMobileOpen(false); }

  function scrollTo(id) {
    closeMobile();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  return (
    <>
      <nav id="nav">
        <a href="#" className="nav-logo" onClick={() => scrollTo('hero')}>
          <span>SOUPLESSE</span>
          <span>Pilates Studio</span>
        </a>
        <div className="nav-links">
          <a href="#studio" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('studio'); }}>Studio</a>
          <a href="#classes" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('classes'); }}>Classes</a>
          <a href="#booking" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('booking'); }}>Booking</a>
          <a href="#community" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('community'); }}>Community</a>
          <a href="#footer" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('footer'); }}>Contact</a>
          <a href="#booking" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('booking'); }}>Book Now</a>
        </div>
        <button className={`hamburger${mobileOpen ? ' active' : ''}`} aria-label="Menu" onClick={() => setMobileOpen(!mobileOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div id="mobile-menu" style={{ display: mobileOpen ? 'flex' : 'none' }}>
        <a href="#" onClick={() => scrollTo('studio')}>Studio</a>
        <a href="#" onClick={() => scrollTo('classes')}>Classes</a>
        <a href="#" onClick={() => scrollTo('booking')}>Booking</a>
        <a href="#" onClick={() => scrollTo('community')}>Community</a>
        <a href="#" onClick={() => scrollTo('footer')}>Contact</a>
      </div>
    </>
  );
}
/* ── Toast Component ────────────────────────────── */
function Toast() {
  const { message, visible } = window.useToastStore(s => s);
  if (!visible || !message) return null;
  return <div id="adminToast" className="show">{message}</div>;
}
