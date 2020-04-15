import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NavBar from "./components/NavBar";
import Auth from "./components/auth";

import ProtectedRoute from "./ProtectedRoute";
import WaitingRoom from "./components/protected/WaitingRoom";
import Welcome from "./components/protected/Welcome";
import Match from "./components/protected/Match";

import { theme } from "./themes/theme";
import "./index.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/signin" render={(props) => <Auth {...props} signIn={true} />} />
          <Route exact path="/signup" render={(props) => <Auth {...props} signIn={false} />} />
          <ProtectedRoute exact path="/welcome" component={Welcome} />
          <ProtectedRoute exact path="/waitingroom/:matchId" component={WaitingRoom} />
          <ProtectedRoute exact path="/match/:matchId" component={Match} />
          <Route path="/" component={Auth} />
        </Switch>

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
