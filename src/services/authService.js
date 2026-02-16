import api from '../api/axios';

class AuthService {
  async signup(userData) {
    try {
      const response = await api.post('/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      console.log('Raw login response:', response.data);
      
      if (response.data.success) {
        // Store the user data
        const userData = {
          userId: response.data.userId,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
          success: response.data.success,
          message: response.data.message
        };
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User stored in localStorage:', userData);
        return userData;
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async adminLogin(credentials) {
    try {
      const response = await api.post('/admin-login', credentials);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify({
          ...response.data,
          role: 'ADMIN'
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

   async adminForgotPassword(email) {
    try {
      const response = await api.post('/admin/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Admin forgot password error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async adminResetPassword(token, newPassword) {
    try {
      const response = await api.post('/admin/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('Admin reset password error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
  
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  getCurrentUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    const user = this.getCurrentUserFromStorage();
    return !!user;
  }

  isAdmin() {
    const user = this.getCurrentUserFromStorage();
    return user?.role === 'ADMIN';
  }

  isCustomer() {
    const user = this.getCurrentUserFromStorage();
    return user?.role === 'CUSTOMER';
  }
}

export default new AuthService();