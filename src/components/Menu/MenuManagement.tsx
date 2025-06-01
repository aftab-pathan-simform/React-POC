
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Restaurant,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  deleteMenuItem,
  toggleAvailability,
  setSearchTerm,
  setSelectedCategory,
} from '../../store/slices/menuSlice';
import MenuItemForm from './MenuItemForm';
import { MenuItem as MenuItemType } from '../../store/slices/menuSlice';

const MenuManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { items, searchTerm, selectedCategory } = useSelector((state: RootState) => state.menu);
  const { categories } = useSelector((state: RootState) => state.categories);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItemType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItemType | null>(null);
  const [showUnavailable, setShowUnavailable] = useState(true);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || item.categoryId === selectedCategory;
      const matchesAvailability = showUnavailable || item.available;
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [items, searchTerm, selectedCategory, showUnavailable]);

  const handleAddItem = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEditItem = (item: MenuItemType) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDeleteClick = (item: MenuItemType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      dispatch(deleteMenuItem(itemToDelete.id));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleToggleAvailability = (itemId: string) => {
    dispatch(toggleAvailability(itemId));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Menu Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddItem}
          size="large"
        >
          Add Menu Item
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showUnavailable}
                onChange={(e) => setShowUnavailable(e.target.checked)}
              />
            }
            label="Show Unavailable"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            {filteredItems.length} items found
          </Typography>
        </Grid>
      </Grid>

      {/* Menu Items Grid */}
      {filteredItems.length > 0 ? (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.image ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'grey.100',
                    }}
                  >
                    <Restaurant sx={{ fontSize: 60, color: 'grey.400' }} />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {item.description}
                  </Typography>
                  <Box mb={2}>
                    <Chip
                      label={getCategoryName(item.categoryId)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                    {item.ingredients.slice(0, 3).map((ingredient, index) => (
                      <Chip
                        key={index}
                        label={ingredient}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {item.ingredients.length > 3 && (
                      <Chip
                        label={`+${item.ingredients.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Chip
                    label={item.available ? 'Available' : 'Unavailable'}
                    color={item.available ? 'success' : 'error'}
                    size="small"
                  />
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleToggleAvailability(item.id)}
                    color={item.available ? 'warning' : 'success'}
                    title={item.available ? 'Mark as unavailable' : 'Mark as available'}
                  >
                    {item.available ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditItem(item)}
                    color="primary"
                    title="Edit item"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(item)}
                    color="error"
                    title="Delete item"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" sx={{ mt: 4 }}>
          {items.length === 0 
            ? 'No menu items found. Start by adding your first menu item!'
            : 'No items match your current filters.'
          }
        </Alert>
      )}

      {/* Add/Edit Form */}
      <MenuItemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editItem={editItem}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManagement;
