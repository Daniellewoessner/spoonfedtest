import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Recipe } from '../interfaces/recipe';

const API_BASE_URL = 'http://localhost:3001/api/users/save-recipe';

const SavedRecipes: React.FC = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSavedRecipes = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        throw new Error('No user ID or token found');
      }

      const response = await axios.get(
        `${API_BASE_URL}/${userId}/saved-recipes`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSavedRecipes(response.data.savedRecipes || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to load recipes');
      } else {
        setError('Failed to load recipes');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const handleClearRecipes = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        throw new Error('No user ID or token found');
      }

      // Assuming you have an endpoint to clear all saved recipes
      await axios.delete(
        `${API_BASE_URL}/${userId}/saved-recipes`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSavedRecipes([]);
    } catch (error) {
      console.error('Failed to clear recipes:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to clear recipes');
      } else {
        setError('Failed to clear recipes');
      }
    }
  };

  const handleRemoveRecipe = async (recipeId: string) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        throw new Error('No user ID or token found');
      }

      await axios.delete(
        `${API_BASE_URL}/${userId}/saved-recipes/${recipeId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSavedRecipes(current => current.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Failed to remove recipe:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to remove recipe');
      } else {
        setError('Failed to remove recipe');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="text-center p-6">
        No recipes have been saved yet
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Saved Recipes</h1>
        <button
          onClick={handleClearRecipes}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedRecipes.map(recipe => (
          <div 
            key={recipe.id} 
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                  Food Group: {recipe.foodGroup || 'Unspecified'}
                </span>
                <button
                  onClick={() => handleRemoveRecipe(recipe.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;