    /* ── CLIENT BOOKING LOGIC ────────────────────────────
        Reads courses from backend API.
        Sends reservations to backend API.
        ─────────────────────────────────────────────────────── */

    let selectedCourseId = null;
    let liveCourses      = [];

    /* ── INIT ───────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderCourses();
    setupPageInteractions();
    });

    /* ── LOAD COURSES FROM API ──────────────────────────── */
    async function loadAndRenderCourses() {
    try {
        liveCourses = await CoursesAPI.getAvailable();
        renderCoursesGrid();
        populateBookingClasses();
    } catch (err) {
        console.error('Error loading courses:', err);
        const grid = document.getElementById('coursesGrid');
        if (grid) grid.innerHTML = `<p style="text-align:center;color:#999;padding:40px;">Erreur de chargement des classes. Vérifiez que le serveur est démarré.</p>`;
    }
    }

    /* ── RENDER COURSES GRID (Classes Section) ──────────── */
    function renderCoursesGrid() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (liveCourses.length === 0) {
        grid.innerHTML = `<p style="text-align:center;color:#999;padding:40px;">Aucune classe disponible pour le moment.</p>`;
        return;
    }

    liveCourses.forEach(course => {
        const spots   = course.capacity - (course.reservedSpots || 0);
        const full    = spots <= 0 || course.status === 'FULL';
        const dateStr = new Date(course.date).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long'
        });
        const timeStr = course.time ? course.time.slice(0, 5) : '';

        const card = document.createElement('article');
        card.className = `class-card ${full ? 'class-card--full' : ''}`;
        card.dataset.id = course.id;

        card.innerHTML = `
        <div class="class-card__header">
            <span class="class-card__spots ${spots <= 2 && !full ? 'class-card__spots--low' : ''} ${full ? 'class-card__spots--full' : ''}">
            ${full ? 'Complet' : `${spots} place${spots > 1 ? 's' : ''} restante${spots > 1 ? 's' : ''}`}
            </span>
        </div>
        <h3 class="class-card__title">${course.type}</h3>
        <div class="class-card__meta">
            <span class="class-card__datetime">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${dateStr} · ${timeStr}
            </span>
        </div>
        <p class="class-card__desc">${course.description}</p>
        <button class="class-card__btn ${full ? 'class-card__btn--disabled' : ''}" onclick="openBookingModal(${course.id})" ${full ? 'disabled' : ''}>
            ${full ? 'Classe Complète' : 'Réserver'}
        </button>
        `;
        grid.appendChild(card);
    });
    }

    /* ── POPULATE BOOKING CLASSES ──────────────────────── */
    function populateBookingClasses() {
    const classTypes = document.getElementById('classTypes');
    if (!classTypes) return;

    classTypes.innerHTML = '';
    const typeSet = new Set(liveCourses.map(c => c.type));
    
    typeSet.forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'class-type-btn';
        btn.textContent = type;
        btn.onclick = () => selectClass(type);
        classTypes.appendChild(btn);
    });
    }

    /* ── MODAL ──────────────────────────────────────────── */
    function openBookingModal(courseId) {
    const course = liveCourses.find(c => c.id === courseId);
    if (!course) return;
    selectedCourseId = courseId;

    const spots   = course.capacity - (course.reservedSpots || 0);
    const dateStr = new Date(course.date).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    const timeStr = course.time ? course.time.slice(0, 5) : '';

    document.getElementById('modalClassName').textContent  = course.type;
    document.getElementById('modalDateTime').textContent   = `${dateStr} à ${timeStr}`;
    document.getElementById('modalSpotsLeft').textContent  = `${spots} place(s) restante(s)`;

    ['modalFirstName','modalLastName','modalEmail'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const modal = document.getElementById('bookingModal');
    if (modal) modal.style.display = 'flex';
    }

    function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.style.display = 'none';
    }

    async function submitBooking() {
    const firstName = document.getElementById('modalFirstName')?.value.trim();
    const lastName  = document.getElementById('modalLastName')?.value.trim();
    const email     = document.getElementById('modalEmail')?.value.trim();

    if (!firstName || !lastName || !email) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    try {
        // Call correct API method with individual parameters
        await ReservationsAPI.book(firstName, lastName, email, selectedCourseId);
        alert('✓ Réservation confirmée ! Un email de confirmation vous a été envoyé.');
        closeBookingModal();
        selectedCourseId = null;
        await loadAndRenderCourses();
    } catch (err) {
        const errorMsg = err.message.includes('booking already exists')
        ? 'Vous avez déjà réservé cette classe avec cet email.'
        : err.message.includes('fully booked')
        ? 'Désolé, cette classe est maintenant complète.'
        : err.message || 'Impossible de réserver';
        alert('Erreur: ' + errorMsg);
    }
    }

    /* ── PAGE INTERACTIONS ──────────────────────────────── */
    function setupPageInteractions() {
    // Modal close on backdrop click
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBookingModal();
        });
    }

    // Newsletter subscribe
    const nlForm = document.getElementById('newsletterForm');
    if (nlForm) {
        nlForm.style.display = 'flex';
    }

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
        mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
        });
    }
    }

    function closeMobile() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.style.display = 'none';
    }

    function subscribeNewsletter() {
    const email = document.getElementById('nlEmail')?.value.trim();
    if (!email) return;
    const thanks = document.getElementById('nlThanks');
    if (thanks) thanks.style.display = 'block';
    if (document.getElementById('nlEmail')) document.getElementById('nlEmail').value = '';
    }

    /* ── SELECT CLASS TYPE (for filtering in modal) ────── */
    function selectClass(type) {
    // Filter courses by selected type
    const filtered = liveCourses.filter(c => c.type === type);
    console.log(`Selected class type: ${type}`, filtered);
    // Can be extended to filter/update modal display if needed
    }