import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import {
  PublishTwoTone,
  KitchenTwoTone,
  ShoppingBasketTwoTone,
} from "@mui/icons-material";
import "./ActionDrawer.css";

interface Props {
  showDrawer: boolean;
  setShowDrawer: (b: boolean) => void;
  setShowShoppingModal: (b: boolean) => void;
  setShowIngredientModal: (b: boolean) => void;
}

export default function ActionDrawer({
  showDrawer,
  setShowDrawer,
  setShowShoppingModal,
  setShowIngredientModal,
}: Props) {
  return (
    <Drawer
      id="calendar-action-drawer"
      variant="permanent"
      className={showDrawer ? "full" : "small"}
    >
      <List>
        <ListItem
          button
          onClick={() => setShowDrawer(!showDrawer)}
          className="action-list-item"
        >
          <ListItemIcon className="action-icon-container">
            <PublishTwoTone
              fontSize="large"
              className={showDrawer ? "drawer-control left" : "drawer-control"}
              color="primary"
            />
          </ListItemIcon>
          <ListItemText
            className={showDrawer ? "" : "hide"}
            primary={<Typography variant="body1">Close</Typography>}
          />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => setShowShoppingModal(true)}
          className="action-list-item"
        >
          <ListItemIcon className="action-icon-container">
            <ShoppingBasketTwoTone fontSize="large" color="primary" />
          </ListItemIcon>
          <ListItemText
            className={showDrawer ? "" : "hide"}
            primary={<Typography variant="body1">Shopping List</Typography>}
          />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => setShowIngredientModal(true)}
          className="action-list-item"
        >
          <ListItemIcon className="action-icon-container">
            <KitchenTwoTone fontSize="large" color="primary" />
          </ListItemIcon>
          <ListItemText
            className={showDrawer ? "" : "hide"}
            primary={<Typography variant="body1">My Pantry</Typography>}
          />
        </ListItem>
      </List>
    </Drawer>
  );
}
