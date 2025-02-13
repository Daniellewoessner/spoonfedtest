// savedRecipeAPI.tsx
import Auth from '../../utils/auth';

interface SavedRecipe {
  id: string;
  userName: string;
  recipeId: string;
  // Add more fields as needed
}

const getSavedRecipes = async (userId: string): Promise<SavedRecipe[]> => {
  try {
    const response = await fetch(`/api/users/${userId}/saved-recipes`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to retrieve saved recipes');
    }

    return data;
  } catch (err) {
    console.log('Error retrieving saved recipes:', err);
    return [];
  }
};

const saveRecipe = async (userId: string, recipeId: string): Promise<SavedRecipe> => {
  try {
    const response = await fetch(`/api/users/${userId}/saved-recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      body: JSON.stringify({ recipeId }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to save recipe');
    }

    return data;
  } catch (err) {
    console.log('Error saving recipe:', err);
    throw err;
  }
};

export { getSavedRecipes, saveRecipe };