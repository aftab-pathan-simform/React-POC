import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Restaurant,
  Category,
  TrendingUp,
  AttachMoney,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Dashboard: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.menu);
  const { categories } = useSelector((state: RootState) => state.categories);

  const totalMenuItems = items.length;
  const availableItems = items.filter((item) => item.available).length;
  const totalCategories = categories.length;
  const averagePrice =
    items.length > 0
      ? (
          items.reduce((sum, item) => sum + item.price, 0) / items.length
        ).toFixed(2)
      : "0.00";

  const recentItems = items;
  // .sort(
  //   (a, b) =>
  //     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  // )
  // .slice(0, 5);

  const stats = [
    {
      title: "Total Menu Items",
      value: totalMenuItems,
      icon: Restaurant,
      color: "primary.main",
    },
    {
      title: "Available Items",
      value: availableItems,
      icon: TrendingUp,
      color: "success.main",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: Category,
      color: "info.main",
    },
    {
      title: "Average Price",
      value: `$${averagePrice}`,
      icon: AttachMoney,
      color: "warning.main",
    },
  ];

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <stat.icon
                      sx={{ color: stat.color, fontSize: 40, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Recent Menu Items
            </Typography>
            {recentItems.length > 0 ? (
              <List>
                {recentItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Restaurant />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={`$${item.price.toFixed(
                          2
                        )} - ${getCategoryName(item.categoryId)}`}
                      />
                    </ListItem>
                    {index < recentItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No menu items found. Add your first menu item to get started!
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Categories Overview
            </Typography>
            {categories.length > 0 ? (
              <List>
                {categories.map((category, index) => {
                  const itemCount = items.filter(
                    (item) => item.categoryId === category.id
                  ).length;
                  return (
                    <React.Fragment key={category.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Category />
                        </ListItemIcon>
                        <ListItemText
                          primary={category.name}
                          secondary={`${itemCount} items`}
                        />
                      </ListItem>
                      {index < categories.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            ) : (
              <Typography color="text.secondary">
                No categories found. Create your first category to organize your
                menu!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
