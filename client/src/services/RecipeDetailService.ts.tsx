import React, { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  title: string;
  imageUrl?: string;
  ingredients: string[];
  instructions: string[];
  pairings?: Pairing[];
  customPairings?: Pairing[];
}

interface Pairing {
  id: string;
  type: 'drink' | 'dessert';
  name: string;
  description: string;
  imageUrl?: string;
}

interface RecipeDetailProps {
  recipeId: string;
  spoonacularApiKey: string;
  onSave?: (recipe: Recipe) => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipeId, spoonacularApiKey, onSave }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${spoonacularApiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }

      const data = await response.json();
      
      const recipeData: Recipe = {
        id: data.id.toString(),
        title: data.title,
        imageUrl: data.image,
        ingredients: data.extendedIngredients?.map((ing: any) => ing.original) || [],
        instructions: data.instructions?.split('\n').filter(Boolean) || [],
        pairings: []
      };

      // Example pairings
      const defaultPairings: Pairing[] = [
        {
          id: '1',
          type: 'drink',
          name: 'Classic Wine Pairing',
          description: 'A carefully selected wine to complement your meal'
        },
        {
          id: '2',
          type: 'dessert',
          name: 'Recommended Dessert',
          description: 'A dessert that perfectly complements the flavors of your meal'
        }
      ];

      recipeData.pairings = defaultPairings;
      setRecipe(recipeData);
    } catch (err) {
      setError('Failed to load recipe details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId, spoonacularApiKey]);

  const handleSaveRecipe = async () => {
    if (!recipe) return;

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        setSaveStatus('Please log in to save recipes');
        return;
      }

      const response = await fetch('/api/user/save-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          recipe: {
            ...recipe,
            savedAt: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      setSaveStatus('Recipe saved successfully!');
      if (onSave) {
        onSave(recipe);
      }
    } catch (err) {
      setSaveStatus('Failed to save recipe');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error || 'Recipe not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <button
            onClick={handleSaveRecipe}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Recipe
          </button>
        </div>

        {saveStatus && (
          <div className={`p-4 mb-6 rounded-lg ${
            saveStatus.includes('success')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {saveStatus}
          </div>
        )}

        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="pl-4">
                  <span className="font-medium">{index + 1}.</span> {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Perfect Pairings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.pairings?.map((pairing) => (
              <div 
                key={pairing.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <h3 className="font-semibold text-lg">{pairing.name}</h3>
                <p className="text-gray-600 mt-2">{pairing.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;