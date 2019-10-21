import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import ListComics from './components/comic/list_comics'
import Portal from './components/portal'
import Logout from './components/logout'
import ComicIndex from './components/comic'
import PageNotFound from './components/page_not_found'
import Footer from './components/page_footer'
import Header from './components/page_header'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'


function App() {
  return (
    <Box component="div" className="App" >
      <CssBaseline />

      <BrowserRouter>
        <Header />
        <Container maxWidth="lg">
          {global.user &&
            <Switch>
              <Route exact path="/logout" component={Logout} />
              <Route exact path={["/comic"]} component={ListComics} />
              <Route path={["/comic/:alias", /* "/comic/:alias/:order" */]} component={ComicIndex} />
              <Route exact path={["/", "/:date"]} component={Portal} />
              {/*  <Route exact path="/novel" component={NovelList} />
              <Route exact path="/novel/:alias" component={Novel} />
              <Route exact path={[
                `/novel/:alias/chapter`,
                `/novel/:alias/chapter/:order`
              ]} component={Chapter} /> */}

              <Route component={PageNotFound} />
            </Switch>
          }{!global.user &&
            <Paper style={{ margin: "2em", padding: "2em", minHeight: "20vh" }}>
              <Typography variant="h4" color="textSecondary">
                <img style={{ maxWidth: "100%" }} src="frontpage.webp" />
                Maybe log in?
              </Typography>
            </Paper>

          }
        </Container>
      </BrowserRouter>
      <Footer />
    </Box>
  );
}

export default App;
