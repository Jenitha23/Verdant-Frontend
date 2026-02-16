import api from '../api/axios';

class OrderService {
  async placeOrder() {
    try {
      const response = await api.post('/orders/place');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getOrderHistory() {
    try {
      const response = await api.get('/orders/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Admin endpoints
  async getAllOrders() {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order by id error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  // Admin methods
  async getAllOrders() {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      console.error('Get all orders error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async getAdminOrderById(orderId) {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get admin order by id error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new OrderService();