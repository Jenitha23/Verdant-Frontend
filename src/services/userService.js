import api from '../api/axios';

class UserService {
  // GET /admin/users - Get all users
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // GET /admin/users/{id} - Get user by ID
  async getUserById(id) {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user by id error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // GET /admin/users/customers - Get all customers
  async getAllCustomers() {
    try {
      const response = await api.get('/admin/users/customers');
      return response.data;
    } catch (error) {
      console.error('Get all customers error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // GET /admin/users/admins - Get all admins
  async getAllAdmins() {
    try {
      const response = await api.get('/admin/users/admins');
      return response.data;
    } catch (error) {
      console.error('Get all admins error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // GET /admin/users/stats - Get user statistics
  async getUserStats() {
    try {
      const response = await api.get('/admin/users/stats');
      return response.data;
    } catch (error) {
      console.error('Get user stats error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // GET /admin/users/search?email=&name= - Search users
  async searchUsers(params) {
    try {
      const response = await api.get('/admin/users/search', { params });
      return response.data;
    } catch (error) {
      console.error('Search users error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // PUT /admin/users/{id}/toggle-status - Enable/disable user
  async toggleUserStatus(id) {
    try {
      const response = await api.put(`/admin/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Toggle user status error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // PUT /admin/users/{id}/role - Update user role
  async updateUserRole(id, role) {
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Update user role error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // DELETE /admin/users/{id} - Delete user
  async deleteUser(id) {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
}

export default new UserService();