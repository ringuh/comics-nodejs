import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import Portal from './components/portal'
import Logout from './components/logout'
import PageNotFound from './components/page_not_found'
import Footer from './components/page_footer'
import Header from './components/page_header'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'



function App() {
  return (
    <Box component="div" className="App" >
      <CssBaseline />

      <BrowserRouter>
        <Header />
        <Container maxWidth="lg">
          {global.user &&
            <Switch>
              <Route exact path={["/", "/:date"]} component={Portal} />
             {/*  <Route exact path="/novel" component={NovelList} />
              <Route exact path="/novel/:alias" component={Novel} />
              <Route exact path={[
                `/novel/:alias/chapter`,
                `/novel/:alias/chapter/:order`
              ]} component={Chapter} /> */}
              <Route exact path="/logout" component={Logout} />
              <Route component={PageNotFound} />
            </Switch>
          }{!global.user &&
            <Switch>
              <Route exact path="/" component={Portal} />
              <Route component={PageNotFound} />
            </Switch>
          }
        </Container>
      </BrowserRouter>
      <Footer />
    </Box>
  );
}

export default App;
