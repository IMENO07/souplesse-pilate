/* ── COURSES DATA MODULE (API Integrated) ─────────────────────────────
   Shared between index.html (client) and admin.html (manager).
─────────────────────────────────────────────────────── */

const CoursesDB = {
  async getAll() {
    try {
      // For admin page, we might need /admin/courses if we want ALL courses, 
      // but /courses returns available courses. Let's decide based on path.
      const endpoint = window.location.pathname.includes('admin') ? '/admin/courses' : '/courses';
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
      return await api.get('/admin/reservations');
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
      await api.delete(`/admin/reservations/${id}`);
      return true;
    } catch (e) {
      console.error("Failed to delete client", e);
      throw e;
    }
  },
};