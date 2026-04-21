const API_BASE = '';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('souplesse_jwt');
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        
        if (token && !endpoint.includes('/auth/login')) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, config);
            if (!response.ok) {
                if (response.status === 401) {
                    // Only logout on real 401 Unauthorized errors
                    if (window.useAuthStore) {
                        window.useAuthStore.getState().logout();
                    } else {
                        localStorage.removeItem('souplesse_jwt');
                    }
                    window.location.hash = '#/login';
                }
                
                // For other errors (500, etc.), parse message and re-throw
                let errorData;
                try {
                     errorData = await response.json();
                } catch(e) {
                     errorData = { message: `Erreur Serveur: ${response.status} ${response.statusText}` };
                }
                
                // Notify the user if toast is available
                if (window.useToastStore) {
                    window.useToastStore.getState().showToast(errorData.message || errorData.error || "Une erreur est survenue", "error");
                }
                
                throw errorData;
            }
            
            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`API Request to ${endpoint} failed:`, error);
            throw error;
        }
    },
    
    get(endpoint) { return this.request(endpoint); },
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
};
/* ── State Management ────────────────────────────────────────
   Inline Zustand-compatible `create` — no CDN dependency.
   Uses React.useSyncExternalStore (React 18 built-in).
───────────────────────────────────────────────────────────── */

function create(initializer) {
  let state;
  const listeners = new Set();

  const setState = (partial) => {
    const next = typeof partial === 'function' ? partial(state) : partial;
    if (next !== state) {
      state = Object.assign({}, state, next);
      listeners.forEach(l => l());
    }
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // initialize
  state = initializer(setState, getState, { getState, setState, subscribe });

  // React hook  (works with React 18's useSyncExternalStore)
  const useStore = (selector = s => s) =>
    React.useSyncExternalStore(subscribe, () => selector(getState()));
  useStore.getState  = getState;
  useStore.setState  = setState;
  useStore.subscribe = subscribe;
  return useStore;
}

window.useAuthStore = create((set) => ({
  token: localStorage.getItem('souplesse_jwt'),
  setToken: (token) => { localStorage.setItem('souplesse_jwt', token); set({ token }); },
  logout: () => { localStorage.removeItem('souplesse_jwt'); set({ token: null }); }
}));

window.useToastStore = create((set) => ({
  message: '',
  type: 'info',
  visible: false,
  showToast: (message, type = 'info') => {
    set({ message, type, visible: true });
    setTimeout(() => set({ visible: false }), 3000);
  },
  hideToast: () => set({ visible: false })
}));

window.useCourseStore = create((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  removeCourse: (id) => set((state) => ({ courses: state.courses.filter(c => c.id !== id) })),
  updateCourse: (id, updated) => set((state) => ({ courses: state.courses.map(c => c.id === id ? updated : c) }))
}));

window.useClientStore = create((set) => ({
  clients: [],
  setClients: (clients) => set({ clients }),
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  removeClient: (id) => set((state) => ({ clients: state.clients.filter(c => c.id !== id) }))
}));

window.useBookingStore = create((set) => ({
  selectedCourse: null,
  clientDetails: { firstName: '', lastName: '', email: '', phone: '' },
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setClientDetails: (details) => set({ clientDetails: details }),
  reset: () => set({ selectedCourse: null, clientDetails: { firstName: '', lastName: '', email: '', phone: '' } })
}));

/* ── Zod Validation ────────────────────────────────────────────
   Global Zod schemas for forms.
   Assumes window.Zod is exposed by the unpkg CDN.
───────────────────────────────────────────────────── */

const z = window.Zod ? window.Zod.z : null;
if (!z) console.error('[Souplesse] Zod CDN failed to load. Form validation will be skipped.');

window.Schemas = z ? {
  login: z.object({
    email: z.string().email("Veuillez entrer une adresse email valide."),
    password: z.string().min(1, "Le mot de passe est requis.")
  }),

  course: z.object({
    title: z.string().min(2, "Le nom de la classe est requis."),
    coachFirstName: z.string().min(2, "Prénom du coach requis."),
    coachLastName: z.string().min(2, "Nom du coach requis."),
    coachEmail: z.string().email("Email invalide.").optional().or(z.literal('')),
    dateTime: z.string().min(10, "Date et heure requises."),
    capacity: z.coerce.number().min(1, "La capacité doit être au moins de 1."),
    description: z.string().min(5, "Description requise."),
    image: z.string().url("URL d'image invalide.").optional().or(z.literal('')),
    price: z.coerce.number().optional()
  }),

  client: z.object({
    firstName: z.string().min(2, "Le prénom est requis."),
    lastName: z.string().min(2, "Le nom est requis."),
    email: z.string().email("Adresse email invalide."),
    phone: z.string().regex(/^(0)(5|6|7)[0-9]{8}$/, "Ex: 0555123456").optional().or(z.literal(''))
  }),

  booking: z.object({
    firstName: z.string().min(2, "Le prénom est requis."),
    lastName: z.string().min(2, "Le nom est requis."),
    email: z.string().email("Adresse email invalide.")
  })
} : null;

/**
 * Helper formatter to extract first error message from ZodError array
 */
window.formatZodError = (zodError) => {
  return zodError.errors[0]?.message || "Erreur de validation.";
};
/* ── COURSES DATA MODULE (API Integrated) ─────────────────────────────
   Shared between index.html (client) and admin.html (manager).
─────────────────────────────────────────────────────── */

const CoursesDB = {
  async getAll() {
    try {
      // For admin page, we need /admin/courses (SPA uses HashRouter)
      const isViewingAdmin = window.location.hash.includes('admin');
      const endpoint = isViewingAdmin ? '/admin/courses' : '/courses';
      const data = await api.get(endpoint);
      return data.map(c => ({
          ...c,
          coach: c.coachFirstName ? `${c.coachFirstName} ${c.coachLastName}` : '',
          dateTime: `${c.date}T${c.time}`,
          image: c.imageUrl
      }));
    } catch (e) {
      console.error("Failed to load courses", e);
      return [];
    }
  },
  
  async add(courseData) {
    try {
        const payload = {
            type: courseData.type || 'PILATES',
            title: courseData.title,
            coachFirstName: courseData.coachFirstName,
            coachLastName: courseData.coachLastName,
            coachEmail: courseData.coachEmail,
            description: courseData.description || ' ',
            price: Number(courseData.price),
            date: courseData.dateTime.split('T')[0],
            time: courseData.dateTime.split('T')[1],
            capacity: Number(courseData.capacity),
            imageUrl: courseData.image || null,
            instructorId: Number(courseData.instructorId)
        };
        await api.post('/admin/courses', payload);
        return true;
    } catch (e) {
        console.error("Failed to add course", e);
        throw e;
    }
  },
  
  async update(id, courseData) {
    try {
        const payload = {
            type: courseData.type || 'PILATES',
            title: courseData.title,
            coachFirstName: courseData.coachFirstName,
            coachLastName: courseData.coachLastName,
            coachEmail: courseData.coachEmail,
            description: courseData.description || ' ',
            price: Number(courseData.price),
            date: courseData.dateTime.split('T')[0],
            time: courseData.dateTime.split('T')[1],
            capacity: Number(courseData.capacity),
            imageUrl: courseData.image || null,
            instructorId: Number(courseData.instructorId)
        };
        await api.put(`/admin/courses/${id}`, payload);
        return true;
    } catch (e) {
        console.error("Failed to update course", e);
        throw e;
    }
  },
  
  async remove(id) {
    try {
        await api.delete(`/admin/courses/${id}`);
        return true;
    } catch (e) {
        console.error("Failed to delete course", e);
        throw e;
    }
  },
  
  bookSpot(id) {
    // Not needed. Backend automatically increments reservedSpots on reservation creation.
    return true; 
  },
  
  spotsLeft(course) {
    return course.capacity - (course.reservedSpots || 0); 
  },

  exportToXLSX(data) {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    const exportData = data.map(c => ({
      'Classe': c.title || c.type,
      'Coach': `${c.coachFirstName || ''} ${c.coachLastName || ''}`,
      'Date': c.date,
      'Heure': c.time,
      'Prix': c.price,
      'Capacité': c.capacity,
      'Réservés': c.reservedSpots || 0
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Classes");
    XLSX.writeFile(wb, "souplesse_classes.xlsx");
  },

  downloadTemplate() {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    const headers = [['Classe', 'Coach Prénom', 'Coach Nom', 'Coach Email', 'Type', 'Description', 'Prix', 'Date', 'Heure', 'Capacité', 'Id Instructeur']];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Modèle Classes");
    XLSX.writeFile(wb, "modele_import_classes.xlsx");
  },

  async importFromXLSX(file) {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const ab = e.target.result;
          const wb = XLSX.read(ab);
          const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          let success = 0;
          for (const r of data) {
            await this.add({
              title: r['Classe'],
              coachFirstName: r['Coach Prénom'],
              coachLastName: r['Coach Nom'],
              coachEmail: r['Coach Email'],
              type: r['Type'] || 'PILATES',
              description: r['Description'] || 'Imported course',
              price: r['Prix'],
              dateTime: `${r['Date']}T${r['Heure']}`,
              capacity: r['Capacité'],
              instructorId: r['Id Instructeur']
            });
            success++;
          }
          alert(`${success} classes importées avec succès.`);
          resolve(true);
        } catch (err) {
          alert("Erreur lors de l'import: " + err.message);
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
};

const InstructorsDB = {
  async getAll() {
    try {
      return await api.get('/admin/instructors');
    } catch (e) {
      console.error('Failed to load instructors', e);
      return [];
    }
  },
  
  async add(data) {
    try {
      await api.post('/admin/instructors', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password || 'Pilates2024!', // Default if not provided
        role: 'INSTRUCTOR'
      });
      return true;
    } catch (e) {
      console.error('Failed to add instructor', e);
      throw e;
    }
  },

  async update(id, data) {
    try {
      await api.put(`/admin/instructors/${id}`, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      });
      return true;
    } catch (e) {
      console.error('Failed to update instructor', e);
      throw e;
    }
  },

  async remove(id) {
    try {
      await api.delete(`/admin/instructors/${id}`);
      return true;
    } catch (e) {
      console.error('Failed to delete instructor', e);
      throw e;
    }
  },

  exportToXLSX(data) {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    const exportData = data.map(i => ({
      'Prénom': i.firstName,
      'Nom': i.lastName,
      'Email': i.email,
      'Date Inscription': i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '—'
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Instructeurs");
    XLSX.writeFile(wb, "souplesse_instructeurs.xlsx");
  },

  downloadTemplate() {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    const headers = [['Prénom', 'Nom', 'Email']];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Modèle Instructeurs");
    XLSX.writeFile(wb, "modele_import_instructeurs.xlsx");
  },

  async importFromXLSX(file) {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const ab = e.target.result;
          const wb = XLSX.read(ab);
          const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          let success = 0;
          for (const r of data) {
            await this.add({
              firstName: r['Prénom'],
              lastName: r['Nom'],
              email: r['Email']
            });
            success++;
          }
          alert(`${success} instructeurs importés.`);
          resolve(true);
        } catch (err) {
          alert("Erreur import: " + err.message);
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
};

/* ── CLIENTS API ────────────────────────────────────── */

const ClientsDB = {
  async getAll() { 
    try {
      const isViewingAdmin = window.location.hash.includes('admin');
      const endpoint = isViewingAdmin ? '/admin/reservations' : '/reservations';
      return await api.get(endpoint);
    } catch (e) {
      console.error("Failed to fetch clients", e);
      return [];
    }
  },
  
  async add(client) { 
    try {
      const payload = {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          courseId: client.courseId
      };
      await api.post('/reservations', payload);
      return true;
    } catch (e) {
      console.error("Failed to add client/reservation", e);
      throw e;
    }
  },
  
  async remove(id) { 
    try {
      const isViewingAdmin = window.location.hash.includes('admin');
      const endpoint = isViewingAdmin ? `/admin/reservations/${id}` : `/reservations/${id}`;
      await api.delete(endpoint);
      return true;
    } catch (e) {
      console.error("Failed to delete client", e);
      throw e;
    }
  },

  exportToXLSX(data) {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    const exportData = data.map(cl => ({
      'Prénom': cl.firstName,
      'Nom': cl.lastName,
      'Email': cl.email,
      'Classe': cl.courseType || 'Classe #' + cl.courseId,
      'Date Réservation': cl.bookedAt ? new Date(cl.bookedAt).toLocaleDateString() : '—'
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Réservations");
    XLSX.writeFile(wb, "souplesse_reservations.xlsx");
  },

  downloadTemplate() {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    const headers = [['Prénom', 'Nom', 'Email', 'Id Cours']];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Modèle Réservations");
    XLSX.writeFile(wb, "modele_import_reservations.xlsx");
  },

  async importFromXLSX(file) {
    if (!window.XLSX) return alert("Bibliothèque XLSX non chargée.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const ab = e.target.result;
          const wb = XLSX.read(ab);
          const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          let success = 0;
          for (const r of data) {
            await this.add({
              firstName: r['Prénom'],
              lastName: r['Nom'],
              email: r['Email'],
              courseId: r['Id Cours']
            });
            success++;
          }
          alert(`${success} réservations importées.`);
          resolve(true);
        } catch (err) {
          alert("Erreur import: " + err.message);
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
};
const ContentDB = {
  async getStudioImages() {
    try {
      const data = await api.get('/api/content/studio-images');
      return data.sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (e) { return []; }
  },
  async getTestimonials() {
    try {
      const data = await api.get('/api/content/testimonials');
      return data.sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (e) { return []; }
  },
  async getGallery() {
    try {
      const data = await api.get('/api/content/gallery');
      return data.sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (e) { return []; }
  }
};

// Global Exports
window.CoursesDB = CoursesDB;
window.InstructorsDB = InstructorsDB;
window.ClientsDB = ClientsDB;
window.ContentDB = ContentDB;

window.SEOManager = {
    set({ title, description, image, url }) {
        const fullTitle = title ? `${title} | Souplesse Pilates` : 'Souplesse — Pilates Studio';
        document.title = fullTitle;

        const updateTag = (selector, attr, content) => {
            if (!content) return;
            const el = document.querySelector(selector);
            if (el) el.setAttribute(attr, content);
        };

        updateTag('meta[name="description"]', 'content', description);
        updateTag('meta[property="og:title"]', 'content', fullTitle);
        updateTag('meta[property="og:description"]', 'content', description);
        updateTag('meta[property="og:image"]', 'content', image);
        updateTag('meta[property="og:url"]', 'content', url);
        updateTag('meta[property="twitter:title"]', 'content', fullTitle);
        updateTag('meta[property="twitter:description"]', 'content', description);
        updateTag('meta[property="twitter:image"]', 'content', image);
    }
};

window.useFadeUp = (dependency = []) => {
  React.useEffect(() => {
    function observeFadeUps() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "-60px" });
      document.querySelectorAll('.fade-up:not(.visible)').forEach(el => observer.observe(el));
    }
    const timer = setTimeout(observeFadeUps, 300);
    return () => clearTimeout(timer);
  }, dependency);
};