
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface CategoryState {
  categories: Category[];
}

const initialCategories: Category[] = [
  { id: '1', name: 'Appetizers', description: 'Start your meal with these delicious appetizers', createdAt: new Date().toISOString() },
  { id: '2', name: 'Main Courses', description: 'Our signature main dishes', createdAt: new Date().toISOString() },
  { id: '3', name: 'Desserts', description: 'Sweet endings to your meal', createdAt: new Date().toISOString() },
  { id: '4', name: 'Beverages', description: 'Refreshing drinks and beverages', createdAt: new Date().toISOString() },
];

const initialState: CategoryState = {
  categories: JSON.parse(localStorage.getItem('categories') || JSON.stringify(initialCategories)),
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id' | 'createdAt'>>) => {
      const newCategory: Category = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.categories.push(newCategory);
      localStorage.setItem('categories', JSON.stringify(state.categories));
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
        localStorage.setItem('categories', JSON.stringify(state.categories));
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
      localStorage.setItem('categories', JSON.stringify(state.categories));
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;
