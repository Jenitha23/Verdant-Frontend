import api from '../api/axios';
import authService from './authService';

class CartService {
  async getCartItems() {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Get cart error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async addToCart(plantId, quantity) {
    try {
      // Get the current logged-in user
      const user = authService.getCurrentUserFromStorage();
      
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      // Send the complete CartRequest object that matches backend DTO
      const cartRequest = {
        customerId: user.userId,  // Add customerId from logged-in user
        plantId: plantId,
        quantity: quantity
      };

      console.log('Sending cart request:', cartRequest);
      
      const response = await api.post('/cart/add', cartRequest);
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async removeFromCart(cartItemId) {
    try {
      const response = await api.delete(`/cart/remove/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error('Remove from cart error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }

  async checkout() {
    try {
      const response = await api.post('/cart/checkout');
      return response.data;
    } catch (error) {
      console.error('Checkout error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
}

export default new CartService();