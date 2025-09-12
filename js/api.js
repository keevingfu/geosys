/**
 * Dymesty Content Intelligence Center - API Service Layer
 * Handles all API communication with proper authentication and error handling
 */

class ApiService {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:4000' 
            : '/api';
        this.token = localStorage.getItem('authToken');
    }

    // Authentication headers
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Handle API responses
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                this.logout();
                window.location.href = '/login.html';
                throw new Error('Session expired. Please login again.');
            }
            
            const error = isJson && data.error ? data.error : `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(error);
        }

        return data;
    }

    // Check authentication status
    isAuthenticated() {
        if (!this.token) return false;
        
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        if (!sessionExpiry) return false;
        
        return new Date().getTime() < parseInt(sessionExpiry);
    }

    // Logout
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('sessionExpiry');
        localStorage.removeItem('currentUser');
        this.token = null;
    }

    // ===== Authentication Endpoints =====

    async login(email, password) {
        const response = await fetch(`${this.baseURL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await this.handleResponse(response);
        
        // Store authentication data
        this.token = data.token;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Calculate session expiry
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
        const sessionExpiry = tokenPayload.exp * 1000;
        localStorage.setItem('sessionExpiry', sessionExpiry.toString());
        
        return data;
    }

    async register(email, username, password) {
        const response = await fetch(`${this.baseURL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });
        
        return this.handleResponse(response);
    }

    async refreshToken() {
        const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        });
        
        const data = await this.handleResponse(response);
        
        // Update token
        this.token = data.token;
        localStorage.setItem('authToken', data.token);
        
        return data;
    }

    async getCurrentUser() {
        const response = await fetch(`${this.baseURL}/api/auth/me`, {
            headers: this.getAuthHeaders()
        });
        
        return this.handleResponse(response);
    }

    async changePassword(currentPassword, newPassword) {
        const response = await fetch(`${this.baseURL}/api/auth/change-password`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        return this.handleResponse(response);
    }

    // ===== Content Management Endpoints =====

    async getDashboard() {
        const response = await fetch(`${this.baseURL}/api/dashboard`, {
            headers: this.getAuthHeaders()
        });
        
        return this.handleResponse(response);
    }

    async getContent(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${this.baseURL}/api/content?${queryString}`, {
            headers: this.getAuthHeaders()
        });
        
        return this.handleResponse(response);
    }

    async getContentById(id) {
        const response = await fetch(`${this.baseURL}/api/content/${id}`, {
            headers: this.getAuthHeaders()
        });
        
        return this.handleResponse(response);
    }

    async createContent(data) {
        const response = await fetch(`${this.baseURL}/api/content`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        return this.handleResponse(response);
    }

    async updateContent(id, data) {
        const response = await fetch(`${this.baseURL}/api/content/${id}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        return this.handleResponse(response);
    }

    async deleteContent(id) {
        const response = await fetch(`${this.baseURL}/api/content/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
        
        return this.handleResponse(response);
    }

    // ===== Analytics Endpoints =====

    async getAnalytics(startDate, endDate) {
        const params = new URLSearchParams({ startDate, endDate });
        const response = await fetch(`${this.baseURL}/api/analytics/overview?${params}`, {
            headers: this.getAuthHeaders()
        });
        
        return this.handleResponse(response);
    }

    // ===== AI Platform Endpoints =====

    async getAIPlatforms() {
        const response = await fetch(`${this.baseURL}/api/ai-platforms/performance`, {
            headers: this.getAuthHeaders()
        });
        
        return this.handleResponse(response);
    }

    async submitToAIPlatform(platformId, contentId) {
        const response = await fetch(`${this.baseURL}/api/ai-platforms/${platformId}/submit`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ contentId })
        });
        
        return this.handleResponse(response);
    }

    // ===== File Upload =====

    async uploadFile(file, onProgress) {
        const formData = new FormData();
        formData.append('file', file);
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // Progress tracking
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }
            
            xhr.addEventListener('load', async () => {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(response);
                    } else {
                        reject(new Error(response.error || 'Upload failed'));
                    }
                } catch (error) {
                    reject(new Error('Invalid response from server'));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });
            
            xhr.open('POST', `${this.baseURL}/api/upload`);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(formData);
        });
    }
}

// Create singleton instance
const api = new ApiService();

// Auto-refresh token before expiry
setInterval(async () => {
    if (api.isAuthenticated()) {
        const sessionExpiry = parseInt(localStorage.getItem('sessionExpiry'));
        const timeUntilExpiry = sessionExpiry - new Date().getTime();
        
        // Refresh token if less than 5 minutes until expiry
        if (timeUntilExpiry < 5 * 60 * 1000) {
            try {
                await api.refreshToken();
            } catch (error) {
                console.error('Token refresh failed:', error);
            }
        }
    }
}, 60000); // Check every minute