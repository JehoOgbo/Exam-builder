const API_BASE = 'http://localhost:5050/api/v0';

const api = {
    async request(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('jwt_token');
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            method,
            headers
        };
        
        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, config);
            
            // Handle non-JSON responses or empty responses safely
            let data = {};
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                const text = await response.text();
                // Just in case we need text fallback
                data = { message: text };
            }
            
            if (!response.ok) {
                return { error: data.error || data.message || 'An error occurred', status: response.status };
            }
            
            return { data, status: response.status };
        } catch (error) {
            console.error('API Error:', error);
            return { error: 'Failed to connect to the server. Is it running?' };
        }
    }
}
