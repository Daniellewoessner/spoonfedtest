import React, { useState } from 'react';
import { Recipe } from '../interfaces/recipe';

interface PairingDisplayProps {
  recipe: Recipe;
}

const PairingDisplay: React.FC<PairingDisplayProps> = ({ recipe }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const drinks = recipe.pairings?.filter(p => p.type === 'drink') || [];
  const desserts = recipe.pairings?.filter(p => p.type === 'dessert') || [];

  if (!drinks.length && !desserts.length) {
    return null;
  }

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderPairingCard = (pairing: any) => (
    <div 
      key={pairing.id} 
      className="border rounded-lg overflow-hidden mb-2 w-full"
    >
      <div 
        className="flex items-center p-3 cursor-pointer"
        onClick={() => toggleExpanded(pairing.id)}
      >
        {pairing.imageUrl && (
          <img 
            src={pairing.imageUrl} 
            alt={pairing.name}
            className="w-16 h-16 object-cover rounded mr-3"
          />
        )}
        <div className="flex-grow">
          <h5 className="font-medium">{pairing.name}</h5>
          <p className="text-sm text-gray-600">{pairing.description}</p>
        </div>
      </div>

      {expandedId === pairing.id && (
        <div className="p-3 border-t">
          {pairing.instructions && (
            <div className="mb-3">
              <h6 className="font-medium mb-1">Instructions:</h6>
              <p className="text-sm">{pairing.instructions}</p>
            </div>
          )}
          
          {pairing.ingredients && pairing.ingredients.length > 0 && (
            <div>
              <h6 className="font-medium mb-1">Ingredients:</h6>
              <ul className="text-sm">
                {pairing.ingredients.map((ing: any, index: number) => (
                  <li key={index}>
                    {ing.measure} {ing.ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-4">
      <h4 className="font-medium text-primary-orange mb-2">Suggested Pairings:</h4>
      
      {drinks.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium mb-2">Drink Pairings:</h5>
          <div className="space-y-2">
            {drinks.map(renderPairingCard)}
          </div>
        </div>
      )}

      {desserts.length > 0 && (
        <div>
          <h5 className="text-sm font-medium mb-2">Dessert Pairings:</h5>
          <div className="space-y-2">
            {desserts.map(renderPairingCard)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PairingDisplay;