import api from '../api/axios';

class PlantService {
  async getAllPlants() {
    try {
      const response = await api.get('/plants');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getPlantById(id) {
    try {
      const response = await api.get(`/plants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Admin endpoints
  async addPlant(plantData) {
    try {
      const response = await api.post('/admin/plants', plantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async updatePlant(id, plantData) {
    try {
      const response = await api.put(`/admin/plants/${id}`, plantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async deletePlant(id) {
    try {
      const response = await api.delete(`/admin/plants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getAllPlantsAdmin() {
    try {
      const response = await api.get('/admin/plants');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

   async getAllPlantsPaginated(page = 0, size = 10, sortBy = 'name') {
    try {
      const response = await api.get('/admin/plants/paginated', {
        params: { page, size, sortBy }
      });
      return response.data;
    } catch (error) {
      console.error('Get paginated plants error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
  
  async searchPlants(name) {
    try {
      const response = await api.get('/admin/plants/search', { params: { name } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new PlantService();