// BaseItem.tsx
export interface BaseItem {
    id: string;
    name: string;
    description: string;
    type: string;
    imageUrl?: string;
  }
  
  export interface Dessert extends BaseItem {}
  export interface Drink extends BaseItem {}