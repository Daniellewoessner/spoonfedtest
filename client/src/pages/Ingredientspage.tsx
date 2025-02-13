// src/pages/IngredientsPage.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../interfaces/recipe';
import "../styles/Ingredientpage.css";

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = import.meta.env.VITE_SPOONACULAR_BASE_URL || 'https://api.spoonacular.com/recipes';

const allIngredients = [
  // Proteins
  'Chicken', 'Beef', 'Pork', 'Turkey', 'Lamb', 
  'Salmon', 'Tuna', 'Shrimp', 'Tofu', 'Eggs', 
  'Tempeh', 'Seitan', 'Ground Beef', 'Chicken Breast',

  // Vegetables
  'Tomatoes', 'Onions', 'Garlic', 'Bell Peppers', 'Spinach', 
  'Broccoli', 'Carrots', 'Zucchini', 'Eggplant', 'Mushrooms', 
  'Cucumber', 'Lettuce', 'Kale', 'Cauliflower', 'Asparagus', 
  'Green Beans', 'Sweet Potato', 'Potato', 'Corn', 'Peas',

  // Fruits
  'Apples', 'Bananas', 'Oranges', 'Lemons', 'Limes', 
  'Strawberries', 'Blueberries', 'Raspberries', 'Avocado', 
  'Mango', 'Pineapple', 'Grapes', 'Kiwi', 'Peach',

  // Grains and Starches
  'Rice', 'Pasta', 'Bread', 'Quinoa', 'Couscous', 
  'Noodles', 'Tortillas', 'Oats', 'Bulgur', 'Barley',

  // Dairy and Alternatives
  'Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 
  'Sour Cream', 'Almond Milk', 'Coconut Milk',

  // Herbs and Spices
  'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Parsley', 
  'Cilantro', 'Mint', 'Dill', 'Cumin', 'Paprika', 
  'Cinnamon', 'Ginger', 'Turmeric', 'Chili Powder',

  // Legumes
  'Black Beans', 'Kidney Beans', 'Chickpeas', 'Lentils', 
  'Green Beans', 'Edamame', 'Pinto Beans',

  // Nuts and Seeds
  'Almonds', 'Walnuts', 'Pecans', 'Cashews', 'Peanuts', 
  'Sunflower Seeds', 'Chia Seeds', 'Pumpkin Seeds',

  // Condiments and Sauces
  'Olive Oil', 'Soy Sauce', 'Honey', 'Maple Syrup', 'Mustard', 
  'Ketchup', 'Vinegar', 'Hot Sauce', 'Mayonnaise', 'Salsa',

  // Baking Ingredients
  'Flour', 'Sugar', 'Baking Powder', 'Baking Soda', 'Cocoa Powder', 
  'Vanilla Extract', 'Chocolate Chips',

  // International Ingredients
  'Coconut', 'Kimchi', 'Miso', 'Saffron', 'Tahini', 
  'Curry Paste', 'Harissa', 'Seaweed', 'Wasabi'
];

// Ingredient Categories
const ingredientCategories = {
  Proteins: ['Chicken', 'Beef', 'Pork', 'Turkey', 'Lamb', 'Salmon', 'Tuna', 'Shrimp', 'Tofu', 'Eggs'],
  Vegetables: ['Tomatoes', 'Onions', 'Garlic', 'Bell Peppers', 'Spinach', 'Broccoli', 'Carrots', 'Zucchini'],
  Fruits: ['Apples', 'Bananas', 'Oranges', 'Lemons', 'Strawberries', 'Blueberries', 'Avocado'],
  Grains: ['Rice', 'Pasta', 'Bread', 'Quinoa', 'Oats', 'Tortillas'],
  DairyAndAlternatives: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Almond Milk'],
  HerbsAndSpices: ['Basil', 'Oregano', 'Thyme', 'Rosemary', 'Cumin', 'Paprika'],
  Legumes: ['Black Beans', 'Kidney Beans', 'Chickpeas', 'Lentils'],
  NutsAndSeeds: ['Almonds', 'Walnuts', 'Pecans', 'Cashews', 'Sunflower Seeds'],
  CondimentsAndSauces: ['Olive Oil', 'Soy Sauce', 'Honey', 'Mustard', 'Ketchup'],
  InternationalIngredients: ['Coconut', 'Kimchi', 'Miso', 'Curry Paste', 'Harissa']
};

export const IngredientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    // Log for debugging (remove in production)
    console.log('API Key available:', !!SPOONACULAR_API_KEY);
    console.log('Base URL:', SPOONACULAR_BASE_URL);
    
    if (!SPOONACULAR_API_KEY) {
      setError('API configuration error. Please contact support.');
      console.error('SPOONACULAR_API_KEY is not defined in environment variables');
    }
  }, []);

  const handleIngredientInteraction = (ingredient: string, mode: 'navigate' | 'select' = 'navigate') => {
    if (mode === 'navigate') {
      navigate(`/ingredient/${ingredient.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      setSelectedIngredients(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ingredient)) {
          newSet.delete(ingredient);
        } else {
          newSet.add(ingredient);
        }
        return newSet;
      });
    }
  };

  const searchRecipes = useCallback(async () => {
    if (selectedIngredients.size === 0) {
      setError('Please select at least one ingredient');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const ingredientsString = Array.from(selectedIngredients).join(',');
      const response = await fetch(
        `${SPOONACULAR_BASE_URL}/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${ingredientsString}&number=6`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      
      const detailedRecipes = await Promise.all(
        data.map(async (recipe: any) => {
          const detailResponse = await fetch(
            `${SPOONACULAR_BASE_URL}/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`
          );
          
          if (!detailResponse.ok) {
            throw new Error('Failed to fetch recipe details');
          }

          const detailData = await detailResponse.json();
          
          return {
            id: recipe.id.toString(),
            title: recipe.title,
            imageUrl: recipe.image,
            image: recipe.image,
            ingredients: detailData.extendedIngredients?.map((ing: any) => ing.original) || [],
            instructions: detailData.instructions?.split('\n').filter(Boolean) || [],
            usedIngredients: recipe.usedIngredients.map((ing: any) => ing.name),
            missedIngredients: recipe.missedIngredients.map((ing: any) => ing.name),
            usedIngredientCount: recipe.usedIngredientCount,
            missedIngredientCount: recipe.missedIngredientCount,
            pairings: [],
            isFavorite: false,
            searchMode: true,
            foodGroup: '',
            sourceUrl: detailData.sourceUrl,
            matchingIngredients: recipe.usedIngredients.map((ing: any) => ing.name).join(', '),
            name: recipe.title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        })
      );

      setRecipes(detailedRecipes);

      if (detailedRecipes.length === 0) {
        setError('No recipes found with selected ingredients');
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setError(error instanceof Error ? error.message : 'Failed to search recipes');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedIngredients]);

  const filteredIngredients = useMemo(() => {
    return allIngredients.filter(ingredient => 
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="ingredients-page">
      <div className="ingredients-container">
        <h1 className="page-title">Ingredients Library</h1>

        {/* Search Section */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          
          <div className="search-actions">
            <span className="selected-count">
              Selected: {selectedIngredients.size}
            </span>
            <button
              onClick={searchRecipes}
              disabled={selectedIngredients.size === 0 || isLoading}
              className="generate-button"
            >
              {isLoading ? 'Searching...' : 'Find Recipes'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Recipes Section */}
        {recipes.length > 0 && (
          <div className="recipes-section">
            <h2 className="section-title">Found Recipes</h2>
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
                  <h3>{recipe.title}</h3>
                  <div className="recipe-ingredients">
                    <p>Used Ingredients: {recipe.usedIngredientCount}</p>
                    <p>Missing Ingredients: {recipe.missedIngredientCount}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    className="view-recipe-btn"
                  >
                    View Recipe
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Available Ingredients Section */}
        <h2 className="section-title">Available Ingredients</h2>
        <div className="ingredients-grid">
          {filteredIngredients.map((ingredient, index) => (
            <div
              key={index}
              className={`ingredient-card ${selectedIngredients.has(ingredient) ? 'selected' : ''}`}
            >
              <div 
                className="ingredient-name"
                onClick={() => handleIngredientInteraction(ingredient, 'navigate')}
              >
                {ingredient}
              </div>
              <button 
                className="ingredient-select-btn"
                onClick={() => handleIngredientInteraction(ingredient, 'select')}
              >
                {selectedIngredients.has(ingredient) ? '✓' : '+'}
              </button>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <h2 className="section-title">Browse by Category</h2>
        {Object.entries(ingredientCategories).map(([category, ingredients]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <div className="ingredients-grid">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`ingredient-card ${selectedIngredients.has(ingredient) ? 'selected' : ''}`}
                >
                  <div 
                    className="ingredient-name"
                    onClick={() => handleIngredientInteraction(ingredient, 'navigate')}
                  >
                    {ingredient}
                  </div>
                  <button 
                    className="ingredient-select-btn"
                    onClick={() => handleIngredientInteraction(ingredient, 'select')}
                  >
                    {selectedIngredients.has(ingredient) ? '✓' : '+'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsPage;