import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import {
  addMenuItem,
  updateMenuItem,
  MenuItem,
} from "../../store/slices/menuSlice";

interface MenuItemFormProps {
  open: boolean;
  onClose: () => void;
  editItem?: MenuItem | null;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  open,
  onClose,
  editItem,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    available: true,
    image: "",
    ingredients: [] as string[],
  });
  const [newIngredient, setNewIngredient] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description,
        price: editItem.price.toString(),
        categoryId: editItem.categoryId,
        available: editItem.available,
        image: editItem.image || "",
        ingredients: editItem.ingredients,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        available: true,
        image: "",
        ingredients: [],
      });
    }
    setErrors({});
  }, [editItem, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.categoryId) newErrors.categoryId = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const menuItemData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      categoryId: formData.categoryId,
      available: formData.available,
      image: formData.image.trim(),
      ingredients: formData.ingredients,
    };

    if (editItem) {
      dispatch(
        updateMenuItem({
          ...editItem,
          ...menuItemData,
        })
      );
    } else {
      dispatch(addMenuItem(menuItemData));
    }

    onClose();
  };

  const handleAddIngredient = () => {
    if (
      newIngredient.trim() &&
      !formData.ingredients.includes(newIngredient.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }));
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing !== ingredient),
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editItem ? "Edit Menu Item" : "Add New Menu Item"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                inputProps={{ step: 0.01, min: 0 }}
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                error={!!errors.price}
                helperText={errors.price}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.categoryId}
                  label="Category"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  required
                >
                  {categories.map((category) => (
                    <MuiMenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        available: e.target.checked,
                      }))
                    }
                  />
                }
                label="Available"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Upload Image
                </Button>
              </label>
              {formData.image && (
                <Box mt={2}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ingredients
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  size="small"
                  label="Add ingredient"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddIngredient())
                  }
                />
                <Button
                  variant="outlined"
                  onClick={handleAddIngredient}
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.ingredients.map((ingredient, index) => (
                  <Chip
                    key={index}
                    label={ingredient}
                    onDelete={() => handleRemoveIngredient(ingredient)}
                    deleteIcon={<Close />}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {categories.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              No categories available. Please create a category first.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={categories.length === 0}
          >
            {editItem ? "Update" : "Add"} Item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MenuItemForm;
