import React from "react";
import NavBar from "../../components/general/NavBar";
import Footer from "../../components/general/Footer";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  CardHeader,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  Add,
  Edit,
  Visibility,
  EventAvailable,
  MonetizationOn,
  Timer,
  Delete,
} from "@mui/icons-material";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

interface Props {
  uid: string;
}

export default function HomePage(props: Props) {
  const navigate = useNavigate();

  return (
    <div id="home">
      <NavBar uid={props.uid} />
      <div id="homeContent">
        <div id="back" />
        <div id="title">
          <div>
            <Typography variant="h1">MealPlanner</Typography>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => navigate(props.uid ? "/calendar" : "/signup")}
            >
              <Typography variant="body1" color="secondary">
                Get Started
              </Typography>
            </Button>
          </div>
          <div id="cards">
            <Card>
              <CardHeader
                avatar={<Add color="primary" />}
                title={
                  <Typography variant="body1">Add Meals to Calendar</Typography>
                }
                subheader={
                  <Typography variant="body2" color="textSecondary">
                    Input details to plan out your meals!
                  </Typography>
                }
              />
              <Divider />
              <CardMedia
                className="focusimg"
                component="img"
                src="/addmeals.webp"
                title="add meals"
                alt="adding meals to the calendar"
                style={{ width: "min(400px, 100vw)" }}
              />
              <Divider />
              <CardActions>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(props.uid ? "/calendar" : "/signup")}
                >
                  Try it yourself!
                </Button>
              </CardActions>
            </Card>
            <Card>
              <CardHeader
                avatar={<Edit color="primary" />}
                title={
                  <Typography variant="body1">
                    Set Ingredients You Have
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="textSecondary">
                    Your shopping list will adjust accordingly!
                  </Typography>
                }
              />
              <Divider />
              <CardMedia
                component="img"
                src="/setings.webp"
                title="set ingredients"
                alt="setting ingredients you already have"
                style={{ width: "min(400px, 100vw)" }}
              />
              <Divider />
              <CardActions>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(props.uid ? "/calendar" : "/signup")}
                >
                  Try it yourself!
                </Button>
              </CardActions>
            </Card>
            <Card>
              <CardHeader
                avatar={<Visibility color="primary" />}
                title={
                  <Typography variant="body1">View Shopping List</Typography>
                }
                subheader={
                  <Typography variant="body2" color="textSecondary">
                    Ingredients are added as needed!
                  </Typography>
                }
              />
              <Divider />
              <CardMedia
                component="img"
                src="/shoplist.webp"
                title="view shopping list"
                alt="viewing the shopping list"
                style={{ width: "min(400px, 100vw)" }}
              />
              <Divider />
              <CardActions>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(props.uid ? "/calendar" : "/signup")}
                >
                  Try it yourself!
                </Button>
              </CardActions>
            </Card>
          </div>
          <List
            className="reasonsList"
            subheader={
              <Typography variant="h5">Why Use MealPlanner?</Typography>
            }
          >
            <ListItem>
              <ListItemAvatar>
                <EventAvailable color="primary" fontSize="large" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1">Stick to a Plan!</Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    Whatever diet or meal plan you follow, we make it easy for
                    you to stick to it
                  </Typography>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <MonetizationOn color="primary" fontSize="large" />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="body1">Save Money!</Typography>}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    Easily plan out what you'll eat to avoid overspending
                  </Typography>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Timer color="primary" fontSize="large" />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="body1">Save Time!</Typography>}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    When you shop, you'll know exactly what to get. No more
                    wandering the aisles
                  </Typography>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Delete color="primary" fontSize="large" />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="body1">Avoid Waste!</Typography>}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    By planning out your meals, avoid buying things you won't
                    eat
                  </Typography>
                }
              />
            </ListItem>
          </List>
          <Footer />
        </div>
      </div>
    </div>
  );
}
