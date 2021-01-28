import React, { Component } from 'react'
import NavBar from '../NavBar'
import { Button, Card, CardActions, CardContent, Typography, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'
import './style.css'

export class HomePage extends Component {
  render () {
    return (
      <div id='home'>
        <NavBar uid={this.props.uid} />
        <div id='homeContent'>
          <div id='back' />
          <div id='title'>
            <div>
              <Typography variant='h1'>MealPlanner</Typography>
              <Button variant='contained' color='primary' onClick={() => window.open('/calendar', '_self')}>Get Started</Button>
            </div>
            <div id='cards'>
              <Card>
                <CardContent>
                  <Typography variant='h6'>
                    Add meals to your calendar
                  </Typography>
                  <hr />
                  <Typography variant='body1'>
                    Input meal details to plan for your week. <br />
                    Click on any day to add more meals or <br />
                    view the meals you've set!
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant='contained' size='small'>Try it yourself!</Button>
                </CardActions>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant='h6'>
                    Set the ingredients you have
                  </Typography>
                  <hr />
                  <Typography variant='body1'>
                    Input ingredient names and quantities <br />
                    for what you already have. Your<br />
                    shopping list will adjust accordingly!
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant='contained' size='small'>Try it yourself!</Button>
                </CardActions>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant='h6'>
                    View your shopping list
                  </Typography>
                  <hr />
                  <Typography variant='body1'>
                    Ingredients needed for your meals will<br />
                    automatically be added to your list!
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant='contained' size='small'>Try it yourself!</Button>
                </CardActions>
              </Card>
            </div>
            <div id='purpose'>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary='Stick to a Plan!'
                    secondary='Whatever diet or meal plan you follow, we make it easy for you to stick to it!'
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary='Save Money!'
                    secondary="Easily plan out what you'll eat when to avoid overspending"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary='Save Time!'
                    secondary="When you shop, you'll know exactly what to get. No more wandering the aisles!"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary='Avoid Waste!'
                    secondary="By planning out your meals, avoid buying things you won't eat."
                  />
                </ListItem>
              </List>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage
