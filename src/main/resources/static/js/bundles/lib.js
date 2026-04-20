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
                    // Critical: Use the store to clear state across the whole app
                    if (window.useAuthStore) {
                        window.useAuthStore.getState().logout();
                    } else {
                        localStorage.removeItem('souplesse_jwt');
                    }
                    window.location.hash = '#/login';
                }
                // Ignore empty bodies for errors
                let errorData;
                try {
                     errorData = await response.json();
                } catch(e) {
                     errorData = { message: `API Error: ${response.status} ${response.statusText}` };
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
            instructorId: courseData.instructorId || 1
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
            instructorId: courseData.instructorId || 1
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
};const ContentDB = {
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