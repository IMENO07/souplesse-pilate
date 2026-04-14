/* ── API SERVICE LAYER ───────────────────────────────
    Single source of truth for all backend communication.
    Base URL points to Spring Boot on port 8080.
    ─────────────────────────────────────────────────────── */

    const API_BASE = 'http://localhost:8080';

    /* ── Token helpers ──────────────────────────────────── */
    const Auth = {
    getToken()        { return localStorage.getItem('souplesse_jwt'); },
    setToken(t)       { localStorage.setItem('souplesse_jwt', t); },
    removeToken()     { localStorage.removeItem('souplesse_jwt'); },
    isLoggedIn()      { return !!localStorage.getItem('souplesse_jwt'); },
    headers() {
        const h = { 'Content-Type': 'application/json' };
        const t = Auth.getToken();
        if (t) h['Authorization'] = `Bearer ${t}`;
        return h;
    }
    };

    /* ── Core fetch wrapper ─────────────────────────────── */
    async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: Auth.headers(),
        ...options,
    });

    if (res.status === 401) {
        Auth.removeToken();
        window.location.href = 'login.html';
        return;
    }

    if (res.status === 204) return null; // No content

    const data = await res.json();

    if (!res.ok) {
        const msg = data.error || data.message || JSON.stringify(data);
        throw new Error(msg);
    }

    return data;
    }

    /* ── AUTH ───────────────────────────────────────────── */
    const AuthAPI = {
    async login(email, password) {
        const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        });
        Auth.setToken(data.token);
        return data;
    },
    logout() {
        Auth.removeToken();
        window.location.href = 'login.html';
    }
    };

    /* ── PUBLIC COURSES ─────────────────────────────────── */
    const CoursesAPI = {
    // GET /courses — available courses only (public)
    async getAvailable() {
        return await apiFetch('/courses');
    },

    // GET /admin/courses — all courses (admin)
    async getAll() {
        return await apiFetch('/admin/courses');
    },

    // POST /admin/courses
    async create(payload) {
        return await apiFetch('/admin/courses', {
        method: 'POST',
        body: JSON.stringify(payload),
        });
    },

    // PUT /admin/courses/:id
    async update(id, payload) {
        return await apiFetch(`/admin/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        });
    },

    // DELETE /admin/courses/:id
    async remove(id) {
        return await apiFetch(`/admin/courses/${id}`, {
        method: 'DELETE',
        });
    },
    };

    /* ── RESERVATIONS ───────────────────────────────────── */
    const ReservationsAPI = {
    // POST /reservations — public booking
    async book(firstName, lastName, email, courseId) {
        return await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, courseId }),
        });
    },

    // GET /admin/reservations
    async getAll() {
        return await apiFetch('/admin/reservations');
    },

    // GET /admin/reservations/course/:id
    async getByCourse(courseId) {
        return await apiFetch(`/admin/reservations/course/${courseId}`);
    },

    // DELETE /admin/reservations/:id
    async remove(id) {
        return await apiFetch(`/admin/reservations/${id}`, {
        method: 'DELETE',
        });
    },
    };

    /* ── INSTRUCTORS ────────────────────────────────────── */
    const InstructorsAPI = {
    // GET /admin/instructors
    async getAll() {
        return await apiFetch('/admin/instructors');
    },

    // POST /admin/instructors
    async create(firstName, lastName, email) {
        return await apiFetch('/admin/instructors', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email }),
        });
    },

    // PUT /admin/instructors/:id
    async update(id, firstName, lastName, email) {
        return await apiFetch(`/admin/instructors/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, email }),
        });
    },

    // DELETE /admin/instructors/:id
    async remove(id) {
        return await apiFetch(`/admin/instructors/${id}`, {
        method: 'DELETE',
        });
    },
    };