import React from 'react';
import { Recipe } from '../interfaces/recipe';
import PairingDisplay from './PairingDisplay';
import '../styles/recipecard.css';

interface RecipeCardProps {
  recipe: Recipe;
  recipeId: string;
  onSave: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  isSaved: boolean;
  showSaveDelete: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  recipeId, 
  onSave, 
  onDelete, 
  isSaved,
  showSaveDelete
}) => {
  if (!recipe) {
    return null;
  }

  // Format ingredient display
  const displayIngredients = () => {
    if (recipe.missedIngredients && recipe.missedIngredients.length > 0) {
      return [...(recipe.usedIngredients || []), ...recipe.missedIngredients];
    }
    return recipe.ingredients || [];
  };

  // Count stats
  const getMissingIngredientsCount = () => {
    return recipe.missedIngredientCount || 0;
  };

  const getMatchingIngredientsCount = () => {
    return recipe.usedIngredientCount || 0;
  };

  return (
    <div className="recipe-card">
      {recipe.imageUrl && (
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-primary-teal">{recipe.title}</h3>
        
        {recipe.foodGroup && (
          <p className="text-gray-600 mb-4">Food Group: {recipe.foodGroup}</p>
        )}

        {/* Ingredient Matching Stats */}
        {recipe.searchMode && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Matching Ingredients: {getMatchingIngredientsCount()}
            </p>
            <p className="text-sm text-gray-600">
              Missing Ingredients: {getMissingIngredientsCount()}
            </p>
          </div>
        )}
        
        <div className="mb-4">
          <h4 className="font-medium text-primary-orange mb-2">Ingredients:</h4>
          <div className="flex flex-wrap gap-2">
            {displayIngredients().map((ingredient, index) => (
              <span
                key={index}
                className="ingredient-tag"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-primary-orange mb-2">Instructions:</h4>
            <ol className="list-decimal pl-5">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="mb-2 text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Pairing Display */}
        {recipe.pairings && recipe.pairings.length > 0 && (
          <PairingDisplay recipe={recipe} />
        )}

        {/* Save/Delete Buttons */}
        {showSaveDelete && (
          <div className="flex gap-2 mt-4">
            {!isSaved ? (
              <button
                onClick={() => onSave(recipe)}
                className="button"
              >
                Save Recipe
              </button>
            ) : (
              <button
                onClick={() => onDelete(recipeId)}
                className="button-secondary"
              >
                Remove from Saved
              </button>
            )}
            
            <div className="mt-4 w-full">
              {recipe.sourceUrl && (
                <a 
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button w-full text-center"
                >
                  View Full Recipe & Directions
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;