
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  ingredients: string[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MenuState {
  items: MenuItem[];
  searchTerm: string;
  selectedCategory: string;
}

const initialItems: MenuItem[] = [
  {
    id: '1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese and croutons',
    price: 12.99,
    categoryId: '1',
    ingredients: ['romaine lettuce', 'parmesan cheese', 'croutons', 'caesar dressing'],
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection with herbs',
    price: 24.99,
    categoryId: '2',
    ingredients: ['salmon', 'herbs', 'lemon', 'olive oil'],
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate ganache',
    price: 8.99,
    categoryId: '3',
    ingredients: ['chocolate', 'flour', 'eggs', 'butter', 'sugar'],
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialState: MenuState = {
  items: JSON.parse(localStorage.getItem('menuItems') || JSON.stringify(initialItems)),
  searchTerm: '',
  selectedCategory: '',
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    addMenuItem: (state, action: PayloadAction<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newItem: MenuItem = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.items.push(newItem);
      localStorage.setItem('menuItems', JSON.stringify(state.items));
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('menuItems', JSON.stringify(state.items));
      }
    },
    deleteMenuItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('menuItems', JSON.stringify(state.items));
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    toggleAvailability: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.available = !item.available;
        item.updatedAt = new Date().toISOString();
        localStorage.setItem('menuItems', JSON.stringify(state.items));
      }
    },
  },
});

export const {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setSearchTerm,
  setSelectedCategory,
  toggleAvailability,
} = menuSlice.actions;
export default menuSlice.reducer;
