import { API_URL } from './apiConfig';

export const fetchTags = async (token) => {
  try {
    const response = await fetch(`${API_URL}/tags`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

export const fetchRecommendedRoutes = async (token) => {
  try {
    const response = await fetch(`${API_URL}/recommended-routes`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recommended routes');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching recommended routes:', error);
    return [];
  }
};

export const fetchCategories = async (token) => {
  try {
    const response = await fetch(`${API_URL}/bars/categories`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    const cats = Array.isArray(data.data) ? data.data : (data.data?.items || []);
    return cats;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
