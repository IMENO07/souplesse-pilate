/* ── Hero Section ──────────────────────────────── */
function Hero() {
  const [cardIdx, setCardIdx] = React.useState(0);
  const [images, setImages] = React.useState([]);
  React.useEffect(() => { ContentDB.getStudioImages().then(res => setImages(res.map(i=>i.imageUrl))); }, []);

  const bgImg = images.length > 0 ? images[0] : 'studio-hero.jpg';
  const cardImg = images.length > cardIdx ? images[cardIdx] : (images.length > 0 ? images[0] : 'studio-hero.jpg');

  return (
    <section id="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="hero-overlay"></div>
      <svg className="hero-wave" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
        <path d="M0 80 Q360 0 720 80 Q1080 160 1440 80 L1440 80 L0 80Z" fill="#FDFCFA"/>
      </svg>
      <div className="hero-content">
        <p className="hero-eyebrow">Est. Alger · 2023</p>
        <h1 className="hero-title">Move<br/><em>Beautifully</em></h1>
        <p className="hero-sub">Un sanctuaire pour le mouvement intentionnel. Reformer Pilates dans un studio intime conçu pour la transformation.</p>
        <div className="hero-btns">
          <a href="#booking" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}>Réserver une Classe</a>
          <a href="#classes" className="btn-outline" onClick={(e) => { e.preventDefault(); document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' }); }}>Nos Classes</a>
        </div>
      </div>
      <div className="hero-card">
        {cardImg && <img src={cardImg} alt="Studio"/>}
        <div className="hero-card-overlay"></div>
        <div className="hero-card-label">Notre Studio</div>
        <div className="hero-card-dots">
          {images.map((_, i) => (
             <button key={i} className={cardIdx === i ? 'active' : ''} onClick={() => setCardIdx(i)}></button>
          ))}
        </div>
      </div>
      <div className="scroll-hint">
        <span>Scroll</span>
        <div></div>
      </div>
    </section>
  );
}
/* ── Studio Showcase Section ───────────────────── */
function StudioShowcase() {
  const [tab, setTab] = React.useState(0);
  const [images, setImages] = React.useState([]);
  React.useEffect(() => { ContentDB.getStudioImages().then(res => setImages(res.map(i=>i.imageUrl))); }, []);

  const img1 = images.length > 0 ? images[0] : 'studio-hero.jpg';
  const img2 = images.length > 1 ? images[1] : 'studio-detail.jpg';

  return (
    <section id="studio">
      <div className="tab-bar">
        <button className={tab === 0 ? 'active' : ''} onClick={() => setTab(0)}>L'Espace</button>
        <button className={tab === 1 ? 'active' : ''} onClick={() => setTab(1)}>La Pratique</button>
      </div>
      <div className={`studio-panel${tab === 0 ? ' active' : ''}`} id="tab-0">
        <div className="studio-panel-img">
          <img src={img1} alt="Studio Arches & Lumière"/>
        </div>
        <div className="studio-panel-text">
          <p className="label">Souplesse · Alger</p>
          <h2>Arches &amp; Lumière</h2>
          <p>Nos arches emblématiques baignent chaque séance d'une lumière ambiante chaleureuse. Le plâtre texturé, la barre en bois et les étagères flottantes créent un espace à la fois vivant et serein.</p>
          <div className="studio-stats">
            <div><div className="stat-num">8+</div><div className="stat-label">Instructeurs</div></div>
            <div><div className="stat-num">200+</div><div className="stat-label">Classes / Mois</div></div>
            <div><div className="stat-num">6</div><div className="stat-label">Salles</div></div>
          </div>
        </div>
      </div>
      <div className={`studio-panel${tab === 1 ? ' active' : ''}`} id="tab-1">
        <div className="studio-panel-img">
          <img src={img2} alt="Studio Verre & Mouvement"/>
        </div>
        <div className="studio-panel-text">
          <p className="label">Souplesse · Alger</p>
          <h2>Verre &amp; Mouvement</h2>
          <p>Notre mur de verre sol-plafond transforme le mouvement en art. Entraînez-vous dans un espace où chaque angle est intentionnel — et la citation sur le verre vous rappelle pourquoi vous êtes venu.</p>
          <div className="studio-stats">
            <div><div className="stat-num">15k</div><div className="stat-label">Communauté</div></div>
            <div><div className="stat-num">5★</div><div className="stat-label">Rating</div></div>
            <div><div className="stat-num">3</div><div className="stat-label">Ans</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ── Courses Grid Section ──────────────────────── */
function CoursesGrid({ courses, loading, onBook }) {
  return (
    <section id="classes">
      <div className="section-header fade-up">
        <p className="label">Member Portal</p>
        <h2 className="section-title">Bibliothèque de Classes</h2>
      </div>
      <div className="courses-grid" id="coursesGrid">
        {loading ? (
            [1,2,3].map(i => (
                <div key={i} className="course-card ui-skeleton" style={{ height: '400px' }}></div>
            ))
        ) : (!courses || courses.length === 0) ? (
          <p style={{ textAlign: 'center', color: 'var(--sand)', fontStyle: 'italic', gridColumn: '1 / -1' }}>
            Aucune classe disponible pour le moment.
          </p>
        ) : courses.map(course => {
          const spots = CoursesDB.spotsLeft(course);
          const full = spots <= 0;
          const dt = new Date(course.dateTime);
          const dateStr = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
          const timeStr = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={course.id} className="course-card fade-up">
              <img className="course-img" src={course.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'} alt={course.title} loading="lazy"/>
              <div className="course-gradient"></div>
              {spots <= 2 && !full && <div className="spots-badge">{spots} restant{spots > 1 ? 's' : ''}</div>}
              <div className="course-base">
                <div className="course-instructor">{course.coach}</div>
                <div className="course-title">{course.title}</div>
              </div>
              <div className="course-overlay">
                <div className="course-divider"></div>
                <div className="course-title" style={{ color: 'white', fontSize: 22, marginBottom: 12 }}>{course.title}</div>
                <div className="course-datetime">{dateStr} · {timeStr}</div>
                <div className="course-price">{course.price ? course.price.toLocaleString('fr-FR') + ' DA' : 'Prix en cours de définition'}</div>
                <div className="course-spots">{spots} place{spots > 1 ? 's' : ''} disponible{spots > 1 ? 's' : ''}</div>
                <p className="course-description">{course.description}</p>
                <button className={`btn-book${full ? ' disabled' : ''}`} onClick={() => !full && onBook(course)} disabled={full}>
                  {full ? 'Classe Complète' : 'Réserver'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
/* ── Booking Calendar Section ──────────────────── */
function BookingCalendar({ courses, refreshCourses }) {
  const [step, setStep] = React.useState(1);
  const [calYear, setCalYear] = React.useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = React.useState(new Date().getMonth());
  const [selDate, setSelDate] = React.useState(null);
  const [selClass, setSelClass] = React.useState(null);
  const [nom, setNom] = React.useState('');
  const [prenom, setPrenom] = React.useState('');
  const [email, setEmail] = React.useState('');

  const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const days = ["L","M","M","J","V","S","D"];
  const now = new Date();
  const todayY = now.getFullYear(), todayM = now.getMonth(), todayD = now.getDate();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  let firstDay = new Date(calYear, calMonth, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const selectedDateStr = selDate
    ? `${calYear}-${(calMonth+1).toString().padStart(2,'0')}-${selDate.toString().padStart(2,'0')}`
    : null;

  const availableCourses = selectedDateStr
    ? courses.filter(c => c.dateTime.startsWith(selectedDateStr))
    : [];

  const selectedCourse = selClass && selectedDateStr
    ? courses.find(c => c.title === selClass && c.dateTime.startsWith(selectedDateStr))
    : null;

  function pickDate(d) { setSelDate(d); setSelClass(null); }
  function calPrev() { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); setSelDate(null); setSelClass(null); }
  function calNext() { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); setSelDate(null); setSelClass(null); }

  function getContinueBtnText() {
    if (selDate && selClass) {
      const shortMonths = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
      let timeDisplay = "";
      if (selectedCourse) {
        timeDisplay = " à " + new Date(selectedCourse.dateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
      return `Continuer · ${shortMonths[calMonth]} ${selDate}${timeDisplay} - ${selClass}`;
    }
    if (selDate) return 'Sélectionner une Classe';
    return 'Sélectionner une Date';
  }

  async function goStep(n) {
    if (n === 2 && (!selDate || !selClass)) return;
    if (n === 3) {
      const result = window.Schemas.booking.safeParse({ firstName: prenom.trim(), lastName: nom.trim(), email: email.trim() });
      if (!result.success) {
        alert(window.formatZodError(result.error));
        return;
      }
      if (!selectedCourse) { alert('Classe introuvable.'); return; }
      if (CoursesDB.spotsLeft(selectedCourse) === 0) { alert('Cette classe est maintenant complète.'); return; }
      try {
        await api.post('/reservations', { firstName: result.data.firstName, lastName: result.data.lastName, email: result.data.email, courseId: selectedCourse.id, status: 'CONFIRMED' });
        refreshCourses();
      } catch (e) { console.error(e); alert('Erreur lors de la réservation.'); return; }
    }
    setStep(n);
  }

  function resetBooking() { setSelDate(null); setSelClass(null); setNom(''); setPrenom(''); setEmail(''); setStep(1); }

  // Expose goToBooking for external calls (from CoursesGrid)
  React.useEffect(() => {
    window.__goToBooking = (course) => {
      const dt = new Date(course.dateTime);
      setCalYear(dt.getFullYear());
      setCalMonth(dt.getMonth());
      setSelDate(dt.getDate());
      setSelClass(course.title);
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    };
  }, []);

  return (
    <section id="booking">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p className="label fade-up">Réservations</p>
        <h2 className="section-title fade-up" style={{ color: 'white', marginTop: 10 }}>Réserver Votre <em style={{ fontStyle: 'italic', color: 'var(--sand)' }}>Séance</em></h2>
      </div>
      <div className="steps fade-up">
        <div className={`step-dot${step > 1 ? ' done' : step === 1 ? ' active' : ''}`}>1</div>
        <span className={`step-label${step === 1 ? ' active' : ''}`}>Choisir</span>
        <div className="step-sep"></div>
        <div className={`step-dot${step > 2 ? ' done' : step === 2 ? ' active' : ''}`}>2</div>
        <span className={`step-label${step === 2 ? ' active' : ''}`}>Détails</span>
        <div className="step-sep"></div>
        <div className={`step-dot${step === 3 ? ' active' : ''}`}>3</div>
        <span className={`step-label${step === 3 ? ' active' : ''}`}>Confirmer</span>
      </div>

      <div className="booking-glass fade-up">
        {/* Step 1 */}
        <div className={`booking-step${step === 1 ? ' active' : ''}`}>
          <div className="booking-grid">
            <div>
              <div className="cal-header">
                <span className="cal-month">{months[calMonth]} {calYear}</span>
                <div className="cal-nav">
                  <button onClick={calPrev}>‹</button>
                  <button onClick={calNext}>›</button>
                </div>
              </div>
              <div className="cal-grid">
                {days.map((d,i) => <div key={`lbl-${i}`} className="cal-day-label">{d}</div>)}
                {Array.from({ length: firstDay }).map((_,i) => <div key={`blank-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_,i) => {
                  const d = i + 1;
                  const isPast = new Date(calYear, calMonth, d) < new Date(todayY, todayM, todayD);
                  const isSel = d === selDate;
                  return (
                    <div key={d} className={`cal-day${isPast ? ' past' : ''}${isSel ? ' selected' : ''}`} onClick={() => !isPast && pickDate(d)}>
                      {d}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="section-sublabel" style={{ marginTop: 0 }}>Type de Classe</p>
              <div className="class-types">
                {!selDate ? (
                  <p style={{ color: 'var(--sand)', fontStyle: 'italic' }}>Veuillez d'abord sélectionner une date sur le calendrier.</p>
                ) : availableCourses.length === 0 ? (
                  <p style={{ color: 'var(--sand)', fontStyle: 'italic' }}>Aucune classe disponible à cette date.</p>
                ) : availableCourses.map(c => {
                  const spots = CoursesDB.spotsLeft(c);
                  const available = spots > 0;
                  const timeStr = new Date(c.dateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <button key={c.id} className={`class-type-btn${c.title === selClass ? ' active' : ''}${!available ? ' disabled' : ''}`}
                            onClick={() => available && setSelClass(c.title)} disabled={!available}>
                      {c.title} — {timeStr}{!available ? ' (Complet)' : ''}
                    </button>
                  );
                })}
              </div>
              <button className={`btn-continue${selDate && selClass ? ' ready' : ''}`} onClick={() => goStep(2)}>
                {getContinueBtnText()}
              </button>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`booking-step${step === 2 ? ' active' : ''}`}>
          <div className="booking-form">
            <div className="booking-summary">
              <strong>{selClass}</strong><br/>
              <span style={{ color: 'var(--sand)' }}>{selectedCourse ? `${months[calMonth]} ${selDate} à ${new Date(selectedCourse.dateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : ''}</span><br/>
              <span style={{ color: 'var(--sand)' }}>{selectedCourse ? (selectedCourse.price ? selectedCourse.price.toLocaleString('fr-FR') + ' DA' : 'Prix non défini') : ''}</span>
            </div>
            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Nom</label>
                <input type="text" placeholder="Amira" value={nom} onChange={e => setNom(e.target.value)}/>
              </div>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Prénom</label>
                <input type="text" placeholder="Sofia" value={prenom} onChange={e => setPrenom(e.target.value)}/>
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="sofia@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="form-btns">
              <button className="btn-back" onClick={() => goStep(1)}>← Retour</button>
              <button className="btn-confirm" onClick={() => goStep(3)}>Confirmer</button>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`booking-step${step === 3 ? ' active' : ''}`}>
          <div className="booking-done">
            <div className="done-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="done-title">Séance Réservée</h3>
            <p className="done-detail">{selClass}</p>
            <p className="done-date">{months[calMonth]} {selDate}{selectedCourse ? ` · ${new Date(selectedCourse.dateTime).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}` : ''}</p>
            <button className="btn-again" onClick={resetBooking}>Réserver une Autre</button>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ── Testimonials Section ──────────────────────── */
function Testimonials() {
  const [idx, setIdx] = React.useState(0);
  const [fade, setFade] = React.useState(true);
  const [testimonials, setTestimonials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const timerRef = React.useRef(null);
  const tsX = React.useRef(0);

  React.useEffect(() => {
    ContentDB.getTestimonials().then(res => {
      setTestimonials(res || []);
      setLoading(false);
    });
  }, []);

  const goTo = React.useCallback((i) => {
    if (testimonials.length === 0) return;
    setFade(false);
    setTimeout(() => { setIdx(i); setFade(true); }, 200);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => goTo((i + 1) % testimonials.length), 5000);
  }, [testimonials]);

  React.useEffect(() => {
    if (testimonials.length === 0) return;
    timerRef.current = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % testimonials.length;
        setFade(false);
        setTimeout(() => setFade(true), 200);
        return next;
      });
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [testimonials]);

  if (loading) {
    return (
      <section id="testimonials">
        <div className="testimonials-inner">
           <div className="ui-skeleton" style={{ height: '150px', width: '100%', maxWidth: '600px', margin: '0 auto' }}></div>
        </div>
      </section>
    );
  }
  if (testimonials.length === 0) return null;
  const t = testimonials[idx] || testimonials[0];

  return (
    <section id="testimonials"
      onTouchStart={e => { tsX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - tsX.current;
        if (Math.abs(dx) > 50) goTo(dx < 0 ? (idx + 1) % testimonials.length : (idx - 1 + testimonials.length) % testimonials.length);
      }}
    >
      <div className="testimonials-inner">
        <div className="quote-mark fade-up">"</div>
        <div className="testimonial-text fade-up" style={{ opacity: fade ? 1 : 0, transform: fade ? 'none' : 'translateY(20px)', transition: 'opacity .5s, transform .5s' }}>{t.text}</div>
        <div className="testimonial-name fade-up">{t.name}</div>
        <div className="testimonial-role fade-up">{t.role}</div>
        <div className="testi-dots">
          {testimonials.map((_, i) => (
            <button key={i} className={`testi-dot${i === idx ? ' active' : ''}`} onClick={() => goTo(i)}></button>
          ))}
        </div>
        <p className="swipe-hint">← Glisser pour naviguer →</p>
      </div>
    </section>
  );
}
/* ── Gallery Section ───────────────────────────── */
function Gallery() {
  const [gallery, setGallery] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    ContentDB.getGallery().then(res => {
        setGallery(res || []);
        setLoading(false);
    });
  }, []);

  return (
    <section id="community">
      <div className="section-header" style={{ textAlign: 'center' }}>
        <p className="label fade-up">@souplesse.pilates · 15k Followers</p>
        <h2 className="section-title fade-up">Notre Communauté</h2>
      </div>
      <div className="gallery-grid" id="galleryGrid">
        {loading ? (
             [1,2,3,4,5,6].map(i => (
                 <div key={i} className="gallery-cell ui-skeleton" style={{ height: '300px' }}></div>
             ))
        ) : gallery.map((g, i) => (
          <div key={i} className="gallery-cell fade-up">
            <img src={g.imageUrl} alt={g.caption} loading="lazy"/>
            {g.featured && <div className="gallery-studio-tag">Studio</div>}
            <div className="gallery-hover">
              <div className="gallery-likes">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                {g.likes.toLocaleString()}
              </div>
              <div className="gallery-caption">{g.caption}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <a href="https://instagram.com" target="_blank" className="ig-link">Suivre sur Instagram <span>→</span></a>
      </div>
    </section>
  );
}
