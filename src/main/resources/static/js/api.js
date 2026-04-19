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
                    localStorage.removeItem('souplesse_jwt');
                    window.location.href = '/login.html';
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
